package com.imagineers.backend.domain.auth.client;

import com.imagineers.backend.domain.auth.dto.KakaoTokenResponse;
import com.imagineers.backend.domain.auth.dto.KakaoUserResponse;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/**
 * 카카오 서버와 직접 통신하는 클래스.
 * (1) 인가 코드 → 카카오 액세스 토큰 교환
 * (2) 카카오 액세스 토큰 → 사용자 정보 조회
 */
@Component
public class KakaoOAuthClient {

    // HTTP 요청을 보내는 도구
    private final RestClient restClient = RestClient.create();

    // application.yml의 oauth.kakao.* 값들을 읽어온다
    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    @Value("${oauth.kakao.token-uri}")
    private String tokenUri;

    @Value("${oauth.kakao.user-info-uri}")
    private String userInfoUri;

    /**
     * (1) 인가 코드로 카카오 액세스 토큰을 받아온다.
     */
    public String requestAccessToken(String code) {
        // 카카오 토큰 요청은 form 형식(키=값&키=값)으로 보내야 한다
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code"); // 고정값
        body.add("client_id", clientId);              // 우리 REST API 키
        body.add("redirect_uri", redirectUri);        // 등록한 redirect_uri와 동일해야 함
        body.add("code", code);                       // 프론트가 받은 인가 코드

        KakaoTokenResponse response = restClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // form 형식임을 명시
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new CustomException(ErrorCode.INVALID_REQUEST);
                })
                .body(KakaoTokenResponse.class); // 응답 JSON을 우리 DTO로 변환

        return response.accessToken();
    }

    /**
     * (2) 카카오 액세스 토큰으로 사용자 정보를 받아온다.
     */
    public KakaoUserResponse requestUserInfo(String kakaoAccessToken) {
        return restClient.get()
                .uri(userInfoUri)
                // 카카오가 발급한 토큰을 헤더에 담아 "나 인증된 사용자야"라고 알림
                .header("Authorization", "Bearer " + kakaoAccessToken)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new CustomException(ErrorCode.INVALID_REQUEST);
                })
                .body(KakaoUserResponse.class);
    }
}