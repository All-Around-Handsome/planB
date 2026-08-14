package com.imagineers.backend.domain.user.controller;

import com.imagineers.backend.domain.user.dto.UserProfileResponse;
import com.imagineers.backend.domain.user.service.UserService;
import com.imagineers.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 사용자 관련 API 입구.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 내 프로필 조회
     * 로그인 필요. 이름과 프로필 사진을 반환.
     * 주소: GET /api/users/me
     */
    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Long userId
    ) {
        UserProfileResponse profile = userService.getMyProfile(userId);
        return ApiResponse.success(profile);
    }
}