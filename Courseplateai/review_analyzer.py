import joblib
from utils import clean_text, extract_keywords
import os

model_path = os.path.join(os.path.dirname(__file__), 'model')

vectorizer = joblib.load(os.path.join(model_path, 'tfidf_vectorizer.pkl'))
model = joblib.load(os.path.join(model_path, 'sentiment_model.pkl'))

def analyze_review(review_text):
    cleaned = clean_text(review_text)
    vec = vectorizer.transform([cleaned])
    prediction = model.predict(vec)[0]
    keywords = extract_keywords(cleaned)
    return {
        "sentiment": "positive" if prediction == 1 else "negative",
        "keywords": keywords
    }
