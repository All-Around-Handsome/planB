package com.imagineers.backend.domain.auth.service;

import com.imagineers.backend.domain.auth.client.GoogleOAuthClient;
import com.imagineers.backend.domain.auth.client.KakaoOAuthClient;
import com.imagineers.backend.domain.auth.dto.GoogleUserResponse;
import com.imagineers.backend.domain.auth.dto.KakaoUserResponse;
import com.imagineers.backend.domain.auth.dto.TokenResponse;
import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.domain.user.repository.UserRepository;
import com.imagineers.backend.global.enums.OauthProvider;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import com.imagineers.backend.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 소셜 로그인 핵심 로직.
 * 카카오 인증 → 회원 조회/생성 → 우리 JWT 발급까지 담당.
 */
@Service
@RequiredArgsConstructor  // final 필드들을 받는 생성자를 Lombok이 자동 생성 (주입 편의)
@Transactional            // 이 클래스 메서드는 하나의 DB 작업 단위로 묶임
public class AuthService {

    // 위에서 만든 부품들과 지난주 만든 JWT 발급기를 주입받는다
    private final KakaoOAuthClient kakaoOAuthClient;
    private final GoogleOAuthClient googleOAuthClient;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 카카오 로그인 전체 처리.
     * @param code 프론트가 카카오에게 받아 넘겨준 인가 코드
     * @return 우리가 발급한 JWT (access + refresh)
     */
    public TokenResponse kakaoLogin(String code) {
        // 1. 인가 코드로 카카오 액세스 토큰 받기
        String kakaoAccessToken = kakaoOAuthClient.requestAccessToken(code);

        // 2. 카카오 액세스 토큰으로 사용자 정보 받기
        KakaoUserResponse userInfo = kakaoOAuthClient.requestUserInfo(kakaoAccessToken);

        // 3. 카카오 회원번호를 문자열로 변환 (우리 DB의 oauth_id)
        String oauthId = String.valueOf(userInfo.id());

        // 4. 기존 회원인지 조회 → 없으면 신규 가입 (A-011)
        User user = userRepository
                .findByOauthProviderAndOauthId(OauthProvider.KAKAO, oauthId)
                .orElseGet(() -> registerNewUser(userInfo, oauthId));

        // 5. 우리 JWT 발급 (A-012) - 지난주 만든 JwtTokenProvider 사용!
        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        // 6. refresh token을 DB에 저장
        //    user는 DB에서 조회됐거나 방금 저장된 "관리 상태"라,
        //    값만 바꿔두면 트랜잭션이 끝날 때 자동으로 DB에 반영된다 (변경 감지)
        user.updateRefreshToken(refreshToken);

        // 7. 프론트에 우리 JWT 반환
        return new TokenResponse(accessToken, refreshToken);
    }

    /**
     * 구글 로그인 전체 처리. (카카오와 동일한 흐름)
     * @param code 프론트가 구글에게 받아 넘겨준 인가 코드
     * @return 우리가 발급한 JWT (access + refresh)
     */
    public TokenResponse googleLogin(String code) {
        // 1. 인가 코드로 구글 액세스 토큰 받기
        String googleAccessToken = googleOAuthClient.requestAccessToken(code);

        // 2. 구글 액세스 토큰으로 사용자 정보 받기
        GoogleUserResponse userInfo = googleOAuthClient.requestUserInfo(googleAccessToken);

        // 3. 구글 고유 ID (우리 DB의 oauth_id)
        String oauthId = userInfo.sub();

        // 4. 기존 회원인지 조회 → 없으면 신규 가입
        User user = userRepository
                .findByOauthProviderAndOauthId(OauthProvider.GOOGLE, oauthId)
                .orElseGet(() -> registerNewGoogleUser(userInfo, oauthId));

        // 5. 우리 JWT 발급
        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        // 6. refresh token을 DB에 저장
        user.updateRefreshToken(refreshToken);

        // 7. 프론트에 우리 JWT 반환
        return new TokenResponse(accessToken, refreshToken);
    }

    /**
     * 로그아웃 (A-013)
     * JWT는 서버가 강제 취소할 수 없으므로,
     * DB에 저장된 refreshToken을 지워서 더 이상 토큰 재발급을 못 받게 한다.
     * @param userId 로그아웃할 사용자 ID (JWT 필터가 넣어준 값)
     */
    public void logout(Long userId) {
        // 1. userId로 사용자 조회 (없으면 예외)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 2. refreshToken을 null로 비워서 무효화
        user.updateRefreshToken(null);
        // user는 조회된 "관리 상태"라, 값만 바꾸면 트랜잭션 끝날 때 자동 반영(변경 감지)
    }

    /**
     * 구글 신규 회원을 만들어 DB에 저장한다.
     */
    private User registerNewGoogleUser(GoogleUserResponse userInfo, String oauthId) {
        User newUser = User.builder()
                .oauthProvider(OauthProvider.GOOGLE)
                .oauthId(oauthId)
                .name(userInfo.name())     // 구글은 바로 꺼낼 수 있음
                .email(userInfo.email())   // 구글은 이메일을 기본으로 줌
                .build();
        return userRepository.save(newUser);
    }

    /**
     * 신규 회원을 만들어 DB에 저장한다.
     */
    private User registerNewUser(KakaoUserResponse userInfo, String oauthId) {
        User newUser = User.builder()
                .oauthProvider(OauthProvider.KAKAO)
                .oauthId(oauthId)
                .name(userInfo.getNickname())  // 도우미 메서드로 안전하게 꺼냄
                .email(userInfo.getEmail())    // 없으면 null로 저장됨
                .build();
        return userRepository.save(newUser);
    }
}