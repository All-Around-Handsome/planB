package com.bmc.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 경쟁 탐색 요청 (S-001/S-002). */
public record IdeaRequest(
        @NotBlank @Size(min = 10, message = "아이디어는 최소 10자 이상") String idea
) {}
