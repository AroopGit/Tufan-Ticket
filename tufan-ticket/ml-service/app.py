# ml-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime

# Import models from our modules
from models.recommendation.hybrid import HybridRecommender
from models.trends.forecasting import TrendForecaster
from models.sentiment.analyzer import SentimentAnalyzer
from models.anomaly.detector import AnomalyDetector

app = Flask(__name__)
CORS(app)

# Initialize models
hybrid_model = HybridRecommender()
trend_model = TrendForecaster()
sentiment_model = SentimentAnalyzer()
anomaly_model = AnomalyDetector()

# Load sample data for demo
def load_sample_data():
    # In a real app, this would load from a database
    users = pd.DataFrame({
        'user_id': [f'user_{i}' for i in range(1, 1001)],
        'age': np.random.randint(18, 45, 1000),
        'gender': np.random.choice(['M', 'F', 'NB'], 1000),
        'city': np.random.choice(['New York', 'Los Angeles', 'Chicago'], 1000),
    })

    events = pd.DataFrame({
        'event_id': [f'event_{i}' for i in range(1, 501)],
        'title': [f'Event Title {i}' for i in range(1, 501)],
        'category': np.random.choice(['Music', 'Sports', 'Arts', 'Food', 'Tech'], 500),
        'location': np.random.choice(['New York', 'Los Angeles', 'Chicago'], 500),
        'price': np.random.randint(20, 200, 500)
    })

    interactions = pd.DataFrame({
        'user_id': np.random.choice(users['user_id'], 10000),
        'event_id': np.random.choice(events['event_id'], 10000),
        'interaction_type': np.random.choice(['view', 'click', 'purchase'], 10000),
        'timestamp': [datetime.now() - pd.Timedelta(days=np.random.randint(1, 30))
                     for _ in range(10000)]
    })

    return users, events, interactions

users_df, events_df, interactions_df = load_sample_data()

# API routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/recommendations/personalized', methods=['GET'])
def get_personalized_recommendations():
    user_id = request.args.get('user_id')
    limit = int(request.args.get('limit', 10))

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        recommendations = hybrid_model.get_recommendations(
            user_id,
            interactions_df,
            events_df,
            limit=limit
        )

        # Convert to frontend-friendly format
        events_list = []
        for _, event in recommendations.iterrows():
            events_list.append({
                'id': event['event_id'],
                'title': event['title'],
                'category': event['category'],
                'location': event['location'],
                'price': float(event['price']),
                'image': f"https://images.unsplash.com/photo-{1550000000 + int(event['event_id'].split('_')[1])}",
                'date': (datetime.now() + pd.Timedelta(days=int(event['event_id'].split('_')[1]) % 30)).strftime('%B %d, %Y'),
                'tags': [event['category'].lower()]
            })

        return jsonify({
            'success': True,
            'events': events_list
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/trending', methods=['GET'])
def get_trending_recommendations():
    limit = int(request.args.get('limit', 10))
    category = request.args.get('category')

    try:
        filters = {}
        if category:
            filters['category'] = category

        trending_events = trend_model.get_trending_events(
            events_df,
            interactions_df,
            filters=filters,
            limit=limit
        )

        # Convert to frontend-friendly format
        events_list = []
        for _, event in trending_events.iterrows():
            events_list.append({
                'id': event['event_id'],
                'title': event['title'],
                'category': event['category'],
                'location': event['location'],
                'price': float(event['price']),
                'image': f"https://images.unsplash.com/photo-{1550000000 + int(event['event_id'].split('_')[1])}",
                'date': (datetime.now() + pd.Timedelta(days=int(event['event_id'].split('_')[1]) % 30)).strftime('%B %d, %Y'),
                'tags': [event['category'].lower()],
                'trend_score': float(event['trend_score']) if 'trend_score' in event else None
            })

        return jsonify({
            'success': True,
            'events': events_list
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sales-forecast', methods=['GET'])
def get_sales_forecast():
    event_id = request.args.get('event_id')
    days_ahead = int(request.args.get('days_ahead', 30))

    if not event_id:
        return jsonify({'error': 'Event ID is required'}), 400

    try:
        forecast = trend_model.forecast_ticket_sales(
            event_id,
            interactions_df,
            days_ahead=days_ahead
        )

        # Convert to frontend-friendly format
        forecast_data = []
        for _, row in forecast.iterrows():
            forecast_data.append({
                'date': row['date'].strftime('%Y-%m-%d'),
                'predicted_sales': float(row['predicted_sales']),
                'lower_bound': float(row['lower_bound']),
                'upper_bound': float(row['upper_bound'])
            })

        return jsonify({
            'success': True,
            'forecast': forecast_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json

    if not data or 'text' not in data:
        return jsonify({'error': 'Text content is required'}), 400

    try:
        sentiment = sentiment_model.analyze(data['text'])

        return jsonify({
            'success': True,
            'sentiment': sentiment
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/anomaly-detection', methods=['POST'])
def detect_anomalies():
    data = request.json

    if not data or 'metrics' not in data:
        return jsonify({'error': 'Metrics data is required'}), 400

    try:
        anomalies = anomaly_model.detect(data['metrics'])

        return jsonify({
            'success': True,
            'anomalies': anomalies
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/pricing-optimization', methods=['GET'])
def optimize_pricing():
    event_id = request.args.get('event_id')
    current_price = request.args.get('current_price')

    if not event_id:
        return jsonify({'error': 'Event ID is required'}), 400

    try:
        if current_price:
            current_price = float(current_price)

        optimal_price = trend_model.optimize_pricing(
            event_id,
            interactions_df,
            events_df,
            current_price=current_price
        )

        # Get event details for context
        event = events_df[events_df['event_id'] == event_id]
        if not event.empty:
            event_details = {
                'id': event_id,
                'title': event.iloc[0]['title'],
                'category': event.iloc[0]['category'],
                'location': event.iloc[0]['location'],
                'current_price': float(event.iloc[0]['price']) if current_price is None else current_price
            }
        else:
            event_details = {'id': event_id}

        return jsonify({
            'success': True,
            'event': event_details,
            'optimal_price': optimal_price,
            'price_increase': round((optimal_price / event_details.get('current_price', 1) - 1) * 100, 2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)