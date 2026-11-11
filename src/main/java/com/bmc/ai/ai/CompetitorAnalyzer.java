package com.bmc.ai.ai;

import com.bmc.ai.model.CompetitorAnalysis;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/** S-002: 사용자 아이디어와 유사 경쟁 서비스를 비교 분석. */
public interface CompetitorAnalyzer {

    /** 벡터 검색으로 찾은 경쟁 서비스 목록이 있을 때. */
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

    /** 검색 데이터가 없을 때: 모델이 알고 있는 실제 서비스로 비교 분석. */
    @SystemMessage("""
            당신은 시장/경쟁 분석 전문가입니다.
            사용자의 아이디어와 비슷한 문제를 풀고 있는 '실제로 운영 중인' 서비스를 3~5개 찾아 비교 분석하세요.
            - 한국에서 쓸 수 있는 서비스를 우선하고, 대표적인 해외 서비스도 포함할 수 있습니다.
            - 이름과 존재를 확실히 아는 서비스만 고르세요. 확신이 없으면 개수를 줄이고, 절대 지어내지 마세요.
            - 정확히 같은 서비스가 없으면 같은 고객의 같은 문제를 다른 방식으로 푸는 대체재를 고르세요.
            각 서비스마다 serviceName(서비스 이름), category(분야), 타겟 고객, 수익 모델, 핵심 기능,
            '사용자 아이디어 대비 차별화 포인트'를 한국어로 간결하게(각 1~2문장) 정리합니다.
            """)
    @UserMessage("""
            [사용자 아이디어]
            {{idea}}
            """)
    CompetitorAnalysis discover(@V("idea") String idea);
}
