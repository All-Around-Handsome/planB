package com.bmc.ai.service;

import com.bmc.ai.ai.BmcGenerator;
import com.bmc.ai.model.BusinessModelCanvas;
import org.springframework.stereotype.Service;

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

    public BusinessModelCanvas generate(String idea, String stage, boolean useCompetitorContext) {
        String context = "(제공된 경쟁 서비스 정보 없음)";
        if (useCompetitorContext) {
            var matches = competitorSearch.retrieveSimilar(idea);
            if (!matches.isEmpty()) {
                context = competitorSearch.toContext(matches);
            }
        }
        return generator.generate(idea, stage, context);
    }
}
