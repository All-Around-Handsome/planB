package com.imagineers.backend.domain.auth.dto;

// 백엔드 → 프론트로 나가는 응답 그릇. 우리가 발급한 JWT 두 개를 담는다.
public record TokenResponse(String accessToken, String refreshToken) {
}