package com.imagineers.backend.domain.bmc.dto;

import com.imagineers.backend.global.enums.TermType;

// 액션 하나 (내용 + 기간타입)
public record BmcActionRequest(
        String actionContent,  // 액션 내용
        TermType termType      // SHORT / MID / LONG (단기/중기/장기)
) {
}