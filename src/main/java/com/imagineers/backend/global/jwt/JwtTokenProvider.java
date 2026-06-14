package com.imagineers.backend.global.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰을 "생성"하고 "검증"하는 핵심 클래스.
 * - 토큰 안에는 사용자를 식별하는 userId를 담는다.
 * - 토큰을 만들 때와 검사할 때 같은 비밀 키(secretKey)를 사용한다.
 */
@Component  // 스프링이 이 클래스를 관리(빈 등록)하도록 표시. 다른 곳에서 주입받아 쓸 수 있음
public class JwtTokenProvider {

    // 토큰 서명에 쓰는 비밀 키 (한 번 만들어두고 계속 재사용)
    private final SecretKey secretKey;

    // Access / Refresh 토큰 유효시간 (yml에서 읽어온 값)
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    /**
     * 생성자. 스프링이 객체를 만들 때 yml의 값들을 자동으로 넣어준다.
     * @Value("${...}") : application.yml의 해당 값을 가져온다는 의미
     */
    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        // 문자열 secret을 바이트로 바꿔서 서명용 키 객체로 만든다.
        // 키가 충분히 길면(64자 이상) 자동으로 강력한 HS512 알고리즘을 사용한다.
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Access Token 생성
     * @param userId 토큰에 담을 사용자 ID
     * @return 생성된 JWT 문자열
     */
    public String createAccessToken(Long userId) {
        return createToken(userId, accessTokenExpiration);
    }

    /**
     * Refresh Token 생성
     */
    public String createRefreshToken(Long userId) {
        return createToken(userId, refreshTokenExpiration);
    }

    /**
     * 실제 토큰을 만드는 공통 로직 (private이라 클래스 내부에서만 사용)
     */
    private String createToken(Long userId, long expiration) {
        Date now = new Date();                          // 현재 시각
        Date expiry = new Date(now.getTime() + expiration); // 만료 시각 = 현재 + 유효시간

        return Jwts.builder()
                .subject(String.valueOf(userId)) // 토큰의 주인(subject)에 userId 저장
                .issuedAt(now)                   // 발급 시각
                .expiration(expiry)              // 만료 시각
                .signWith(secretKey)             // 비밀 키로 서명 (위조 방지)
                .compact();                      // 최종 문자열로 압축
    }

    /**
     * 토큰에서 userId를 꺼낸다.
     * @param token 검사할 JWT
     * @return 토큰에 들어있던 userId
     */
    public Long getUserId(String token) {
        Claims claims = parseClaims(token); // 토큰 내용물(claims) 꺼내기
        return Long.valueOf(claims.getSubject()); // subject에 저장했던 userId 반환
    }

    /**
     * 토큰이 유효한지 검사한다.
     * @return 유효하면 true, 위조/만료/형식오류면 false
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // 파싱이 성공하면 유효한 토큰
            return true;
        } catch (Exception e) {
            // 만료됐거나, 서명이 위조됐거나, 형식이 잘못된 경우 모두 여기로 옴
            return false;
        }
    }

    /**
     * 토큰을 해석해서 내용물(Claims)을 꺼내는 공통 로직.
     * 이 과정에서 서명 검증과 만료 검사가 자동으로 이뤄진다.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)        // 우리 비밀 키로 서명을 검증
                .build()
                .parseSignedClaims(token)     // 토큰 파싱 (틀리면 여기서 예외 발생)
                .getPayload();                // 내용물 반환
    }
}