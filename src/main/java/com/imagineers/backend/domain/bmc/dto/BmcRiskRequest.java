package com.imagineers.backend.domain.bmc.dto;

// 리스크 하나 (내용 + 대응방안)
public record BmcRiskRequest(
        String riskContent,      // 리스크 내용
        String responseContent   // 대응 방안
) {
}