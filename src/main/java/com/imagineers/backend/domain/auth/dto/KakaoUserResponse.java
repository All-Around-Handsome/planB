package com.imagineers.backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// 카카오 사용자 정보 응답을 담는 그릇.
// 실제 JSON 구조:
// { "id": 12345, "kakao_account": { "email": "...", "profile": { "nickname": "홍길동" } } }
@JsonIgnoreProperties(ignoreUnknown = true)
public record KakaoUserResponse(
        Long id,  // 카카오 회원번호 → 우리 DB의 oauth_id로 사용
        @JsonProperty("kakao_account") KakaoAccount kakaoAccount
) {
    // 중첩된 kakao_account 부분
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record KakaoAccount(
            String email,       // 이메일 (없을 수 있음 → null)
            Profile profile
    ) {
        // 또 그 안의 profile 부분
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Profile(
                String nickname  // 닉네임 → 우리 DB의 name으로 사용
        ) {
        }
    }

    // 닉네임을 안전하게 꺼내는 도우미 메서드 (중간이 null이어도 에러 안 나게)
    public String getNickname() {
        if (kakaoAccount == null || kakaoAccount.profile() == null) {
            return "카카오사용자";  // 혹시 닉네임이 없으면 기본값
        }
        return kakaoAccount.profile().nickname();
    }

    // 이메일을 안전하게 꺼내는 도우미 메서드
    public String getEmail() {
        if (kakaoAccount == null) {
            return null;
        }
        return kakaoAccount.email();  // 동의 안 했으면 null
    }
}