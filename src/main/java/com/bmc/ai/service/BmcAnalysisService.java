package com.bmc.ai.service;

import com.bmc.ai.ai.BmcAnalyzer;
import com.bmc.ai.model.BmcAnalysisResult;
import com.bmc.ai.model.BusinessModelCanvas;
import org.springframework.stereotype.Service;

/** N-011/012/013: 사용자가 직접 입력한 BMC 분석. */
@Service
public class BmcAnalysisService {

    private final BmcAnalyzer analyzer;

    public BmcAnalysisService(BmcAnalyzer analyzer) {
        this.analyzer = analyzer;
    }

    public BmcAnalysisResult analyze(BusinessModelCanvas bmc) {
        return analyzer.analyze(bmc.toPromptText());
    }
}
