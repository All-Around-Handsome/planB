package com.bmc.ai.model;

import java.util.List;

/** BMC 분석 결과 (기능명세서 N-011 / N-012 / N-013). */
public record BmcAnalysisResult(
        int viabilityScore,           // 1~10. (프론트 색상: 1~3 빨강, 4~6 주황, 7~10 녹색)
        String scoreRationale,        // 점수 산출 근거
        List<Risk> risks,             // 최소 3개
        List<ActionItem> actionItems  // 최소 3개
) {
    public record Risk(String risk, String mitigation) {}

    /** term: 단기 / 중기 / 장기 */
    public record ActionItem(String term, String action) {}
}
