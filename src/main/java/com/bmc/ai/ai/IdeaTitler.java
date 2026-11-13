package com.bmc.ai.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/** 사용자가 제목을 비워 두었을 때 아이디어 내용으로 짧은 제목을 짓는다. */
public interface IdeaTitler {

    @SystemMessage("""
            사용자의 사업 아이디어를 읽고 목록에 표시할 짧은 한국어 제목을 하나 지으세요.
            - 15자 안팎의 명사형 제목 (예: 캠퍼스 중고 전공책 거래 앱)
            - 따옴표, 마침표, 이모지, 설명 없이 제목만 출력
            """)
    @UserMessage("{{idea}}")
    String title(@V("idea") String idea);
}
