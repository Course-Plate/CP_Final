
# CoursePlate_Backend

## API Documentation

이 문서는 **User API**, **Point API**, **Place API**, **Room API**, **Storage API**, **Route API**, **Item API**에 대한 엔드포인트와 사용 예제를 제공합니다.

---

## Base URL

```
http://localhost:8080/CoursePlate/
```

---

## 설문조사 키워드

- **POST** `/api/survey/submit`

```json
{ "userId": "test1", "likeKeywords": ["한식", "조용한"], "dislikeKeywords": ["혼잡한", "시끄러운"] }
```

---

## 네이버 API 기반 음식점 추천

- **GET** `/api/naver/filtered/{userId}?location=지역`

---

## User API

---

### 회원 삭제

- **DELETE** `/users/delete?userId=test123`

---

### 사용자 조회

- **GET** `/users/userid/test123`
- **Content-Type:** `application/json`

```json
{
  "userId": "test123",
  "password": "test123!!"
}
```

---

### 사용자 존재 여부 확인

- **GET** `/users/userid/test123/exists`

---

## Review API

### 리뷰 작성
- **POST** `/reviews/write`
- **Content-Type:** application/json

```json
{
  "userId": "test123",
  "userName": "홍길동",
  "placeId": "place001",
  "placeName": "천안맛집",
  "score": 5,
  "reviewContent": "아주 만족스러웠습니다!",
  "reviewImg": null
}
```

---

### 리뷰 단건 조회
- **GET** `/reviews/{id}`

---

### 장소별 리뷰 조회
- **GET** `/reviews/place/{placeId}`

---

### 사용자별 리뷰 조회
- **GET** `/reviews/user/{userId}`

---

### 리뷰 수정
- **PUT** `/reviews/{id}`
- **Content-Type:** application/json

```json
{
  "score": 4,
  "reviewContent": "약간 아쉬웠어요.",
  "reviewImg": null
}
```

---

### 리뷰 삭제
- **DELETE** `/reviews/{id}`

---

## Place API

### 장소 추가

- **POST** `/places/add`
- **Content-Type:** `application/json`

```json
{
  "placeId": "place001",
  "placeName": "천안맛집",
  "address": "천안시 중구",
  "explain": "맛있는 음식을 제공하는 곳",
  "type": "Restaurant",
  "latitude": "36.7982",
  "longitude": "127.1463"
}
```

---

### 장소 이름으로 주소 조회
- **GET** `/places/placename/{placeName}

---

### 모든 장소 목록 조회
- **GET** `/places/all`

---

### 장소 ID로 정보 조회
- **GET** `/places/placeid/{placeId}`

---

### 장소 정보 수정

- **PUT** `/places/update/{id}`
- **Content-Type:** `application/json`

```json
{
  "placeName": "수정된 맛집 이름",
  "address": "새로운 주소",
  "explain": "설명도 새롭게 수정",
  "type": "카페",
  "latitude": "36.820",
  "longitude": "127.160"
}
```

---

### 장소 삭제
- **DELETE** `/places/delete/{id}`

---

## Authentication API

### 회원가입

- **POST** `/auth/signup`
- **Content-Type:** `application/json`

```json
{
  "userId": "test123",
  "userName": "HongGildong",
  "password": "test123!!",
  "phoneNum": 01012341234,
  "email": "test123@gmail.com",
  "sex": "Male"
}
```

---

### 로그인

- **POST** `/auth/login`
- **Content-Type:** `application/json`

```json
{
  "userId": "test123",
  "password": "test123!!"
}
```

---

### 인증번호 요청

- **POST** `/auth/send-sms`
- **Content-Type:** `application/json`

```json
{
  "phoneNum": 01012341234
}
```

---

### 인증번호 검증

- **POST** `/auth/verify-sms`
- **Content-Type:** `application/json`

```json
{
  "phoneNum": 01012341234,
  "authCode": "123456"
}
```

---

## 참고사항

- 위의 API 호출은 모두 로컬 서버(`localhost`)에서 실행된다고 가정합니다.
- JSON 요청 본문의 형식은 정확해야 하며, 일부 API 호출은 인증 및 권한이 필요할 수 있습니다.
