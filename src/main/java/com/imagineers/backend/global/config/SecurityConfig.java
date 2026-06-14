package com.imagineers.backend.global.config;

import com.imagineers.backend.global.jwt.JwtAuthenticationEntryPoint; // ✨ 추가
import com.imagineers.backend.global.jwt.JwtAuthenticationFilter;     // ✨ 추가
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // ✨ 추가
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ✨ 추가: 우리가 만든 필터와 엔트리포인트를 주입받는다
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // ✨ 추가: 생성자 주입
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/hello",
                                "/test-error",
                                "/test-success",
                                "/test-token",   // ✨ 추가: 테스트용 토큰 발급 (로그인 없이 토큰 받기용)
                                "/error",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        // ✨ 로그인 API는 토큰 없이 접근 가능 (구체적으로 명시)
                        .requestMatchers("/api/auth/kakao", "/api/auth/google").permitAll()
                        // ✨ 그 외 /api/auth/** (= 로그아웃 등)는 인증 필요
                        .requestMatchers("/api/auth/**").authenticated()
                        .anyRequest().authenticated()
                )
                // ✨ 추가: 인증 실패 시 우리가 만든 EntryPoint가 401 응답을 내리도록 등록
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                // ✨ 추가: 기본 인증 필터보다 "먼저" 우리 JWT 필터를 실행하도록 등록
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}