# models/trends/forecasting.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
# Remove the Prophet import
# from prophet import Prophet

class TrendForecaster:
    def __init__(self):
        self.price_model = None

    def get_trending_events(self, events_df, interactions_df, filters=None, limit=10):
        """Identify trending events based on interaction velocity"""
        events = events_df.copy()
        interactions = interactions_df.copy()

        # Apply filters if provided
        if filters:
            for key, value in filters.items():
                if key in events.columns:
                    events = events[events[key] == value]

            # Filter interactions to only include filtered events
            interactions = interactions[interactions['event_id'].isin(events['event_id'])]

        # Calculate trend score with time decay
        now = datetime.now()
        interactions['days_ago'] = interactions['timestamp'].apply(
            lambda x: (now - x).days
        )

        # Apply exponential decay factor
        interactions['weight'] = interactions['days_ago'].apply(
            lambda days: np.exp(-0.1 * days)
        )

        # Weight by interaction type
        interaction_weights = {'view': 1, 'click': 3, 'purchase': 10}
        interactions['type_weight'] = interactions['interaction_type'].map(interaction_weights)

        # Compute final weight
        interactions['final_weight'] = interactions['weight'] * interactions['type_weight']

        # Calculate trending score for each event
        trend_scores = interactions.groupby('event_id')['final_weight'].sum().reset_index()
        trend_scores = trend_scores.rename(columns={'final_weight': 'trend_score'})

        # Merge with events data
        trending_events = events.merge(trend_scores, on='event_id', how='inner')

        # Sort by trend score
        trending_events = trending_events.sort_values('trend_score', ascending=False)

        # Return top trending events
        return trending_events.head(limit)

    def forecast_ticket_sales(self, event_id, interactions_df, days_ahead=30):
        """Forecast ticket sales for a specific event using linear regression instead of Prophet"""
        # Filter to purchase interactions for this event
        event_purchases = interactions_df[
            (interactions_df['event_id'] == event_id) &
            (interactions_df['interaction_type'] == 'purchase')
        ]

        # Get purchase counts by date
        purchases_by_date = event_purchases.groupby(
            event_purchases['timestamp'].dt.date
        ).size().reset_index()
        purchases_by_date.columns = ['date', 'sales']

        if len(purchases_by_date) < 2:
            # Not enough data for regression
            avg_sales = purchases_by_date['sales'].mean() if not purchases_by_date.empty else 1

            # Create future dates
            future_dates = [datetime.now().date() + timedelta(days=i) for i in range(1, days_ahead + 1)]
            forecast = pd.DataFrame({
                'date': future_dates,
                'predicted_sales': [avg_sales] * days_ahead,
                'lower_bound': [max(0, avg_sales * 0.8)] * days_ahead,
                'upper_bound': [avg_sales * 1.2] * days_ahead
            })

            return forecast

        # Prepare data for linear regression
        x = np.array(range(len(purchases_by_date))).reshape(-1, 1)
        y = purchases_by_date['sales'].values

        # Fit linear model
        model = LinearRegression()
        model.fit(x, y)

        # Create future dates
        future_dates = [datetime.now().date() + timedelta(days=i) for i in range(1, days_ahead + 1)]

        # Predict future sales
        future_x = np.array(range(len(purchases_by_date), len(purchases_by_date) + days_ahead)).reshape(-1, 1)
        predictions = model.predict(future_x)

        # Create forecast dataframe
        forecast = pd.DataFrame({
            'date': future_dates,
            'predicted_sales': predictions,
            'lower_bound': predictions * 0.8,  # Simple confidence interval
            'upper_bound': predictions * 1.2   # Simple confidence interval
        })

        # Ensure values are non-negative
        for col in ['predicted_sales', 'lower_bound', 'upper_bound']:
            forecast[col] = forecast[col].apply(lambda x: max(0, x))

        return forecast

    def optimize_pricing(self, event_id, interactions_df, events_df, current_price=None):
        """Optimize pricing based on historical data and price elasticity"""
        # Get the event details
        event = events_df[events_df['event_id'] == event_id]

        if event.empty:
            raise ValueError(f"Event {event_id} not found")

        if current_price is None:
            current_price = event['price'].values[0]

        # Get similar events based on category
        category = event['category'].values[0]
        similar_events = events_df[events_df['category'] == category]

        # Get purchase data for similar events
        purchase_data = []
        for _, similar_event in similar_events.iterrows():
            similar_id = similar_event['event_id']
            price = similar_event['price']

            # Count purchases for this event
            purchases = interactions_df[
                (interactions_df['event_id'] == similar_id) &
                (interactions_df['interaction_type'] == 'purchase')
            ].shape[0]

            purchase_data.append({
                'event_id': similar_id,
                'price': price,
                'purchases': purchases
            })

        # Fit price-demand model
        if len(purchase_data) >= 3:
            # Log-linear model for price elasticity
            price_df = pd.DataFrame(purchase_data)
            price_df['log_price'] = np.log(price_df['price'])
            price_df['log_purchases'] = np.log(price_df['purchases'] + 1)

            # Fit linear regression
            X = price_df['log_price'].values.reshape(-1, 1)
            y = price_df['log_purchases'].values

            model = LinearRegression()
            model.fit(X, y)

            # Calculate price elasticity
            elasticity = model.coef_[0]

            # Calculate optimal price based on elasticity
            if elasticity >= -1:
                # Inelastic demand - higher price increases revenue
                optimal_price = current_price * 1.1  # Increase by 10%
            else:
                # Elastic demand - optimal markup
                optimal_markup = -elasticity / (1 + elasticity)
                optimal_price = current_price * (1 + optimal_markup)

            return round(optimal_price, 2)

        return current_price  # Default to current price