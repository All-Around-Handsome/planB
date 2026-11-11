package com.bmc.ai.dto;

import com.bmc.ai.model.CompetitorAnalysis.CompetitorComparison;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * BMC 생성 요청 (G-001). useCompetitorContext=true 면 경쟁 서비스를 컨텍스트로 활용.
 * competitors 는 프론트가 경쟁 탐색에서 이미 받은 결과(선택). 있으면 다시 찾지 않고 그대로 쓴다.
 */
public record BmcGenerationRequest(
        @NotBlank @Size(min = 10) String idea,
        @NotBlank String stage,            // 아이디어 / 검증 / 초기 런칭 / 성장
        boolean useCompetitorContext,
        @Size(max = 10) List<CompetitorComparison> competitors
) {}
