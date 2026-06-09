package com.bmc.ai.ai;

import com.bmc.ai.model.CompetitorAnalysis;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/** S-002: 벡터 검색으로 찾은 경쟁 서비스와 사용자 아이디어를 비교 분석. */
public interface CompetitorAnalyzer {

    @SystemMessage("""
            당신은 시장/경쟁 분석 전문가입니다.
            사용자의 아이디어와, RAG 로 탐색된 유사 경쟁 서비스 목록을 비교 분석하세요.
            각 경쟁 서비스마다 타겟 고객, 수익 모델, 핵심 기능, 그리고
            '사용자 아이디어 대비 차별화 포인트'를 한국어로 정리합니다.
            제공된 경쟁 서비스 정보에 근거해 작성하고, 임의로 새 서비스를 지어내지 마세요.
            """)
    @UserMessage("""
            [사용자 아이디어]
            {{idea}}

            [RAG 로 탐색된 경쟁 서비스 목록]
            {{competitors}}
            """)
    CompetitorAnalysis analyze(@V("idea") String idea, @V("competitors") String competitors);
}
