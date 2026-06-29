package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.global.enums.Stage;
import java.util.List;

// 프론트 → 백엔드로 들어오는 BMC 분석 저장 요청 (직접분석, N-014)
// G-004(생성 저장)보다 담는 게 많다: 점수 + 리스크 + 액션 추가
public record BmcAnalysisRequest(
        String ideaText,                  // 아이디어 원문
        Stage stage,                      // 진행 단계
        List<BmcItemRequest> items,       // 9개 항목 (G-004 때 만든 DTO 재사용)
        Integer validityScore,            // 타당성 점수 1~10 (N-011)
        String scoreReason,               // 점수 근거
        List<BmcRiskRequest> risks,       // 리스크 목록 (N-012)
        List<BmcActionRequest> actions    // 액션 목록 (N-013)
) {
}