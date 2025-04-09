import nltk
from nltk.corpus import stopwords
import re

nltk.download('stopwords')

def clean_text(text):
    text = re.sub(r'[^\w\s]', '', text.lower())
    stop_words = set(stopwords.words('english'))
    tokens = text.split()
    return ' '.join([word for word in tokens if word not in stop_words])

def extract_keywords(text, top_k=3):
    words = text.split()
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w for w, _ in sorted_words[:top_k]]
