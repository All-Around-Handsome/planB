package com.bmc.ai.service;

import com.bmc.ai.ai.IdeaTitler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** 아이디어 제목 자동 생성. 모델 호출이 실패하면 아이디어 앞부분을 제목으로 쓴다. */
@Service
public class IdeaTitleService {

    private static final Logger log = LoggerFactory.getLogger(IdeaTitleService.class);

    static final int MAX_TITLE_LENGTH = 30;
    static final int FALLBACK_LENGTH = 20;

    private final IdeaTitler titler;

    public IdeaTitleService(IdeaTitler titler) {
        this.titler = titler;
    }

    public String suggest(String idea) {
        try {
            String title = clean(titler.title(idea));
            if (!title.isEmpty()) {
                return title;
            }
        } catch (RuntimeException e) {
            log.warn("제목 생성 실패, 아이디어 앞부분으로 대체: {}", e.getMessage());
        }
        return fallback(idea);
    }

    /** 모델이 붙이는 따옴표, 줄바꿈, 마침표를 걷어내고 길이를 제한한다. */
    static String clean(String raw) {
        if (raw == null) {
            return "";
        }
        String line = raw.strip().lines().findFirst().orElse("")
                .replaceAll("^[\"'“”‘’「」\\s]+|[\"'“”‘’「」.\\s]+$", "")
                .replaceFirst("^제목\\s*[:：]\\s*", "")
                .strip();
        return line.length() > MAX_TITLE_LENGTH ? line.substring(0, MAX_TITLE_LENGTH).strip() : line;
    }

    static String fallback(String idea) {
        String firstLine = idea.strip().lines().findFirst().orElse("").strip();
        return firstLine.length() > FALLBACK_LENGTH
                ? firstLine.substring(0, FALLBACK_LENGTH).strip() + "…"
                : firstLine;
    }
}
