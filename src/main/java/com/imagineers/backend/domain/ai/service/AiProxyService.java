package com.imagineers.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.imagineers.backend.domain.limit.dto.LimitCheckResponse;
import com.imagineers.backend.domain.limit.service.LimitService;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * AI 서버 호출 전담. 프론트는 AI 서버를 직접 부르지 않고 여기를 거친다.
 * 횟수를 먼저 차감하고 AI를 호출하며, AI 호출이 실패하면 차감을 되돌린다.
 * 트랜잭션을 걸지 않는다: 차감이 커밋된 뒤에 오래 걸리는 AI를 호출하기 위함.
 */
@Slf4j
@Service
public class AiProxyService {

    // 비용 보호용 요청 크기 제한 (문자 수)
    private static final int MAX_BODY_LENGTH = 20_000;
    private static final int MAX_TITLE_BODY_LENGTH = 3_000;

    private final LimitService limitService;
    private final RestClient restClient;

    @Autowired
    public AiProxyService(LimitService limitService,
                          @Value("${ai.base-url:http://localhost:8081}") String aiBaseUrl) {
        this(limitService, RestClient.builder()
                .baseUrl(aiBaseUrl)
                .requestFactory(timeoutFactory())
                .build());
    }

    AiProxyService(LimitService limitService, RestClient restClient) {
        this.limitService = limitService;
        this.restClient = restClient;
    }

    private static SimpleClientHttpRequestFactory timeoutFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(3));
        factory.setReadTimeout(Duration.ofSeconds(180));
        return factory;
    }

    public JsonNode searchCompetitors(Long userId, JsonNode body) {
        return call("/api/ai/competitors", userId, body,
                limitService::tryConsumeSearch, limitService::refundSearch);
    }

    public JsonNode generateBmc(Long userId, JsonNode body) {
        return call("/api/ai/bmc/generate", userId, body,
                limitService::tryConsumeGeneration, limitService::refundGeneration);
    }

    public JsonNode analyzeBmc(Long userId, JsonNode body) {
        return call("/api/ai/bmc/analyze", userId, body,
                limitService::tryConsumeAnalysis, limitService::refundAnalysis);
    }

    /**
     * 아이디어 제목 자동 생성. 작은 모델이라 횟수를 차감하지 않는 대신 요청 크기를 작게 제한한다.
     */
    public JsonNode suggestTitle(JsonNode body) {
        if (body == null || body.toString().length() > MAX_TITLE_BODY_LENGTH) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        try {
            return post("/api/ai/title", body);
        } catch (HttpClientErrorException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        } catch (RestClientException e) {
            log.error("AI 서버 호출 실패: /api/ai/title", e);
            throw new CustomException(ErrorCode.AI_FAILED);
        }
    }

    private JsonNode post(String path, JsonNode body) {
        return restClient.post()
                .uri(path)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);
    }

    private JsonNode call(String path, Long userId, JsonNode body,
                          Function<Long, LimitCheckResponse> consume,
                          Consumer<Long> refund) {
        if (body == null || body.toString().length() > MAX_BODY_LENGTH) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        if (!consume.apply(userId).canProceed()) {
            throw new CustomException(ErrorCode.LIMIT_EXCEEDED);
        }

        try {
            return post(path, body);
        } catch (HttpClientErrorException e) {
            // AI 서버가 요청을 거절한 경우 (입력값 오류)
            refund.accept(userId);
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        } catch (RestClientException e) {
            // AI 서버 오류, 연결 실패, 시간 초과
            log.error("AI 서버 호출 실패: {}", path, e);
            refund.accept(userId);
            throw new CustomException(ErrorCode.AI_FAILED);
        }
    }
}
