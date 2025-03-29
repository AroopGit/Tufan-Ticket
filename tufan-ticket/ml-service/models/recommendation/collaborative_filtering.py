import numpy as np
import pandas as pd
from sklearn.decomposition import NMF
from sklearn.preprocessing import normalize

class CollaborativeFilteringModel:
    def __init__(self, n_factors=20):
        self.n_factors = n_factors
        self.model = NMF(n_components=n_factors, init='random', random_state=42)
        self.user_factors = None
        self.item_factors = None
        self.user_mapping = {}
        self.item_mapping = {}
        self.reverse_user_mapping = {}
        self.reverse_item_mapping = {}
    
    def _create_user_item_matrix(self, interactions_df):
        # Create user-item interaction matrix with implicit feedback
        # Weight different interaction types: purchase > click > view
        weighted_interactions = interactions_df.copy()
        weight_map = {'view': 1, 'click': 3, 'purchase': 10}
        weighted_interactions['weight'] = weighted_interactions['interaction_type'].map(weight_map)
        
        # Aggregate interactions by user and item
        user_item_df = weighted_interactions.groupby(['user_id', 'event_id'])['weight'].sum().reset_index()
        
        # Create mappings
        unique_users = user_item_df['user_id'].unique()
        unique_items = user_item_df['event_id'].unique()
        
        self.user_mapping = {user: i for i, user in enumerate(unique_users)}
        self.item_mapping = {item: i for i, item in enumerate(unique_items)}
        self.reverse_user_mapping = {i: user for user, i in self.user_mapping.items()}
        self.reverse_item_mapping = {i: item for item, i in self.item_mapping.items()}
        
        # Create sparse matrix
        rows = user_item_df['user_id'].map(self.user_mapping)
        cols = user_item_df['event_id'].map(self.item_mapping)
        data = user_item_df['weight']
        
        # Create and normalize the matrix
        matrix = np.zeros((len(unique_users), len(unique_items)))
        for i, (r, c, d) in enumerate(zip(rows, cols, data)):
            matrix[r, c] = d
        
        # Log-transform interactions to dampen the effect of very popular items
        matrix = np.log1p(matrix)
        
        return matrix
    
    def fit(self, interactions_df):
        """Train the collaborative filtering model using NMF"""
        user_item_matrix = self._create_user_item_matrix(interactions_df)
        
        # Fit NMF model
        self.user_factors = self.model.fit_transform(user_item_matrix)
        self.item_factors = self.model.components_.T
        
        return self
    
    def get_user_recommendations(self, user_id, interactions_df, top_n=10, exclude_seen=True):
        """Get top N recommendations for a specific user"""
        # Check if model is fitted
        if self.user_factors is None:
            self.fit(interactions_df)
        
        # Check if user exists in training data
        if user_id not in self.user_mapping:
            # Cold start - return popular items
            return self._get_popular_items(interactions_df, top_n)
        
        user_idx = self.user_mapping[user_id]
        user_vector = self.user_factors[user_idx].reshape(1, -1)
        
        # Calculate predicted ratings
        pred_ratings = np.dot(user_vector, self.item_factors.T).flatten()
        
        # Get indices of top N items
        if exclude_seen:
            # Get items the user has already interacted with
            seen_items = interactions_df[interactions_df['user_id'] == user_id]['event_id'].unique()
            seen_indices = [self.item_mapping[item] for item in seen_items if item in self.item_mapping]
            
            # Set ratings of seen items to negative infinity
            pred_ratings[seen_indices] = float('-inf')
        
        top_item_indices = np.argsort(pred_ratings)[::-1][:top_n]
        
        # Convert back to event IDs
        top_items = [self.reverse_item_mapping[idx] for idx in top_item_indices]
        
        return top_items
    
    def _get_popular_items(self, interactions_df, top_n=10):
        """Get most popular items based on interaction counts"""
        # Weight purchases more heavily
        weighted_interactions = interactions_df.copy()
        weight_map = {'view': 1, 'click': 3, 'purchase': 10}
        weighted_interactions['weight'] = weighted_interactions['interaction_type'].map(weight_map)
        
        # Get popularity scores
        popularity = weighted_interactions.groupby('event_id')['weight'].sum().reset_index()
        popularity = popularity.sort_values('weight', ascending=False).head(top_n)
        
        return popularity['event_id'].tolist()
    
    def get_recommendations(self, user_id, interactions_df, events_df, limit=10):
        """Get recommendations and join with events data"""
        # Get recommendation event IDs
        rec_event_ids = self.get_user_recommendations(
            user_id, 
            interactions_df, 
            top_n=limit, 
            exclude_seen=True
        )
        
        # Filter events dataframe to recommended events
        recommended_events = events_df[events_df['event_id'].isin(rec_event_ids)].copy()
        
        # Add a score/rank column based on the order of recommendations
        rec_ranks = {event_id: rank for rank, event_id in enumerate(rec_event_ids)}
        recommended_events['rec_score'] = recommended_events['event_id'].map(rec_ranks)
        
        # Sort by recommendation score
        recommended_events = recommended_events.sort_values('rec_score')
        
        return recommended_events