package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.domain.bmc.entity.BmcRecord;
import com.imagineers.backend.global.enums.BmcType;
import com.imagineers.backend.global.enums.Stage;
import java.time.LocalDateTime;
import java.util.List;

/**
 * BMC 상세 조회 응답 (P-002) - 전체 내용.
 * 아이디어 + 9개 항목 + 리스크 + 액션을 한 번에 담는다.
 */
public record BmcDetailResponse(
        Long bmcRecordId,
        String ideaText,
        Stage stage,
        BmcType bmcType,
        Integer validityScore,
        String scoreReason,
        LocalDateTime createdAt,
        List<BmcItemResponse> items,     // 9개 항목
        List<BmcRiskResponse> risks,     // 리스크 (분석이면 있음)
        List<BmcActionResponse> actions  // 액션 (분석이면 있음)
) {
    // 엔티티(BmcRecord) → DTO 변환. 자식들도 각각 변환해서 담는다.
    public static BmcDetailResponse from(BmcRecord record) {
        return new BmcDetailResponse(
                record.getId(),
                record.getIdeaText(),
                record.getStage(),
                record.getBmcType(),
                record.getValidityScore(),
                record.getScoreReason(),
                record.getCreatedAt(),
                record.getItems().stream().map(BmcItemResponse::from).toList(),
                record.getRisks().stream().map(BmcRiskResponse::from).toList(),
                record.getActions().stream().map(BmcActionResponse::from).toList()
        );
    }
}