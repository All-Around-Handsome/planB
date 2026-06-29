package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.global.enums.ItemType;

// BMC 항목 하나 (프론트가 보내는 9개 중 하나)
public record BmcItemRequest(
        ItemType itemType,  // 9가지 항목 구분 (VALUE_PROPOSITION 등)
        String content      // 항목 내용
) {
}