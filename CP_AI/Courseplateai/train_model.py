import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# 학습용 샘플 데이터 (실제 서비스 시 더 많은 실제 리뷰 데이터를 수집해야 함)
data = {
    "text": [
        "이 식당 정말 맛있어요. 다시 가고 싶어요!",
        "서비스도 좋고 음식도 훌륭했어요.",
        "너무 짜고 맛이 없어요.",
        "최악의 경험이었어요. 다시는 안 갑니다.",
        "분위기가 정말 좋아요. 음식도 훌륭했어요.",
        "직원이 불친절하고 음식이 식었어요."
    ],
    "label": [1, 1, 0, 0, 1, 0]  # 1: 긍정, 0: 부정
}

df = pd.DataFrame(data)

# TF-IDF 벡터화
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])

# 로지스틱 회귀로 감정 분석 모델 학습
model = LogisticRegression()
model.fit(X, df["label"])

# 저장할 경로
model_dir = "model"
os.makedirs(model_dir, exist_ok=True)

# 모델과 벡터라이저 저장
joblib.dump(model, os.path.join(model_dir, "sentiment_model.pkl"))
joblib.dump(vectorizer, os.path.join(model_dir, "tfidf_vectorizer.pkl"))

print("✅ 모델 학습 및 저장 완료 (joblib)")

