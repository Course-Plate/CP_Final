from flask import Flask, request, jsonify
from review_analyzer import analyze_review
from pymongo import MongoClient
import datetime

app = Flask(__name__)

# MongoDB Atlas 연결
client = MongoClient("mongodb+srv://kwondonggwan:3muHbSILB0HGF4nj@courseplate.z8ew0.mongodb.net/?retryWrites=true&w=majority&appName=CoursePlate")
db = client["CoursePlate"]
review_col = db["analyzed_reviews"]  # 분석된 리뷰 저장 (로그)
pref_col = db["user_preference"]   # 사용자 프로필 저장 (통합 저장소)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    user_id = data.get('user_id')
    review_text = data.get('review')

    if not user_id or not review_text:
        return jsonify({'error': 'user_id와 review는 필수입니다.'}), 400

    # 리뷰 분석 실행
    result = analyze_review(review_text)

    # 리뷰 결과 저장 (분석된 리뷰는 별도로 저장)
    doc = {
        "userId": user_id,
        "original_review": review_text,
        "sentiment": result["sentiment"],
        "keywords": result["keywords"],
        "timestamp": datetime.datetime.now()
    }
    review_col.insert_one(doc)

    # 사용자 프로필에 리뷰 기반 키워드 누적 저장 (MongoDB에 통합)
    positive_keywords = [kw["word"] for kw in result["keywords"] if kw["sentiment"] == "positive"]
    negative_keywords = [kw["word"] for kw in result["keywords"] if kw["sentiment"] == "negative"]

    # 🔧 userId를 _id로 통일하여 중복 방지
    pref_col.update_one(
        {"_id": user_id},  # _id 필드로 통일
        {
            "$addToSet": {
                "review.positiveKeywords": {"$each": positive_keywords},
                "review.negativeKeywords": {"$each": negative_keywords}
            }
        },
        upsert=True
    )

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
