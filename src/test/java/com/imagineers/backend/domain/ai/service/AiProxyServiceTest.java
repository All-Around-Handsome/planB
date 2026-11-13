package com.imagineers.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.imagineers.backend.domain.limit.dto.LimitCheckResponse;
import com.imagineers.backend.domain.limit.service.LimitService;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class AiProxyServiceTest {

    private static final Long USER = 1L;
    private static final String GENERATE_URL = "http://ai/api/ai/bmc/generate";

    private final ObjectMapper mapper = new ObjectMapper();
    private final LimitService limitService = mock(LimitService.class);

    private MockRestServiceServer ai;
    private AiProxyService service;
    private JsonNode body;

    @BeforeEach
    void setUp() throws Exception {
        RestClient.Builder builder = RestClient.builder().baseUrl("http://ai");
        ai = MockRestServiceServer.bindTo(builder).build();
        service = new AiProxyService(limitService, builder.build());
        body = mapper.readTree("{\"idea\":\"재고\"}");
    }

    private void limitLeft(boolean canProceed) {
        when(limitService.tryConsumeGeneration(any()))
                .thenReturn(new LimitCheckResponse(canProceed, 0, 5));
    }

    @Test
    void 한도가_남아_있으면_AI_결과를_돌려주고_환불하지_않는다() {
        limitLeft(true);
        ai.expect(requestTo(GENERATE_URL)).andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{\"channels\":\"웹\"}", MediaType.APPLICATION_JSON));

        JsonNode result = service.generateBmc(USER, body);

        assertThat(result.get("channels").asText()).isEqualTo("웹");
        verify(limitService, never()).refundGeneration(any());
        ai.verify();
    }

    @Test
    void 한도를_넘으면_AI를_호출하지_않는다() {
        limitLeft(false);

        assertThatThrownBy(() -> service.generateBmc(USER, body))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode").isEqualTo(ErrorCode.LIMIT_EXCEEDED);

        verify(limitService, never()).refundGeneration(any());
        ai.verify(); // 기대한 호출이 없으므로 AI 호출이 있었다면 실패한다
    }

    @Test
    void AI_서버_오류면_502로_바꾸고_환불한다() {
        limitLeft(true);
        ai.expect(requestTo(GENERATE_URL)).andRespond(withServerError());

        assertThatThrownBy(() -> service.generateBmc(USER, body))
                .extracting("errorCode").isEqualTo(ErrorCode.AI_FAILED);

        verify(limitService).refundGeneration(USER);
    }

    @Test
    void AI_서버가_입력을_거절하면_400으로_바꾸고_환불한다() {
        limitLeft(true);
        ai.expect(requestTo(GENERATE_URL)).andRespond(withBadRequest());

        assertThatThrownBy(() -> service.generateBmc(USER, body))
                .extracting("errorCode").isEqualTo(ErrorCode.INVALID_REQUEST);

        verify(limitService).refundGeneration(USER);
    }

    @Test
    void 제목_생성은_횟수를_쓰지_않고_AI_결과를_돌려준다() {
        ai.expect(requestTo("http://ai/api/ai/title")).andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{\"title\":\"재고 관리 앱\"}", MediaType.APPLICATION_JSON));

        JsonNode result = service.suggestTitle(body);

        assertThat(result.get("title").asText()).isEqualTo("재고 관리 앱");
        verify(limitService, never()).tryConsumeSearch(any());
        verify(limitService, never()).tryConsumeGeneration(any());
        ai.verify();
    }

    @Test
    void 제목_생성_요청이_크면_AI를_부르지_않고_거절한다() {
        JsonNode big = mapper.getNodeFactory().textNode("가".repeat(3_001));

        assertThatThrownBy(() -> service.suggestTitle(big))
                .extracting("errorCode").isEqualTo(ErrorCode.INVALID_REQUEST);
        ai.verify();
    }

    @Test
    void 너무_큰_요청은_횟수를_쓰지_않고_거절한다() {
        JsonNode big = mapper.getNodeFactory().textNode("가".repeat(20_001));

        assertThatThrownBy(() -> service.generateBmc(USER, big))
                .extracting("errorCode").isEqualTo(ErrorCode.INVALID_REQUEST);

        verify(limitService, never()).tryConsumeGeneration(any());
    }
}
