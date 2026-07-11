# 이매지니어(Imagineers) 백엔드 API 명세서

프론트엔드 연동용 문서입니다. 백엔드 팀(정우성)이 작성했습니다

---

## 기본 정보

- **백엔드 주소 (개발)**: `http://localhost:8080`
- **프론트 주소 (개발)**: `http://localhost:5173`
- **응답 형식**: 모든 API는 아래의 공통 형식(`ApiResponse`)으로 응답합니다.

### 공통 응답 형식

성공 시:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

실패 시:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "사람이 읽을 수 있는 에러 메시지"
  }
}
```

> **프론트 처리 팁**: `success` 값으로 성공/실패를 먼저 판단하고, 성공이면 `data`를, 실패면 `error.code` / `error.message`를 사용하면 됩니다.

### 인증 방식 (JWT)

로그인 후 받은 **accessToken**을, 인증이 필요한 요청의 헤더에 담아 보냅니다.

```
Authorization: Bearer {accessToken}
```

- accessToken 유효기간: **1시간** (만료되면 다시 로그인해서 새로 받아야 함 — 재발급 API는 아직 없음)
- 각 API의 "인증" 항목이 **필요**면 이 헤더가 있어야 하고, 없으면 `401 UNAUTHORIZED`가 옵니다.

### 에러 코드 목록

| code | HTTP 상태 | 의미 |
|------|-----------|------|
| `INVALID_REQUEST` | 400 | 잘못된 요청 (형식 오류 등) |
| `UNAUTHORIZED` | 401 | 인증 실패 (토큰 없음/만료) |
| `FORBIDDEN` | 403 | 권한 없음 (남의 리소스 접근) |
| `NOT_FOUND` | 404 | 존재하지 않는 리소스 |
| `LIMIT_EXCEEDED` | 429 | 하루 사용 횟수 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 1. 인증 (로그인 / 로그아웃)

### 1-1. 카카오 로그인

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/auth/kakao` |
| 인증 | 불필요 |

프론트에서 카카오 인가 코드를 받아, 그 코드를 백엔드로 전달합니다. 백엔드가 카카오에서 사용자 정보를 받아 회원 처리(신규면 가입, 기존이면 로그인)하고 JWT를 발급합니다.

**요청 Body**
```json
{
  "code": "카카오에서 받은 인가 코드"
}
```

**응답 (성공)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  },
  "error": null
}
```

> `accessToken`을 저장해두고, 이후 인증이 필요한 API 호출에 사용하세요.

---

### 1-2. 구글 로그인

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/auth/google` |
| 인증 | 불필요 |

카카오 로그인과 동일한 구조입니다. 구글 인가 코드를 전달합니다.

**요청 Body**
```json
{
  "code": "구글에서 받은 인가 코드"
}
```

**응답 (성공)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  },
  "error": null
}
```

---

### 1-3. 로그아웃

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/auth/logout` |
| 인증 | **필요** |

서버에 저장된 refreshToken을 비웁니다. 프론트에서는 이 API를 호출한 뒤, 저장해둔 accessToken도 함께 삭제하면 됩니다.

**요청 Body**: 없음 (Authorization 헤더만 필요)

**응답 (성공)**
```json
{
  "success": true,
  "data": null,
  "error": null
}
```

---

## 2. BMC 저장

### 2-1. BMC 생성 결과 저장 (AI 자동생성)

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/bmc` |
| 인증 | **필요** |

AI가 생성한 BMC 9개 항목을 저장합니다. (AI 호출은 프론트에서 하고, 완성된 결과만 백엔드로 보냅니다.)

**요청 Body**
```json
{
  "ideaText": "반려동물 산책 메이트 매칭 서비스",
  "stage": "IDEA",
  "bmcType": "AI_GENERATED",
  "items": [
    { "itemType": "VALUE_PROPOSITION", "content": "..." },
    { "itemType": "CUSTOMER_SEGMENT", "content": "..." },
    { "itemType": "REVENUE_STREAM", "content": "..." },
    { "itemType": "COST_STRUCTURE", "content": "..." },
    { "itemType": "KEY_PARTNERS", "content": "..." },
    { "itemType": "KEY_ACTIVITIES", "content": "..." },
    { "itemType": "KEY_RESOURCES", "content": "..." },
    { "itemType": "CHANNELS", "content": "..." },
    { "itemType": "CUSTOMER_RELATIONSHIPS", "content": "..." }
  ]
}
```

**응답 (성공)**
```json
{
  "success": true,
  "data": { "bmcRecordId": 1 },
  "error": null
}
```

> 저장된 BMC의 id(`bmcRecordId`)가 반환됩니다. 이후 삭제/수정에 사용하세요.

> **주의**: 하루 생성 한도(5회)를 초과하면 `429 LIMIT_EXCEEDED`가 옵니다.

---

### 2-2. BMC 분석 결과 저장 (직접 분석)

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/bmc/analysis` |
| 인증 | **필요** |

직접 분석 결과를 저장합니다. 9개 항목에 더해 **타당성 점수, 리스크, 액션**까지 저장합니다. (`bmcType`은 백엔드가 `DIRECT_ANALYSIS`로 고정하므로 보내지 않아도 됩니다.)

**요청 Body**
```json
{
  "ideaText": "카페 구독 서비스",
  "stage": "VALIDATION",
  "items": [
    { "itemType": "VALUE_PROPOSITION", "content": "..." },
    { "itemType": "CUSTOMER_SEGMENT", "content": "..." },
    { "itemType": "REVENUE_STREAM", "content": "..." },
    { "itemType": "COST_STRUCTURE", "content": "..." },
    { "itemType": "KEY_PARTNERS", "content": "..." },
    { "itemType": "KEY_ACTIVITIES", "content": "..." },
    { "itemType": "KEY_RESOURCES", "content": "..." },
    { "itemType": "CHANNELS", "content": "..." },
    { "itemType": "CUSTOMER_RELATIONSHIPS", "content": "..." }
  ],
  "validityScore": 7,
  "scoreReason": "시장 수요는 있으나 제휴 확보가 관건",
  "risks": [
    { "riskContent": "제휴 카페 이탈", "responseContent": "수익 배분 조정" },
    { "riskContent": "헤비유저 적자", "responseContent": "이용 횟수 상한" }
  ],
  "actions": [
    { "actionContent": "제휴 카페 10곳 확보", "termType": "SHORT" },
    { "actionContent": "베타 출시", "termType": "MID" },
    { "actionContent": "전국 확장", "termType": "LONG" }
  ]
}
```

**응답 (성공)**
```json
{
  "success": true,
  "data": { "bmcRecordId": 2 },
  "error": null
}
```

> **주의**: 하루 분석 한도(5회)를 초과하면 `429 LIMIT_EXCEEDED`가 옵니다. (생성 한도와 별개로 카운트됩니다.)

---

## 3. BMC 삭제 / 수정

### 3-1. BMC 삭제

| 항목 | 내용 |
|------|------|
| 메서드 | `DELETE` |
| 주소 | `/api/bmc/{bmcRecordId}` |
| 인증 | **필요** |

BMC 하나를 통째로 삭제합니다. (딸린 항목·리스크·액션도 함께 삭제됩니다.) **본인 소유의 BMC만** 삭제할 수 있습니다.

**주소 예시**: `/api/bmc/1` → id가 1인 BMC 삭제

**요청 Body**: 없음

**응답 (성공)**
```json
{
  "success": true,
  "data": null,
  "error": null
}
```

**실패 케이스**
- 존재하지 않는 id → `404 NOT_FOUND`
- 남의 BMC 삭제 시도 → `403 FORBIDDEN`

---

### 3-2. BMC 항목 수정

| 항목 | 내용 |
|------|------|
| 메서드 | `PATCH` |
| 주소 | `/api/bmc/items/{itemId}` |
| 인증 | **필요** |

BMC 항목(item) 하나의 내용/메모를 수정합니다. **본인 소유의 항목만** 수정할 수 있습니다.

**주소 예시**: `/api/bmc/items/20` → id가 20인 항목 수정

**요청 Body** (content, memo 둘 다 선택 — 보낸 것만 수정되고, 안 보낸 건 기존 값 유지)
```json
{
  "content": "수정할 새 내용",
  "memo": "메모 내용"
}
```

메모만 수정하고 싶으면:
```json
{
  "memo": "메모만 수정"
}
```

**응답 (성공)**
```json
{
  "success": true,
  "data": null,
  "error": null
}
```

**실패 케이스**
- 존재하지 않는 item id → `404 NOT_FOUND`
- 남의 항목 수정 시도 → `403 FORBIDDEN`

---

## 부록: ENUM 값 정리

요청에 사용하는 정해진 값들입니다. 아래 값만 사용해야 합니다 (대소문자 정확히).

### stage (BMC 진행 단계)
| 값 | 의미 |
|----|------|
| `IDEA` | 아이디어 |
| `VALIDATION` | 검증 |
| `LAUNCH` | 출시 |
| `GROWTH` | 성장 |

### bmcType (BMC 종류)
| 값 | 의미 |
|----|------|
| `AI_GENERATED` | AI 자동생성 |
| `DIRECT_ANALYSIS` | 직접 분석 |

### itemType (BMC 9개 항목)
| 값 | 의미 |
|----|------|
| `VALUE_PROPOSITION` | 가치 제안 |
| `CUSTOMER_SEGMENT` | 고객 세그먼트 |
| `CHANNELS` | 채널 |
| `CUSTOMER_RELATIONSHIPS` | 고객 관계 |
| `REVENUE_STREAM` | 수익원 |
| `KEY_RESOURCES` | 핵심 자원 |
| `KEY_ACTIVITIES` | 핵심 활동 |
| `KEY_PARTNERS` | 핵심 파트너 |
| `COST_STRUCTURE` | 비용 구조 |

> 하나의 BMC 안에서 같은 `itemType`은 한 번만 사용할 수 있습니다 (9개 항목이 각각 다른 타입).

### termType (액션 기간)
| 값 | 의미 |
|----|------|
| `SHORT` | 단기 |
| `MID` | 중기 |
| `LONG` | 장기 |

---

## 연동 시 참고사항

1. **CORS**: 백엔드는 `http://localhost:5173`의 요청을 허용하도록 설정되어 있습니다. 프론트 주소가 바뀌면 백엔드에 알려주세요.
2. **로그인 흐름**: 프론트가 카카오/구글 인가 코드를 받아 백엔드로 전달 → 백엔드가 JWT 반환 → 프론트가 accessToken 저장 → 이후 API 호출 시 `Authorization: Bearer {accessToken}` 헤더 사용.
3. **redirect_uri**: 로그인 연동 시 카카오/구글 콘솔에 등록된 redirect_uri, 프론트 콜백 주소, 백엔드 설정이 모두 일치해야 합니다. (연동 전 백엔드와 함께 맞춰야 함)
4. **토큰 만료**: accessToken은 1시간 후 만료됩니다. 만료 시 재로그인이 필요합니다.
