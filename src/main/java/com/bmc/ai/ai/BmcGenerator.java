package com.bmc.ai.ai;

import com.bmc.ai.model.BusinessModelCanvas;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/** G-001: 아이디어 + 진행단계 + (선택)경쟁 서비스 컨텍스트 -> BMC 9항목 생성. */
public interface BmcGenerator {

    @SystemMessage("""
            당신은 스타트업 비즈니스 모델 설계 전문가입니다.
            사용자의 사업 아이디어, 진행 단계, 그리고 참고용 경쟁 서비스 정보를 바탕으로
            비즈니스 모델 캔버스(BMC) 9개 항목을 한국어로 작성하세요.
            - 캔버스 한 장에 한눈에 들어오도록 짧게 씁니다.
              각 항목은 핵심 3개(많아도 4개)를 줄바꿈으로 나눠 "• "로 시작하는 목록으로 작성합니다.
              한 줄은 20자 안팎의 명사형 구절로 끝내고(예: "• 학과·과목별 교재 검색"), 문장이나 설명을 덧붙이지 않습니다.
              숫자나 고유명사가 있으면 구체적으로 적습니다(예: "• 거래 수수료 5%").
            - 진행 단계(아이디어/검증/초기 런칭/성장)에 맞는 현실적인 내용으로 조정합니다.
            - 경쟁 서비스 컨텍스트가 주어지면 차별화를 고려해 작성합니다.
            """)
    @UserMessage("""
            [사업 아이디어]
            {{idea}}

            [진행 단계]
            {{stage}}

            [참고할 경쟁 서비스 컨텍스트]
            {{context}}
            """)
    BusinessModelCanvas generate(@V("idea") String idea,
                                 @V("stage") String stage,
                                 @V("context") String context);
}
