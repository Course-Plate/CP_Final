import os
import joblib
import nltk
from nltk.tokenize import sent_tokenize
from utils import clean_text, extract_keywords

# punkt tokenizer 다운로드 (한 번만 실행됨)
nltk.download("punkt")

# 모델 불러오기
model_path = os.path.join("model")
vectorizer = joblib.load(os.path.join(model_path, 'tfidf_vectorizer.pkl'))
model = joblib.load(os.path.join(model_path, 'sentiment_model.pkl'))

def majority_sentiment(sentiments):
    if sentiments.count("positive") > sentiments.count("negative"):
        return "positive"
    elif sentiments.count("positive") < sentiments.count("negative"):
        return "negative"
    else:
        return "mixed"

def analyze_review(text):
    sentences = sent_tokenize(text)
    keywords_with_sentiment = []

    for sent in sentences:
        sent_clean = clean_text(sent)
        vec = vectorizer.transform([sent_clean])
        sentiment = model.predict(vec)[0]
        sentiment_label = "positive" if sentiment == 1 else "negative"

        keywords = extract_keywords(sent_clean)
        for kw in keywords:
            keywords_with_sentiment.append({
                "word": kw,
                "sentiment": sentiment_label
            })

    overall = majority_sentiment([k["sentiment"] for k in keywords_with_sentiment])

    return {
        "sentiment": overall,
        "keywords": keywords_with_sentiment
    }
