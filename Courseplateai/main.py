from flask import Flask, request, jsonify
from review_analyzer import analyze_review
from pymongo import MongoClient
import datetime

app = Flask(__name__)

client = MongoClient("mongodb+srv://kwondonggwan:3muHbSILB0HGF4nj@courseplate.z8ew0.mongodb.net/?retryWrites=true&w=majority&appName=CoursePlate")
db = client["CoursePlate"]
collection = db["analyzed_reviews"]

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    print("받은 데이터:", data)
    review_text = data.get('review')
    print("리뷰 내용:", review_text)  # 추가

    if not review_text:
        return jsonify({'error': '리뷰가 비어있습니다.'}), 400

    result = analyze_review(review_text)

    # 리뷰 + 결과 저장
    doc = {
        "original_review": review_text,
        "sentiment": result["sentiment"],
        "keywords": result["keywords"],
        "timestamp": datetime.datetime.now()
    }
    collection.insert_one(doc)

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
