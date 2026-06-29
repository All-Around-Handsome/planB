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
import com.imagineers.backend.domain.bmc.dto.BmcAnalysisRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.imagineers.backend.domain.bmc.dto.BmcItemUpdateRequest;
import org.springframework.web.bind.annotation.PatchMapping;

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

    /**
     * BMC 분석 결과 저장 (N-014)
     * 로그인 필요
     */
    @PostMapping("/analysis")  // 최종 주소: POST /api/bmc/analysis
    public ApiResponse<Map<String, Long>> saveAnalysis(
            @AuthenticationPrincipal Long userId,
            @RequestBody BmcAnalysisRequest request
    ) {
        Long bmcRecordId = bmcService.saveAnalysis(userId, request);
        return ApiResponse.success(Map.of("bmcRecordId", bmcRecordId));
    }

    /**
     * BMC 삭제 (P-003)
     * 로그인 필요. 본인 소유만 삭제 가능.
     * 주소 예: DELETE /api/bmc/3  → 3번 BMC 삭제
     */
    @DeleteMapping("/{bmcRecordId}")
    public ApiResponse<Void> deleteBmc(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long bmcRecordId
    ) {
        bmcService.deleteBmc(userId, bmcRecordId);
        return ApiResponse.success(null);  // 성공 시 data는 비움
    }

    /**
     * BMC 항목 수정 (B-003)
     * 로그인 필요. 본인 소유만 수정 가능.
     * 주소 예: PATCH /api/bmc/items/5  → 5번 항목 수정
     */
    @PatchMapping("/items/{itemId}")
    public ApiResponse<Void> updateItem(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long itemId,
            @RequestBody BmcItemUpdateRequest request
    ) {
        bmcService.updateItem(userId, itemId, request.content(), request.memo());
        return ApiResponse.success(null);
    }
}