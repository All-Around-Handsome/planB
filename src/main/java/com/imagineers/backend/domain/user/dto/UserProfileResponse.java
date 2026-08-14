package com.imagineers.backend.domain.user.dto;

import com.imagineers.backend.domain.user.entity.User;

/**
 * 사용자 프로필 조회 응답.
 * 프론트가 헤더/마이페이지에 표시할 정보.
 * (이메일은 카카오에서 제공되지 않아 팀 결정에 따라 제외)
 */
public record UserProfileResponse(
        Long userId,
        String name,
        String profileImageUrl
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getProfileImageUrl()
        );
    }
}