import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ContentBasedRecommender:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            min_df=2,
            max_features=5000,
            ngram_range=(1, 2)
        )
        self.item_features = None
        self.event_ids = None
    
    def fit(self, events_df):
        """Generate item features based on event metadata"""
        # Prepare feature text by combining relevant fields
        events_df['features_text'] = events_df.apply(
            lambda row: f"{row['title']} {row['category']} {row['location']}", 
            axis=1
        )
        
        # Generate TF-IDF features
        self.item_features = self.tfidf_vectorizer.fit_transform(events_df['features_text'])
        self.event_ids = events_df['event_id'].tolist()
        
        return self
    
    def get_similar_items(self, item_id, events_df, top_n=10):
        """Get top N most similar items to a given item"""
        # Check if model is fitted
        if self.item_features is None:
            self.fit(events_df)
        
        # Find index of the item
        try:
            idx = self.event_ids.index(item_id)
        except ValueError:
            # Item not found in training data
            return []
        
        # Get the item's feature vector
        item_vector = self.item_features[idx]
        
        # Calculate similarity with all items
        similarities = cosine_similarity(item_vector, self.item_features).flatten()
        
        # Get indices of top similar items (excluding itself)
        similar_indices = np.argsort(similarities)[::-1][1:top_n+1]
        
        # Convert indices to item IDs
        similar_items = [self.event_ids[idx] for idx in similar_indices]
        
        return similar_items
    
    def get_user_preferences(self, user_id, interactions_df, events_df):
        """Extract user preferences based on past interactions"""
        # Get user's interactions
        user_interactions = interactions_df[interactions_df['user_id'] == user_id]
        
        if user_interactions.empty:
            return None
        
        # Weight different interaction types
        weight_map = {'view': 1, 'click': 3, 'purchase': 10}
        user_interactions['weight'] = user_interactions['interaction_type'].map(weight_map)
        
        # Group by event and get total weight
        user_events = user_interactions.groupby('event_id')['weight'].sum().reset_index()
        user_events = user_events.sort_values('weight', ascending=False)
        
        # Get the events the user has interacted with
        interacted_events = events_df[events_df['event_id'].isin(user_events['event_id'])]
        
        return interacted_events
    
    def get_recommendations(self, user_id, interactions_df, events_df, limit=10):
        """Get content-based recommendations for a user"""
        # Get user's preferred events
        user_events = self.get_user_preferences(user_id, interactions_df, events_df)
        
        if user_events is None or user_events.empty:
            # No user history available - return popular items by category
            return events_df.sample(min(limit, len(events_df)))
        
        # Ensure model is fitted
        if self.item_features is None:
            self.fit(events_df)
        
        # Get similar items for each of the user's interacted items
        # Weight by interaction strength
        similar_items = {}
        for _, event in user_events.iterrows():
            event_id = event['event_id']
            event_similars = self.get_similar_items(event_id, events_df, top_n=limit)
            
            for similar_id in event_similars:
                if similar_id not in similar_items:
                    similar_items[similar_id] = 0
                
                # Increment score for this similar item
                similar_items[similar_id] += 1
        
        # Sort by score
        sorted_items = sorted(similar_items.items(), key=lambda x: x[1], reverse=True)
        
        # Get top recommendations
        top_event_ids = [item[0] for item in sorted_items[:limit]]
        
        # Filter to recommended events
        recommended_events = events_df[events_df['event_id'].isin(top_event_ids)].copy()
        
        # Add recommendation score
        rec_scores = {event_id: score for event_id, score in sorted_items if event_id in top_event_ids}
        recommended_events['rec_score'] = recommended_events['event_id'].map(rec_scores)
        
        # Sort by recommendation score
        recommended_events = recommended_events.sort_values('rec_score', ascending=False)
        
        return recommended_events