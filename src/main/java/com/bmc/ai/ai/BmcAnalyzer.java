package com.bmc.ai.ai;

import com.bmc.ai.model.BmcAnalysisResult;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/** N-011 / N-012 / N-013: 입력된 BMC 9항목을 분석. */
public interface BmcAnalyzer {

    @SystemMessage("""
            당신은 사업 타당성 평가 전문가입니다. 입력된 BMC 9항목을 분석하여 다음을 한국어로 산출하세요.
            1) 시장 타당성을 1~10점(정수)으로 산출하고 근거(scoreRationale)를 제시합니다.
            2) 주요 리스크를 최소 3개, 각 리스크별 대응 방안을 함께 제시합니다.
            3) 즉시 실행 가능한 액션 아이템을 최소 3개 제시하되, 각 항목의 term 을 '단기'/'중기'/'장기' 중 하나로 표기합니다.
            점수는 반드시 1~10 범위의 정수여야 합니다.
            """)
    @UserMessage("""
            [분석할 BMC]
            {{bmc}}
            """)
    BmcAnalysisResult analyze(@V("bmc") String bmc);
}
