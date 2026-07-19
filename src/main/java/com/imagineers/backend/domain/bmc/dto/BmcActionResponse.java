package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.domain.bmc.entity.BmcAction;
import com.imagineers.backend.global.enums.TermType;

// 상세 조회 시 액션 하나
public record BmcActionResponse(
        Long actionId,
        String actionContent,
        TermType termType,
        Integer orderIndex
) {
    public static BmcActionResponse from(BmcAction action) {
        return new BmcActionResponse(
                action.getId(),
                action.getActionContent(),
                action.getTermType(),
                action.getOrderIndex()
        );
    }
}