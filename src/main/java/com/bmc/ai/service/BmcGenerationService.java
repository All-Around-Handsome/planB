package com.bmc.ai.service;

import com.bmc.ai.ai.BmcGenerator;
import com.bmc.ai.model.BusinessModelCanvas;
import com.bmc.ai.model.CompetitorAnalysis;
import com.bmc.ai.model.CompetitorAnalysis.CompetitorComparison;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * G-001: BMC 자동 생성.
 * 경쟁 탐색(S)을 거쳐 왔다면 그 컨텍스트를 활용하고, 스킵했다면 컨텍스트 없이 생성.
 */
@Service
public class BmcGenerationService {

    private final BmcGenerator generator;
    private final CompetitorSearchService competitorSearch;

    public BmcGenerationService(BmcGenerator generator, CompetitorSearchService competitorSearch) {
        this.generator = generator;
        this.competitorSearch = competitorSearch;
    }

    public BusinessModelCanvas generate(String idea, String stage, boolean useCompetitorContext,
                                        List<CompetitorComparison> knownCompetitors) {
        String context = "";
        if (useCompetitorContext) {
            // 경쟁 탐색 화면에서 받은 결과가 있으면 그대로 쓰고, 없으면 새로 찾는다
            context = (knownCompetitors != null && !knownCompetitors.isEmpty())
                    ? CompetitorSearchService.toContext(new CompetitorAnalysis(knownCompetitors))
                    : competitorSearch.buildContext(idea);
        }
        if (context.isBlank()) {
            context = "(제공된 경쟁 서비스 정보 없음)";
        }
        return generator.generate(idea, stage, context);
    }
}
