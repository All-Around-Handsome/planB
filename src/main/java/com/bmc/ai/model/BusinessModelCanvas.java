package com.bmc.ai.model;

/**
 * BMC 9항목 (기능명세서 G-001).
 * LangChain4j AiServices 가 이 record 의 JSON 스키마를 만들어 Claude 응답을 자동 파싱한다.
 */
public record BusinessModelCanvas(
        String valueProposition,      // ① 가치 제안
        String customerSegments,      // ② 고객 세그먼트
        String revenueStreams,        // ③ 수익 구조
        String costStructure,         // ④ 비용 구조
        String keyPartners,           // ⑤ 핵심 파트너
        String keyActivities,         // ⑥ 핵심 활동
        String keyResources,          // ⑦ 핵심 자원
        String channels,              // ⑧ 채널
        String customerRelationships  // ⑨ 고객 관계
) {
    public String toPromptText() {
        return """
                가치 제안: %s
                고객 세그먼트: %s
                수익 구조: %s
                비용 구조: %s
                핵심 파트너: %s
                핵심 활동: %s
                핵심 자원: %s
                채널: %s
                고객 관계: %s""".formatted(
                valueProposition, customerSegments, revenueStreams, costStructure,
                keyPartners, keyActivities, keyResources, channels, customerRelationships);
    }
}
