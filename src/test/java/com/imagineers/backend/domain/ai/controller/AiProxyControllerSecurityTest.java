package com.imagineers.backend.domain.ai.controller;

import com.imagineers.backend.domain.ai.service.AiProxyService;
import com.imagineers.backend.global.config.SecurityConfig;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import com.imagineers.backend.global.exception.GlobalExceptionHandler;
import com.imagineers.backend.global.jwt.JwtAuthenticationEntryPoint;
import com.imagineers.backend.global.jwt.JwtAuthenticationFilter;
import com.imagineers.backend.global.jwt.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiProxyController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class, GlobalExceptionHandler.class})
class AiProxyControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AiProxyService aiProxyService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    private MockHttpServletRequestBuilder generate() {
        return post("/api/bmc/ai/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"idea\":\"재고\"}");
    }

    private MockHttpServletRequestBuilder generateWithToken() {
        when(jwtTokenProvider.validateToken("good")).thenReturn(true);
        when(jwtTokenProvider.getUserId("good")).thenReturn(7L);
        return generate().header("Authorization", "Bearer good");
    }

    @Test
    void 토큰이_없으면_401이고_AI를_부르지_않는다() throws Exception {
        mockMvc.perform(generate()).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/bmc/ai/competitors").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/bmc/ai/analyze").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());

        verify(aiProxyService, never()).generateBmc(any(), any());
    }

    @Test
    void 위조_토큰도_401이다() throws Exception {
        when(jwtTokenProvider.validateToken("bad")).thenReturn(false);

        mockMvc.perform(generate().header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void 유효한_토큰이면_토큰의_사용자로_처리한다() throws Exception {
        when(aiProxyService.generateBmc(eq(7L), any())).thenReturn(null);

        mockMvc.perform(generateWithToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(aiProxyService).generateBmc(eq(7L), any());
    }

    @Test
    void 한도_초과는_429로_응답한다() throws Exception {
        when(aiProxyService.generateBmc(eq(7L), any()))
                .thenThrow(new CustomException(ErrorCode.LIMIT_EXCEEDED));

        mockMvc.perform(generateWithToken())
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.error.code").value("LIMIT_EXCEEDED"));
    }

    @Test
    void 잘못된_JSON은_400으로_응답한다() throws Exception {
        when(jwtTokenProvider.validateToken("good")).thenReturn(true);
        when(jwtTokenProvider.getUserId("good")).thenReturn(7L);

        mockMvc.perform(post("/api/bmc/ai/generate")
                        .header("Authorization", "Bearer good")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("not-json"))
                .andExpect(status().isBadRequest());
    }
}
