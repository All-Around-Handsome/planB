package com.imagineers.backend.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // 400 - 잘못된 요청
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "요청 파라미터 오류입니다."),

    // 401 - 인증 오류
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증 토큰이 없거나 만료되었습니다."),

    // 403 - 권한 오류
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인 소유가 아닌 리소스에 접근할 수 없습니다."),

    // 404 - 리소스 없음
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "존재하지 않는 리소스입니다."),

    // 429 - 횟수 초과
    LIMIT_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "LIMIT_EXCEEDED", "오늘의 생성 횟수를 모두 사용하였습니다."),

    // 500 - 서버 오류
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus httpStatus;  // HTTP 상태코드 (400, 401 등)
    private final String code;            // 에러 코드 문자열
    private final String message;         // 에러 메시지

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}