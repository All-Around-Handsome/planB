package com.imagineers.backend.domain.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.imagineers.backend.domain.ai.service.AiProxyService;
import com.imagineers.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 로그인한 사용자의 AI 요청을 받아 횟수를 확인한 뒤 AI 서버로 전달한다.
 * 횟수 초과 시 429, AI 서버 실패 시 502를 응답하고 차감을 되돌린다.
 */
@RestController
@RequestMapping("/api/bmc/ai")
@RequiredArgsConstructor
public class AiProxyController {

    private final AiProxyService aiProxyService;

    // 최종 주소: POST /api/bmc/ai/competitors
    @PostMapping("/competitors")
    public ApiResponse<JsonNode> searchCompetitors(
            @AuthenticationPrincipal Long userId,
            @RequestBody JsonNode body
    ) {
        return ApiResponse.success(aiProxyService.searchCompetitors(userId, body));
    }

    // 최종 주소: POST /api/bmc/ai/generate
    @PostMapping("/generate")
    public ApiResponse<JsonNode> generateBmc(
            @AuthenticationPrincipal Long userId,
            @RequestBody JsonNode body
    ) {
        return ApiResponse.success(aiProxyService.generateBmc(userId, body));
    }

    // 최종 주소: POST /api/bmc/ai/analyze
    @PostMapping("/analyze")
    public ApiResponse<JsonNode> analyzeBmc(
            @AuthenticationPrincipal Long userId,
            @RequestBody JsonNode body
    ) {
        return ApiResponse.success(aiProxyService.analyzeBmc(userId, body));
    }
}
