package com.imagineers.backend.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * 모든 HTTP 요청마다 딱 한 번 실행되는 필터(OncePerRequestFilter).
 * 요청 헤더에서 JWT를 꺼내 검증하고, 통과하면 "인증된 사용자"로 등록한다.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    // 생성자 주입: 위에서 만든 JwtTokenProvider를 스프링이 넣어줌
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 요청이 들어올 때마다 실행되는 메서드.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. 요청 헤더에서 토큰을 꺼낸다
        String token = resolveToken(request);

        // 2. 토큰이 있고, 유효하다면 → "인증 완료" 처리
        if (token != null && jwtTokenProvider.validateToken(token)) {
            Long userId = jwtTokenProvider.getUserId(token); // 토큰에서 userId 추출

            // 스프링 시큐리티가 이해하는 "인증 객체"를 만든다.
            // 첫 번째 인자(principal)에 userId를 넣어두면, 컨트롤러에서 꺼내 쓸 수 있다.
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,                 // principal: 누구인지 (userId)
                            null,                   // credentials: 비밀번호 (JWT라 불필요)
                            Collections.emptyList() // 권한 목록 (지금은 비워둠)
                    );

            // 보안 컨텍스트에 인증 정보를 저장 → 이 요청은 이제 "인증된 요청"이 됨
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 3. 다음 필터(또는 컨트롤러)로 요청을 넘긴다.
        //    토큰이 없거나 틀렸어도 일단 넘긴다 → 보호된 URL이면 시큐리티가 401로 막아줌
        filterChain.doFilter(request, response);
    }

    /**
     * 헤더에서 토큰 문자열만 깔끔하게 꺼내는 메서드.
     * "Authorization: Bearer xxxxx" 형식에서 'Bearer ' 를 떼고 xxxxx만 반환.
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // 헤더가 있고 "Bearer "로 시작하면, 그 뒤의 실제 토큰만 잘라서 반환
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer "는 7글자라서 7번째부터가 토큰
        }
        return null; // 토큰이 없으면 null
    }
}