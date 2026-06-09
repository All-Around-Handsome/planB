package com.bmc.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** BMC 생성 요청 (G-001). useCompetitorContext=true 면 경쟁 탐색 결과를 RAG 컨텍스트로 활용. */
public record BmcGenerationRequest(
        @NotBlank @Size(min = 10) String idea,
        @NotBlank String stage,            // 아이디어 / 검증 / 초기 런칭 / 성장
        boolean useCompetitorContext
) {}
