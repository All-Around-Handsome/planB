package com.imagineers.backend.domain.limit.dto;

/**
 * 횟수 체크 API 응답.
 * 프론트가 AI 호출 전에 "생성 가능한지" 확인할 때 받는 결과.
 */
public record LimitCheckResponse(
        boolean canProceed,  // 진행 가능 여부 (true면 AI 호출 OK)
        int remaining,       // 오늘 남은 횟수
        int limit            // 하루 한도 (예: 5)
) {
}