package com.imagineers.backend.domain.limit.dto;

/**
 * 남은 횟수 조회 응답 (차감 없이 현재 상태만).
 * 프론트가 페이지 진입 시 "생성 3/5, 분석 4/5" 표시용.
 */
public record LimitStatusResponse(
        int remainingGeneration,  // 생성 남은 횟수
        int generationLimit,      // 생성 하루 한도
        int remainingAnalysis,    // 분석 남은 횟수
        int analysisLimit,         // 분석 하루 한도
        int remainingSearch,      // 탐색 남은 횟수
        int searchLimit           // 탐색 하루 한도
) {
}