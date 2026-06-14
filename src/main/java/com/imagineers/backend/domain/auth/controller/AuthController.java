package com.imagineers.backend.domain.auth.controller;

import com.imagineers.backend.domain.auth.dto.LoginRequest;
import com.imagineers.backend.domain.auth.dto.TokenResponse;
import com.imagineers.backend.domain.auth.service.AuthService;
import com.imagineers.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인증 관련 API 입구.
 * 주소가 /api/auth/** 라서 SecurityConfig에서 이미 permitAll(인증 없이 접근 가능) 처리됨.
 */
@RestController
@RequestMapping("/api/auth")  // 이 컨트롤러의 모든 주소 앞에 /api/auth 가 붙음
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 카카오 로그인 (A-001)
     * 프론트가 인가 코드를 body에 담아 POST로 보낸다.
     */
    @PostMapping("/kakao")  // 최종 주소: POST /api/auth/kakao
    public ApiResponse<TokenResponse> kakaoLogin(@RequestBody LoginRequest request) {
        // @RequestBody: 프론트가 보낸 JSON을 LoginRequest 그릇에 자동으로 담아줌
        TokenResponse tokenResponse = authService.kakaoLogin(request.code());
        return ApiResponse.success(tokenResponse);
    }

    /**
     * 구글 로그인 (A-002)
     */
    @PostMapping("/google")  // 최종 주소: POST /api/auth/google
    public ApiResponse<TokenResponse> googleLogin(@RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.googleLogin(request.code());
        return ApiResponse.success(tokenResponse);
    }

    /**
     * 로그아웃 (A-013)
     * 로그인된 사용자만 호출 가능 (Authorization 헤더에 JWT 필요)
     */
    @PostMapping("/logout")  // 최종 주소: POST /api/auth/logout
    public ApiResponse<Void> logout(@AuthenticationPrincipal Long userId) {
        // @AuthenticationPrincipal: JWT 필터가 인증 시 넣어둔 userId를 꺼냄
        authService.logout(userId);
        return ApiResponse.success(null);  // 돌려줄 데이터는 없음
    }
}