package com.imagineers.backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// 구글 사용자 정보 응답을 담는 그릇.
// 실제 JSON 구조 (카카오보다 단순, 중첩 없음):
// { "sub": "1234567890", "name": "홍길동", "email": "hong@gmail.com", ... }
@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleUserResponse(
        String sub,    // 구글 고유 사용자 ID → 우리 DB의 oauth_id로 사용
        String name,   // 이름
        String email   // 이메일 (구글은 기본으로 줌!)
) {
}