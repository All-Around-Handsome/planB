package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.domain.bmc.entity.BmcRecord;
import com.imagineers.backend.global.enums.BmcType;
import com.imagineers.backend.global.enums.Stage;
import java.time.LocalDateTime;

/**
 * BMC 목록 조회 응답 (P-001) - 간략 정보만.
 * 마이페이지에서 "내 BMC 목록"을 뿌릴 때 사용.
 */
public record BmcListResponse(
        Long bmcRecordId,
        String ideaText,       // 아이디어 (목록에 제목처럼 표시)
        Stage stage,
        BmcType bmcType,
        Integer validityScore, // 직접분석이면 점수, AI생성이면 null
        LocalDateTime createdAt
) {
    // 엔티티(BmcRecord) → DTO 변환
    public static BmcListResponse from(BmcRecord record) {
        return new BmcListResponse(
                record.getId(),
                record.getIdeaText(),
                record.getStage(),
                record.getBmcType(),
                record.getValidityScore(),
                record.getCreatedAt()
        );
    }
}