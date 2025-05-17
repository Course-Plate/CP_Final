# Courseplate Frontend

## 기술 스택

- **Expo SDK**: 52.0.40
- **React Native**: 0.76.7
- **React**: 18.3.1
- **Expo Router**: 4.0.19
- **Android SDK**:
  - **compileSdkVersion** 35 (Android 14)
  - **targetSdkVersion** 34 (Android 13)
  - **minSdkVersion** 24 (Android 7.0)


## Android SDK 설정

### 1. Android SDK 설치

- Android Studio → Tools > SDK Manager

    - SDK Platforms 탭에서:

        - Android 14 (API Level 35) 설치 (권장)

    - SDK Tools 탭에서:
    
        - Android SDK Platform-Tools 설치

### 2. 환경 변수 설정

- Windows 검색창에 "환경 변수 편집" 실행
- 시스템 변수 항목에서:
    - 새로 만들기 → ANDROID_HOME=<Android SDK 경로> (Android Studio → Tools > SDK Manager에서 경로 확인 가능)
    - PATH 변수에서:
        - 편집 → 새로 만들기 → %ANDROID_HOME%\platform-tools
      
### 3. 설정 확인
명령 프롬프트에서:
```
adb --version
```


##  실행 가이드

### 1. 의존성 설치
```
npm install
```

### 2. Android 빌드 및 실행

애뮬레이터 또는 실제 기기 연결 후
```
npm run android
```



## 프로젝트 디렉토리 구조
```
courseplate-frontend/
├── app/
│   ├── login/              ← 로그인 페이지
│   │   └── index.js
│   ├── signup/             ← 회원가입 페이지
│   │   └── index.js
│   └── _layout.js          ← 전역 레이아웃 및 헤더 설정
│
├── components/             ← 재사용 가능한 UI 컴포넌트
│   ├── CustomInput.js
│   └── PrimaryButton.js
│
├── context/                ← 전역 상태 관리
│
├── styles/                 ← 공통 스타일
│   └── common.js
│
├── assets/
│   └── logo/
│       ├── logo.png
```