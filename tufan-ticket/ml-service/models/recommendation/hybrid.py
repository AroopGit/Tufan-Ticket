import pandas as pd
import numpy as np

class HybridRecommender:
    def __init__(self, collaborative_model, content_model, collab_weight=0.7):
        self.collaborative_model = collaborative_model
        self.content_model = content_model
        self.collab_weight = collab_weight
        self.content_weight = 1 - collab_weight
    
    def get_recommendations(self, user_id, interactions_df, events_df, limit=10):
        """Get hybrid recommendations combining collaborative and content-based filtering"""
        # Get collaborative filtering recommendations
        collab_recs = self.collaborative_model.get_recommendations(
            user_id, 
            interactions_df, 
            events_df, 
            limit=limit*2  # Get more recs to ensure enough diversity
        )
        
        # Get content-based recommendations
        content_recs = self.content_model.get_recommendations(
            user_id, 
            interactions_df, 
            events_df, 
            limit=limit*2  # Get more recs to ensure enough diversity
        )
        
        # If either model couldn't provide recommendations, use the other one
        if collab_recs.empty:
            return content_recs.head(limit)
        elif content_recs.empty:
            return collab_recs.head(limit)
        
        # Combine and weight recommendations
        collab_recs['model'] = 'collaborative'
        content_recs['model'] = 'content'
        
        # Normalize scores within each model
        for df in [collab_recs, content_recs]:
            max_score = df['rec_score'].max()
            min_score = df['rec_score'].min()
            if max_score > min_score:  # Prevent division by zero
                df['norm_score'] = (df['rec_score'] - min_score) / (max_score - min_score)
            else:
                df['norm_score'] = 1.0
        
        # Combine recommendations
        combined_recs = pd.concat([collab_recs, content_recs])
        
        # Calculate weighted score
        combined_recs['weighted_score'] = combined_recs.apply(
            lambda row: (self.collab_weight * row['norm_score'] if row['model'] == 'collaborative'
                        else self.content_weight * row['norm_score']),
            axis=1
        )
        
        # Remove duplicates, keeping the highest weighted score
        combined_recs = combined_recs.sort_values('weighted_score', ascending=False)
        combined_recs = combined_recs.drop_duplicates('event_id', keep='first')
        
        # Return top recommendations
        return combined_recs.head(limit)
    
    def get_discovery_recommendations(self, user_id, interactions_df, events_df, limit=10):
        """Get serendipitous recommendations to help users discover new experiences"""
        # Get user's past interactions
        user_interactions = interactions_df[interactions_df['user_id'] == user_id]
        
        if user_interactions.empty:
            # No user history - return diverse popular events across categories
            return self._get_diverse_popular_events(interactions_df, events_df, limit)
        
        # Get categories the user has engaged with
        user_events = events_df[events_df['event_id'].isin(user_interactions['event_id'])]
        user_categories = user_events['category'].value_counts().to_dict()
        
        # Find less explored categories for this user
        all_categories = events_df['category'].unique()
        unexplored_categories = [cat for cat in all_categories if cat not in user_categories]
        less_explored_categories = [cat for cat, count in user_categories.items() 
                                 if count <= 2 and cat not in unexplored_categories]
        
        target_categories = unexplored_categories + less_explored_categories
        
        # If we have unexplored categories, recommend from those
        if target_categories:
            # Get popular events from unexplored categories
            discovery_events = events_df[events_df['category'].isin(target_categories)]
            
            # Get popular events from these categories
            event_popularity = interactions_df.groupby('event_id').size().reset_index(name='interaction_count')
            popular_events = event_popularity.sort_values('interaction_count', ascending=False)
            
            discovery_events = discovery_events.merge(popular_events, on='event_id', how='left')
            discovery_events = discovery_events.fillna({'interaction_count': 0})
            discovery_events = discovery_events.sort_values('interaction_count', ascending=False)
            
            # Ensure diversity across categories
            discovery_events = self._ensure_category_diversity(discovery_events, limit)
            
            return discovery_events.head(limit)
        else:
            # All categories explored - rely on collaborative filtering for serendipity
            # but with a lower weight for the user's preferred categories
            return self._get_diverse_popular_events(interactions_df, events_df, limit)
    
    def _ensure_category_diversity(self, events_df, limit):
        """Ensure recommendations have diverse categories"""
        categories = events_df['category'].unique()
        events_per_category = max(1, limit // len(categories))
        
        diverse_events = pd.DataFrame()
        for category in categories:
            category_events = events_df[events_df['category'] == category].head(events_per_category)
            diverse_events = pd.concat([diverse_events, category_events])
        
        # If we don't have enough events, add more from any category
        remaining_slots = limit - len(diverse_events)
        if remaining_slots > 0:
            already_selected = diverse_events['event_id'].tolist()
            remaining_events = events_df[~events_df['event_id'].isin(already_selected)].head(remaining_slots)
            diverse_events = pd.concat([diverse_events, remaining_events])
        
        return diverse_events
    
    def _get_diverse_popular_events(self, interactions_df, events_df, limit):
        """Get popular events with category diversity"""
        # Calculate event popularity
        event_popularity = interactions_df.groupby('event_id').size().reset_index(name='interaction_count')
        
        # Join with events data
        popular_events = events_df.merge(event_popularity, on='event_id', how='left')
        popular_events = popular_events.fillna({'interaction_count': 0})
        
        # Sort by popularity
        popular_events = popular_events.sort_values('interaction_count', ascending=False)
        
        # Ensure category diversity
        return self._ensure_category_diversity(popular_events, limit)