package com.imagineers.backend.domain.bmc.controller;

import com.imagineers.backend.domain.bmc.dto.BmcCreateRequest;
import com.imagineers.backend.domain.bmc.service.BmcService;
import com.imagineers.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * BMC 관련 API 입구.
 */
@RestController
@RequestMapping("/api/bmc")
@RequiredArgsConstructor
public class BmcController {

    private final BmcService bmcService;

    /**
     * BMC 생성 결과 저장 (G-004)
     * 로그인 필요 (Authorization 헤더에 JWT)
     */
    @PostMapping  // 최종 주소: POST /api/bmc
    public ApiResponse<Map<String, Long>> saveBmc(
            @AuthenticationPrincipal Long userId,
            @RequestBody BmcCreateRequest request
    ) {
        Long bmcRecordId = bmcService.saveBmc(userId, request);
        // 응답: { "bmcRecordId": 1 } 형태로 반환
        return ApiResponse.success(Map.of("bmcRecordId", bmcRecordId));
    }
}