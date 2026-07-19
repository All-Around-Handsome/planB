package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.domain.bmc.entity.BmcRisk;

// 상세 조회 시 리스크 하나
public record BmcRiskResponse(
        Long riskId,
        String riskContent,
        String responseContent,
        Integer orderIndex
) {
    public static BmcRiskResponse from(BmcRisk risk) {
        return new BmcRiskResponse(
                risk.getId(),
                risk.getRiskContent(),
                risk.getResponseContent(),
                risk.getOrderIndex()
        );
    }
}