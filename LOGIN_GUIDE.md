# 로그인(소셜 OAuth) 연동 가이드

이매지니어 프로젝트의 카카오/구글 로그인 연동을 위한 문서입니다.
프론트엔드(김성빈)와 백엔드(정우성)가 함께 진행합니다.

---

## 1. 전체 로그인 흐름

카카오 로그인 기준 (구글도 동일한 구조):

```
① 사용자가 프론트에서 "카카오 로그인" 버튼 클릭
      ↓
② 프론트가 카카오 인증 페이지로 이동
   (URL에 client_id + redirect_uri 포함)
      ↓
③ 사용자가 카카오 로그인 + 동의
      ↓
④ 카카오가 "인가 코드"를 붙여 redirect_uri로 되돌려보냄
   예: http://localhost:5173/oauth/kakao?code=ABC123
      ↓
⑤ 프론트가 주소에서 code(ABC123)를 꺼냄
      ↓
⑥ 프론트가 백엔드로 code 전달
   POST http://localhost:8080/api/auth/kakao  { "code": "ABC123" }
      ↓
⑦ 백엔드가 code로 카카오에서 사용자 정보 받고 → 회원 처리 → JWT 발급
   (★ 백엔드에서 이미 구현 완료, Postman 검증 완료)
      ↓
⑧ 백엔드가 프론트로 accessToken + refreshToken 반환
      ↓
⑨ 프론트가 accessToken 저장 → 로그인 완료
   이후 API 호출마다 Authorization: Bearer {accessToken} 헤더 사용
```

### 역할 분담
- **프론트 구현**: ②③④⑤⑨ (버튼, 인증 페이지 이동, 콜백 페이지, code 받기, 토큰 저장)
- **백엔드 구현**: ⑦ (이미 완료)
- **공통 접점**: ⑥⑧ (API.md 참고)

---

## 2. ⚠️ 가장 중요 — redirect_uri 3중 일치

로그인 연동 문제의 대부분이 여기서 발생합니다.
**redirect_uri가 아래 3곳에서 글자 하나까지 정확히 같아야 합니다.**

```
① 카카오/구글 콘솔에 등록된 redirect_uri   (백엔드 담당자가 등록)
② 프론트 코드에서 사용하는 redirect_uri     (프론트)
③ 백엔드 application.yml의 redirect-uri     (백엔드)

예시: http://localhost:5173/oauth/kakao
```

- 끝의 슬래시(`/`) 하나만 달라도 실패합니다.
- 카카오는 불일치 시 `KOE006` 에러가 발생합니다.
- 구글도 `redirect_uri_mismatch` 에러가 발생합니다.

**→ 만나서 redirect_uri를 하나로 확정한 뒤, 세 곳에 동일하게 반영합니다.**

---

## 3. 프론트엔드 준비/구현 사항

### (1) 로그인 버튼 → 인증 페이지로 이동
버튼 클릭 시 카카오/구글 인증 URL로 이동시킵니다.
URL에는 `client_id`와 `redirect_uri`가 들어갑니다.
(client_id는 공개되어도 되는 값으로, 백엔드 담당자가 전달합니다.)

**카카오 인증 URL 형식**
```
https://kauth.kakao.com/oauth/authorize
  ?client_id={REST_API_키}
  &redirect_uri={redirect_uri}
  &response_type=code
```

**구글 인증 URL 형식**
```
https://accounts.google.com/o/oauth2/v2/auth
  ?client_id={구글_client_id}
  &redirect_uri={redirect_uri}
  &response_type=code
  &scope=openid email profile
```

### (2) 콜백 페이지 만들기
redirect_uri에 지정한 경로(예: `/oauth/kakao`)에 해당하는 페이지를 만듭니다.
이 페이지에서 URL의 `?code=...`를 꺼냅니다.

### (3) 백엔드로 code 전달
API.md 참고. `POST /api/auth/kakao` (또는 `/google`)에 `{ "code": "..." }` 전송.

### (4) 받은 토큰 저장 및 사용
응답으로 온 accessToken을 저장하고, 이후 API 호출 시 헤더에 싣습니다.
```
Authorization: Bearer {accessToken}
```

### ⚠️ 주의: React StrictMode 이중 실행
개발 모드의 StrictMode 때문에 콜백 페이지 코드가 **두 번 실행**될 수 있습니다.
인가 코드(code)는 **1회용**이라, 첫 실행에서 소진되면 두 번째 실행은 실패합니다.
("코드가 맞는데 왜 두 번째만 실패하지?" 증상의 원인)
→ 콜백 처리가 한 번만 실행되도록 처리 필요 (연동 시 함께 확인).

---

## 4. 백엔드 준비 사항

- `application.yml`의 kakao/google `redirect-uri` 값 확인
- 카카오/구글 콘솔에 redirect_uri 등록 (프론트와 합의한 값으로)
- client_id(카카오 REST API 키, 구글 client-id)를 프론트에 전달
- 연동 테스트 시 백엔드 서버 실행 (`localhost:8080`)

백엔드 로그인 API는 이미 구현·검증 완료 상태입니다. (API.md 참고)

---

## 5. 함께 만나서 진행할 순서

1. **redirect_uri를 하나로 확정** (예: `http://localhost:5173/oauth/kakao`)
2. **세 곳에 반영**
   - 백엔드: 카카오/구글 콘솔 등록 + application.yml 수정
   - 프론트: 콜백 경로 및 인증 URL에 반영
3. **로그인 전체 테스트**
   - 프론트에서 로그인 버튼 클릭 → 동의 → 백엔드가 JWT 반환 → 프론트 저장까지 확인
4. **인증 API 호출 테스트**
   - 받은 토큰으로 BMC 저장 등 인증 필요한 API가 실제로 통하는지 확인

---

## 6. 자주 나는 에러 & 원인

| 증상 | 원인 |
|------|------|
| `KOE006` (카카오) | redirect_uri 불일치 (콘솔 미등록 또는 값 다름) |
| `redirect_uri_mismatch` (구글) | redirect_uri 불일치 |
| 두 번째 시도만 실패 | React StrictMode 이중 실행 → code 재사용 |
| 401 UNAUTHORIZED | 토큰이 없거나 만료됨 (accessToken 1시간 유효) |
| CORS 에러 | 프론트 주소가 백엔드 CORS 허용 목록에 없음 (현재 5173 허용됨) |

---

## 참고 문서
- API 명세: `API.md`

## 연동 참고 값 (개발 환경)

프론트에서 사용할 값입니다. (client_id는 공개 가능한 값)

| 항목 | 값 |
|------|-----|
| 카카오 client_id | `18ec3a75155641640f454fa82a6170c6` |
| 구글 client_id | `750867485309-qps17t4ocnau5jdg9lrqb1f1dlfu33kj.apps.googleusercontent.com` |
| 카카오 redirect_uri | `http://localhost:5173/oauth/kakao` |
| 구글 redirect_uri | `http://localhost:5173/oauth/google` |

> ⚠️ 구글 client-secret은 백엔드 전용 비밀 값이므로 여기 포함하지 않습니다.
