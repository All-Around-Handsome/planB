package com.imagineers.backend.test;

import com.imagineers.backend.global.common.ApiResponse;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import com.imagineers.backend.global.jwt.JwtTokenProvider;
import com.imagineers.backend.domain.limit.service.LimitService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;



@RestController
public class TestController {

    // 토큰 발급기 주입
    private final JwtTokenProvider jwtTokenProvider;
    private final LimitService limitService;  // ✨ 추가

    public TestController(JwtTokenProvider jwtTokenProvider, LimitService limitService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.limitService = limitService;
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of(
                "message", "이매지니어 백엔드 서버 정상 동작 중!",
                "developer", "정우성"
        );
    }

    @GetMapping("/test-error")
    public ApiResponse<String> testError() {
        throw new CustomException(ErrorCode.NOT_FOUND);
    }

    @GetMapping("/test-success")
    public ApiResponse<String> testSuccess() {
        return ApiResponse.success("테스트 성공!");
    }

    // 로그인 없이 임시로 토큰을 발급받는 엔드포인트 (userId=1 가정)
    //         permitAll에 넣었으므로 토큰 없이 접근 가능
    @GetMapping("/test-token")
    public ApiResponse<String> testToken() {
        String accessToken = jwtTokenProvider.createAccessToken(1L);
        return ApiResponse.success(accessToken);
    }

    // 인증이 필요한 엔드포인트.
    //         @AuthenticationPrincipal로 필터가 저장해둔 userId를 꺼낸다
    @GetMapping("/test-auth")
    public ApiResponse<String> testAuth(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success("인증 성공! 당신의 userId는 " + userId + " 입니다.");
    }

    // 생성 횟수 제한 테스트 (로그인 필요)
    //         호출할 때마다 횟수가 1씩 올라가고, 5번 넘으면 막힌다
    @GetMapping("/test-limit-generation")
    public ApiResponse<String> testLimitGeneration(@AuthenticationPrincipal Long userId) {
        limitService.checkAndIncrementGeneration(userId);
        return ApiResponse.success("생성 가능! 횟수가 1 증가했습니다.");
    }
}