package com.bmc.ai.controller;

import com.bmc.ai.dto.BmcGenerationRequest;
import com.bmc.ai.dto.IdeaRequest;
import com.bmc.ai.dto.IngestRequest;
import com.bmc.ai.model.BmcAnalysisResult;
import com.bmc.ai.model.BusinessModelCanvas;
import com.bmc.ai.model.CompetitorAnalysis;
import com.bmc.ai.service.BmcAnalysisService;
import com.bmc.ai.service.BmcGenerationService;
import com.bmc.ai.service.CompetitorIngestionService;
import com.bmc.ai.service.CompetitorSearchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 메인 Spring 백엔드가 REST(AI 호출)로 사용하는 엔드포인트.
 * 일일 생성/분석 횟수 제한(L-001/L-002)은 메인 백엔드 책임 -> 여기서는 순수 AI 처리만.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final CompetitorSearchService competitorSearchService;
    private final BmcGenerationService bmcGenerationService;
    private final BmcAnalysisService bmcAnalysisService;
    private final CompetitorIngestionService ingestionService;

    public AiController(CompetitorSearchService competitorSearchService,
                        BmcGenerationService bmcGenerationService,
                        BmcAnalysisService bmcAnalysisService,
                        CompetitorIngestionService ingestionService) {
        this.competitorSearchService = competitorSearchService;
        this.bmcGenerationService = bmcGenerationService;
        this.bmcAnalysisService = bmcAnalysisService;
        this.ingestionService = ingestionService;
    }

    /** S-001 + S-002: 유사 경쟁 서비스 탐색 및 비교 분석. */
    @PostMapping("/competitors")
    public CompetitorAnalysis searchCompetitors(@Valid @RequestBody IdeaRequest req) {
        return competitorSearchService.searchAndAnalyze(req.idea());
    }

    /** G-001: BMC 9항목 자동 생성. */
    @PostMapping("/bmc/generate")
    public BusinessModelCanvas generateBmc(@Valid @RequestBody BmcGenerationRequest req) {
        return bmcGenerationService.generate(req.idea(), req.stage(), req.useCompetitorContext());
    }

    /** N-011/012/013: 사용자가 직접 입력한 BMC 분석. */
    @PostMapping("/bmc/analyze")
    public BmcAnalysisResult analyzeBmc(@Valid @RequestBody BusinessModelCanvas bmc) {
        return bmcAnalysisService.analyze(bmc);
    }

    /** 관리용: 경쟁 서비스 데이터 Qdrant 적재. */
    @PostMapping("/competitors/ingest")
    public Map<String, Object> ingest(@RequestBody IngestRequest req) {
        int count = ingestionService.ingest(req.services());
        return Map.of("ingested", count);
    }
}
