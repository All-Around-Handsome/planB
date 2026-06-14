package com.imagineers.backend.domain.auth.client;

import com.imagineers.backend.domain.auth.dto.GoogleTokenResponse;
import com.imagineers.backend.domain.auth.dto.GoogleUserResponse;
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
 * 구글 서버와 통신하는 클래스. (카카오 클라이언트와 거의 동일)
 * (1) 인가 코드 → 구글 액세스 토큰 교환
 * (2) 구글 액세스 토큰 → 사용자 정보 조회
 */
@Component
public class GoogleOAuthClient {

    private final RestClient restClient = RestClient.create();

    // application.yml의 oauth.google.* 값들을 읽어온다
    @Value("${oauth.google.client-id}")
    private String clientId;

    @Value("${oauth.google.client-secret}")   // 구글은 시크릿이 필수!
    private String clientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String redirectUri;

    @Value("${oauth.google.token-uri}")
    private String tokenUri;

    @Value("${oauth.google.user-info-uri}")
    private String userInfoUri;

    /**
     * (1) 인가 코드로 구글 액세스 토큰을 받아온다.
     */
    public String requestAccessToken(String code) {
        // 구글 인가 코드에 %2F 같은 URL 인코딩 문자가 섞여 올 수 있어 먼저 디코딩
        code = java.net.URLDecoder.decode(code, java.nio.charset.StandardCharsets.UTF_8);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);  // 카카오와 달리 시크릿 필수
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        GoogleTokenResponse response = restClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new CustomException(ErrorCode.INVALID_REQUEST);
                })
                .body(GoogleTokenResponse.class);

        return response.accessToken();
    }

    /**
     * (2) 구글 액세스 토큰으로 사용자 정보를 받아온다.
     */
    public GoogleUserResponse requestUserInfo(String googleAccessToken) {
        return restClient.get()
                .uri(userInfoUri)
                .header("Authorization", "Bearer " + googleAccessToken)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new CustomException(ErrorCode.INVALID_REQUEST);
                })
                .body(GoogleUserResponse.class);
    }
}