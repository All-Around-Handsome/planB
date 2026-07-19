package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.domain.bmc.entity.BmcItem;
import com.imagineers.backend.global.enums.ItemType;

// 상세 조회 시 항목 하나
public record BmcItemResponse(
        Long itemId,
        ItemType itemType,
        String content,
        String memo
) {
    public static BmcItemResponse from(BmcItem item) {
        return new BmcItemResponse(
                item.getId(),
                item.getItemType(),
                item.getContent(),
                item.getMemo()
        );
    }
}