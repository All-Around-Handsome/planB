package com.imagineers.backend.domain.user.service;

import com.imagineers.backend.domain.user.dto.UserProfileResponse;
import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.domain.user.repository.UserRepository;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 정보 조회 로직.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // 조회 전용
public class UserService {

    private final UserRepository userRepository;

    /**
     * 내 프로필 조회
     * @param userId 토큰에서 꺼낸 사용자 id
     * @return 이름 + 프로필 사진
     */
    public UserProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        return UserProfileResponse.from(user);
    }
}