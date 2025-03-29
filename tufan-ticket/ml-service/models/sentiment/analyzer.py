import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import numpy as np

class SentimentAnalyzer:
    def __init__(self, use_transformers=True):
        """Initialize sentiment analyzer with either VADER or transformer models"""
        self.use_transformers = use_transformers
        
        if use_transformers:
            # Use HuggingFace's transformers for sentiment analysis
            self.model = pipeline(
                "sentiment-analysis", 
                model="distilbert-base-uncased-finetuned-sst-2-english",
                truncation=True, 
                max_length=512
            )
        else:
            # Use VADER sentiment analyzer
            try:
                nltk.data.find('vader_lexicon')
            except LookupError:
                nltk.download('vader_lexicon')
            
            self.analyzer = SentimentIntensityAnalyzer()
    
    def analyze(self, text):
        """Analyze the sentiment of a text"""
        if not text:
            return {'sentiment': 'neutral', 'score': 0, 'confidence': 0}
        
        if self.use_transformers:
            try:
                # Use transformer model for analysis
                result = self.model(text)[0]
                label = result['label'].lower()
                score = result['score']
                
                # Convert to consistent format
                sentiment = 'positive' if label == 'positive' else 'negative'
                sentiment_score = score if sentiment == 'positive' else -score
                
                return {
                    'sentiment': sentiment,
                    'score': sentiment_score,
                    'confidence': score
                }
            except Exception as e:
                # Fallback to VADER if transformer model fails
                return self._analyze_with_vader(text)
        else:
            return self._analyze_with_vader(text)
    
    def _analyze_with_vader(self, text):
        """Analyze sentiment using VADER"""
        scores = self.analyzer.polarity_scores(text)
        
        # Determine sentiment based on compound score
        compound = scores['compound']
        
        if compound >= 0.05:
            sentiment = 'positive'
        elif compound <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'score': compound,
            'confidence': abs(compound),
            'details': {
                'positive': scores['pos'],
                'negative': scores['neg'],
                'neutral': scores['neu']
            }
        }
    
    def analyze_batch(self, texts):
        """Analyze sentiment for a batch of texts"""
        return [self.analyze(text) for text in texts]
    
    def extract_aspects(self, text):
        """
        Extract aspect-based sentiment (what aspects are being discussed)
        This is a simplified implementation - in practice, you would use a more 
        sophisticated approach like aspect-based sentiment analysis
        """
        aspects = {
            'price': ['price', 'cost', 'expensive', 'cheap', 'affordable', 'worth'],
            'venue': ['venue', 'location', 'place', 'stadium', 'arena', 'hall'],
            'lineup': ['lineup', 'artist', 'performer', 'band', 'dj', 'musician'],
            'organization': ['organized', 'staff', 'service', 'management', 'crowd'],
            'sound': ['sound', 'audio', 'acoustics', 'volume', 'music'],
            'experience': ['experience', 'time', 'enjoyed', 'fun', 'boring', 'great']
        }
        
        text_lower = text.lower()
        
        # Find mentioned aspects
        mentioned_aspects = {}
        for aspect, keywords in aspects.items():
            for keyword in keywords:
                if keyword in text_lower:
                    # Find the sentence containing this keyword
                    sentences = text_lower.split('.')
                    for sentence in sentences:
                        if keyword in sentence:
                            # Analyze sentiment for this sentence
                            sentiment = self._analyze_with_vader(sentence)
                            
                            if aspect not in mentioned_aspects:
                                mentioned_aspects[aspect] = sentiment
                            break
        
        return mentioned_aspects