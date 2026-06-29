package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.global.enums.BmcType;
import com.imagineers.backend.global.enums.Stage;
import java.util.List;

// 프론트 → 백엔드로 들어오는 BMC 저장 요청
public record BmcCreateRequest(
        String ideaText,            // 아이디어 원문
        Stage stage,                // 진행 단계 (IDEA/VALIDATION/LAUNCH/GROWTH)
        BmcType bmcType,            // AI_GENERATED / DIRECT_ANALYSIS
        List<BmcItemRequest> items  // 9개 항목 목록
) {
}