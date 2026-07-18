# Frontend 실행 방법

## 1. 사전 준비

- Node.js 설치

## 2. 의존성 설치

```bash
npm install
```

## 3. 환경 변수 설정

`package.json` 파일이 있는 폴더(Frontend 프로젝트 폴더)에 `.env` 파일을 생성하고 아래 내용을 입력합니다.

```env
VITE_KAKAO_CLIENT_ID=YOUR_KAKAO_CLIENT_ID
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/oauth/kakao
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/oauth/google
VITE_BACKEND_URL=http://localhost:8080
```

> `YOUR_KAKAO_CLIENT_ID`와 `YOUR_GOOGLE_CLIENT_ID`는 각자 발급받은 값을 입력합니다.

## 4. 실행

```bash
npm run dev
```

## 5. 접속

- Local: http://localhost:5173

## 6. 같은 네트워크에서 실행

```bash
npm run dev -- --host
```

- 터미널에 표시되는 **Network** 주소로 접속

## 7. 경쟁 서비스 탐색 API 연동

현재 개발 환경에서는 AI 서버 없이 화면 테스트를 진행할 수 있도록 Mock 데이터를 사용합니다.

`src/api/competitorApi.js`

```js
const USE_MOCK = true;
```

- `true` : Mock 데이터 사용 (AI 서버 미연동 상태에서 테스트)
- `false` : 실제 AI API 연동 데이터 사용 (AI 서버 응답 결과 표시)