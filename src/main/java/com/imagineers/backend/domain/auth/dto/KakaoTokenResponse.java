package com.imagineers.backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// 카카오 토큰 발급 응답을 담는 그릇.
// 카카오는 JSON 키를 snake_case(access_token)로 주는데,
// 자바는 camelCase(accessToken)를 쓰므로 @JsonProperty로 이름을 연결해준다.
@JsonIgnoreProperties(ignoreUnknown = true)  // 우리가 안 쓰는 필드는 무시
public record KakaoTokenResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("refresh_token") String refreshToken,
        @JsonProperty("token_type") String tokenType,
        @JsonProperty("expires_in") Integer expiresIn
) {
}