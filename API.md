# 이매지니어(Imagineers) 백엔드 API 명세서

프론트엔드 연동용 문서입니다. 백엔드 팀(정우성)이 작성했습니다.

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

> ⚠️ **횟수 차감 안내**: BMC 저장 API는 **일일 횟수를 차감하지 않습니다.**
> 횟수 차감은 저장 전에 호출하는 **횟수 차감 API(4번 항목)** 에서 이루어집니다.
> 전체 흐름: `남은 횟수 조회 → 버튼 클릭 시 차감 → AI 호출 → 저장`
>
> **참고**: BMC 생성/분석의 AI 작업(9칸 채우기, 점수·리스크·액션 산출)은 프론트↔AI에서 이루어지고, 백엔드 저장 API는 **완성된 결과를 받아 저장만** 합니다.

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

> 저장된 BMC의 id(`bmcRecordId`)가 반환됩니다. 이후 조회/삭제/수정에 사용하세요.

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
(수정할 `itemId`는 상세 조회(6-2) 응답의 각 항목에 포함되어 있습니다.)

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

## 4. 사용 횟수 (조회 / 차감)

> 하루 사용 횟수는 **생성**과 **분석**을 별개로 관리합니다. (예: 생성 5회, 분석 5회)
> - **남은 횟수만 보고 싶을 때** → 4-1 조회 API (차감 없음)
> - **실제로 생성/분석을 시작할 때** → 4-2 / 4-3 차감 API (호출 시 1 차감)
>
> **권장 프론트 흐름**
> ```
> ① 페이지 진입 → GET /api/bmc/limit (남은 횟수 표시, 차감 X)
> ② 생성/분석 버튼 클릭 → POST check-generation 또는 check-analysis (여기서 차감)
> ③ canProceed: true면 AI 호출 진행
> ④ AI 결과를 저장 API로 저장 (차감 X)
> ```

### 4-1. 남은 횟수 조회 (차감 없음)

| 항목 | 내용 |
|------|------|
| 메서드 | `GET` |
| 주소 | `/api/bmc/limit` |
| 인증 | **필요** |

오늘 남은 생성/분석 횟수를 반환합니다. **횟수를 차감하지 않습니다.** 페이지 진입 시 "생성 3/5, 분석 4/5" 표시용.

**요청 Body**: 없음

**응답 (성공)**
```json
{
  "success": true,
  "data": {
    "remainingGeneration": 3,
    "generationLimit": 5,
    "remainingAnalysis": 4,
    "analysisLimit": 5
  },
  "error": null
}
```

> `remainingGeneration`/`remainingAnalysis`: 각각 오늘 남은 횟수
> `generationLimit`/`analysisLimit`: 각각 하루 한도

---

### 4-2. AI 생성 횟수 차감

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/bmc/check-generation` |
| 인증 | **필요** |

AI 생성을 시작하기 **직전**(생성 버튼 클릭 시)에 호출합니다. 호출 시 오늘 생성 횟수가 1 차감됩니다.

**요청 Body**: 없음

**응답 (가능)**
```json
{
  "success": true,
  "data": { "canProceed": true, "remaining": 4, "limit": 5 },
  "error": null
}
```

**응답 (한도 초과)**
```json
{
  "success": true,
  "data": { "canProceed": false, "remaining": 0, "limit": 5 },
  "error": null
}
```

> 한도를 초과해도 **HTTP 200**으로 응답합니다. `canProceed` 값으로 판단하세요.
> - `canProceed: true` → 차감 완료, AI 호출 진행
> - `canProceed: false` → 차감되지 않음, 사용자에게 한도 초과 안내
> - `remaining`: 차감 후 남은 횟수 / `limit`: 하루 한도

---

### 4-3. 직접 분석 횟수 차감

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 주소 | `/api/bmc/check-analysis` |
| 인증 | **필요** |

직접 분석을 시작하기 직전(분석 버튼 클릭 시)에 호출합니다. 생성과 **별개로** 분석 횟수가 1 차감됩니다.

**요청 Body**: 없음

**응답**: 4-2와 동일한 형식 (`canProceed`, `remaining`, `limit`)

---

## 5. BMC 조회

### 5-1. 내 BMC 목록 조회

| 항목 | 내용 |
|------|------|
| 메서드 | `GET` |
| 주소 | `/api/bmc` |
| 인증 | **필요** |

로그인한 사용자가 저장한 BMC들을 **최신순**으로 반환합니다. 마이페이지 목록용(간략 정보).

**요청 Body**: 없음

**응답 (성공)**
```json
{
  "success": true,
  "data": [
    {
      "bmcRecordId": 2,
      "ideaText": "카페 구독 서비스",
      "stage": "VALIDATION",
      "bmcType": "DIRECT_ANALYSIS",
      "validityScore": 7,
      "createdAt": "2026-06-29T12:00:00"
    },
    {
      "bmcRecordId": 1,
      "ideaText": "반려동물 산책 매칭 서비스",
      "stage": "IDEA",
      "bmcType": "AI_GENERATED",
      "validityScore": null,
      "createdAt": "2026-06-28T09:30:00"
    }
  ],
  "error": null
}
```

> 저장된 BMC가 없으면 빈 배열 `[]`이 옵니다.
> `validityScore`는 직접분석이면 점수, AI생성이면 `null`입니다.

---

### 5-2. BMC 상세 조회

| 항목 | 내용 |
|------|------|
| 메서드 | `GET` |
| 주소 | `/api/bmc/{bmcRecordId}` |
| 인증 | **필요** |

BMC 하나의 **전체 내용**을 반환합니다. 아이디어 + 9개 항목 + 리스크 + 액션이 **한 번에** 내려옵니다. 본인 소유만 조회 가능.

**주소 예시**: `/api/bmc/2` → 2번 BMC 전체 내용

**요청 Body**: 없음

**응답 (성공)**
```json
{
  "success": true,
  "data": {
    "bmcRecordId": 2,
    "ideaText": "카페 구독 서비스",
    "stage": "VALIDATION",
    "bmcType": "DIRECT_ANALYSIS",
    "validityScore": 7,
    "scoreReason": "시장 수요는 있으나 카페 제휴 확보가 관건",
    "createdAt": "2026-06-29T12:00:00",
    "items": [
      { "itemId": 10, "itemType": "VALUE_PROPOSITION", "content": "월정액 무제한 커피", "memo": null },
      { "itemId": 11, "itemType": "CUSTOMER_SEGMENT", "content": "직장인", "memo": "타겟 구체화 필요" }
    ],
    "risks": [
      { "riskId": 5, "riskContent": "제휴 카페 이탈", "responseContent": "수익 배분 조정", "orderIndex": 0 }
    ],
    "actions": [
      { "actionId": 3, "actionContent": "제휴 카페 10곳 확보", "termType": "SHORT", "orderIndex": 0 }
    ]
  },
  "error": null
}
```

> AI생성 BMC는 `risks`, `actions`가 빈 배열 `[]`, `validityScore`/`scoreReason`은 `null`입니다.
> 직접분석 BMC는 위처럼 모두 채워져 옵니다.

**실패 케이스**
- 존재하지 않는 id → `404 NOT_FOUND`
- 남의 BMC 조회 시도 → `403 FORBIDDEN`

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
| `AI_GENERATED` | AI 자동생성 (9칸만) |
| `DIRECT_ANALYSIS` | 직접 분석 (9칸 + 점수·리스크·액션) |

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

## 전체 엔드포인트 요약

| 기능 | 메서드 | 주소 | 인증 |
|------|--------|------|------|
| 카카오 로그인 | POST | `/api/auth/kakao` | - |
| 구글 로그인 | POST | `/api/auth/google` | - |
| 로그아웃 | POST | `/api/auth/logout` | ✅ |
| 남은 횟수 조회 (차감 X) | GET | `/api/bmc/limit` | ✅ |
| 생성 횟수 차감 | POST | `/api/bmc/check-generation` | ✅ |
| 분석 횟수 차감 | POST | `/api/bmc/check-analysis` | ✅ |
| BMC 생성 저장 | POST | `/api/bmc` | ✅ |
| BMC 분석 저장 | POST | `/api/bmc/analysis` | ✅ |
| BMC 목록 조회 | GET | `/api/bmc` | ✅ |
| BMC 상세 조회 | GET | `/api/bmc/{id}` | ✅ |
| BMC 삭제 | DELETE | `/api/bmc/{id}` | ✅ |
| BMC 항목 수정 | PATCH | `/api/bmc/items/{itemId}` | ✅ |

---

## 연동 시 참고사항

1. **CORS**: 백엔드는 `http://localhost:5173`의 요청을 허용하도록 설정되어 있습니다. 프론트 주소가 바뀌면 백엔드에 알려주세요.
2. **로그인 흐름**: 프론트가 카카오/구글 인가 코드를 받아 백엔드로 전달 → 백엔드가 JWT 반환 → 프론트가 accessToken 저장 → 이후 API 호출 시 `Authorization: Bearer {accessToken}` 헤더 사용. (자세한 내용은 `LOGIN_GUIDE.md` 참고)
3. **BMC 생성/분석 흐름**: 남은 횟수 조회(`GET /api/bmc/limit`) → 버튼 클릭 시 차감(`check-generation` 또는 `check-analysis`) → `canProceed: true`면 AI 호출 → 저장(`/api/bmc` 또는 `/api/bmc/analysis`). 횟수는 차감 API에서만 줄어듭니다.
4. **토큰 만료**: accessToken은 1시간 후 만료됩니다. 만료 시 재로그인이 필요합니다.