import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class AnomalyDetector:
    def __init__(self, contamination=0.05):
        self.model = IsolationForest(
            n_estimators=100,
            max_samples='auto',
            contamination=contamination,
            random_state=42
        )
        self.scaler = StandardScaler()
    
    def fit(self, data):
        """Fit the anomaly detection model on historical data"""
        # Standardize data
        scaled_data = self.scaler.fit_transform(data)
        
        # Fit the isolation forest model
        self.model.fit(scaled_data)
        
        return self
    
    def detect(self, metrics, event_id=None):
        """
        Detect anomalies in event metrics
        
        Parameters:
        -----------
        metrics : dict or DataFrame
            The metrics data to analyze for anomalies
        event_id : str, optional
            The ID of the event being analyzed
            
        Returns:
        --------
        dict
            Dict containing detected anomalies with explanations
        """
        # Convert metrics to DataFrame if it's a dict
        if isinstance(metrics, dict):
            df = pd.DataFrame([metrics])
        elif isinstance(metrics, pd.DataFrame):
            df = metrics.copy()
        else:
            raise ValueError("Metrics must be a dict or DataFrame")
        
        # Check if model is fitted
        if not hasattr(self.model, 'offset_'):
            # If not fitted, create a temporary model
            temp_model = IsolationForest(
                n_estimators=100,
                max_samples='auto',
                contamination=0.05,
                random_state=42
            )
            temp_scaler = StandardScaler()
            
            # Fit on the current data (not ideal, but works for one-off detection)
            scaled_data = temp_scaler.fit_transform(df.select_dtypes(include=[np.number]))
            temp_model.fit(scaled_data)
            
            # Use the temporary model and scaler
            model = temp_model
            scaler = temp_scaler
        else:
            model = self.model
            scaler = self.scaler
        
        # Prepare features for detection
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        features = df[numeric_cols].copy()
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Predict anomalies
        # -1 for anomalies, 1 for normal data points
        predictions = model.predict(scaled_features)
        anomaly_scores = model.decision_function(scaled_features)
        
        # Identify the most anomalous features
        anomalous_features = []
        if predictions[0] == -1:  # If anomaly detected
            # Calculate z-scores for each feature
            z_scores = np.abs((features - features.mean()) / features.std())
            
            # Get the features with the highest z-scores
            for col in z_scores.columns:
                score = z_scores[col].values[0]
                if score > 2:  # More than 2 standard deviations from mean
                    anomalous_features.append({
                        'feature': col,
                        'value': features[col].values[0],
                        'z_score': score,
                        'direction': 'high' if features[col].values[0] > features[col].mean().item() else 'low'
                    })
            
            # Sort by z-score (most anomalous first)
            anomalous_features.sort(key=lambda x: x['z_score'], reverse=True)
        
        # Create result
        result = {
            'is_anomaly': predictions[0] == -1,
            'anomaly_score': anomaly_scores[0],
            'anomalous_features': anomalous_features,
            'event_id': event_id
        }
        
        # Generate explanation if anomaly detected
        if result['is_anomaly'] and anomalous_features:
            explanations = []
            for feature in anomalous_features[:3]:  # Top 3 most anomalous features
                explanations.append(
                    f"{feature['feature']} is unusually {feature['direction']} "
                    f"({feature['value']:.2f}, {feature['z_score']:.2f} std. dev.)"
                )
            
            result['explanation'] = explanations
        
        return result
    
    def detect_batch(self, metrics_batch):
        """Detect anomalies in a batch of metrics data"""
        return [self.detect(metrics) for metrics in metrics_batch]