package com.imagineers.backend.domain.bmc.dto;

// BMC 항목 수정 요청 (내용/메모, 둘 다 선택적)
public record BmcItemUpdateRequest(
        String content,  // 새 내용 (안 바꾸려면 생략 가능)
        String memo      // 새 메모 (안 바꾸려면 생략 가능)
) {
}