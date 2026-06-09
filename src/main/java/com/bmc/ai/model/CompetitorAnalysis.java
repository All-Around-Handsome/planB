package com.bmc.ai.model;

import java.util.List;

/** 경쟁 서비스 비교 분석 결과 (기능명세서 S-002). */
public record CompetitorAnalysis(List<CompetitorComparison> competitors) {

    public record CompetitorComparison(
            String serviceName,
            String category,
            String targetCustomer,    // 타겟 고객
            String revenueModel,      // 수익 모델
            String coreFeatures,      // 핵심 기능
            String differentiation    // 사용자 아이디어 대비 차별화 포인트
    ) {}
}
