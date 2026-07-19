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
import com.imagineers.backend.domain.bmc.dto.BmcListResponse;
import com.imagineers.backend.domain.bmc.dto.BmcDetailResponse;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import com.imagineers.backend.domain.limit.dto.LimitCheckResponse;
import com.imagineers.backend.domain.limit.service.LimitService;

/**
 * BMC 관련 API 입구.
 */
@RestController
@RequestMapping("/api/bmc")
@RequiredArgsConstructor
public class BmcController {

    private final BmcService bmcService;
    private final LimitService limitService;

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

    /**
     * 내 BMC 목록 조회 (P-001)
     * 로그인 필요. 본인이 저장한 BMC들을 최신순으로 반환.
     * 주소: GET /api/bmc
     */
    @GetMapping  // 최종 주소: GET /api/bmc
    public ApiResponse<List<BmcListResponse>> getMyBmcList(
            @AuthenticationPrincipal Long userId
    ) {
        List<BmcListResponse> list = bmcService.getMyBmcList(userId);
        return ApiResponse.success(list);
    }

    /**
     * BMC 상세 조회 (P-002)
     * 로그인 필요. 본인 소유만 조회 가능.
     * 주소 예: GET /api/bmc/3  → 3번 BMC 전체 내용
     */
    @GetMapping("/{bmcRecordId}")  // 최종 주소: GET /api/bmc/{id}
    public ApiResponse<BmcDetailResponse> getBmcDetail(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long bmcRecordId
    ) {
        BmcDetailResponse detail = bmcService.getBmcDetail(userId, bmcRecordId);
        return ApiResponse.success(detail);
    }

    /**
     * AI 생성 가능 여부 확인 (횟수 체크)
     * 프론트가 AI 호출 "전에" 부른다. 통과하면 카운트가 1 올라간다.
     * 주소: POST /api/bmc/check-generation
     */
    @PostMapping("/check-generation")
    public ApiResponse<LimitCheckResponse> checkGeneration(
            @AuthenticationPrincipal Long userId
    ) {
        LimitCheckResponse result = limitService.tryConsumeGeneration(userId);
        return ApiResponse.success(result);
    }

    /**
     * 직접 분석 가능 여부 확인 (횟수 체크)
     * 주소: POST /api/bmc/check-analysis
     */
    @PostMapping("/check-analysis")
    public ApiResponse<LimitCheckResponse> checkAnalysis(
            @AuthenticationPrincipal Long userId
    ) {
        LimitCheckResponse result = limitService.tryConsumeAnalysis(userId);
        return ApiResponse.success(result);
    }
}