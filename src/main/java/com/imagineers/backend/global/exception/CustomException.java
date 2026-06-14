package com.imagineers.backend.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;

    // ErrorCode를 받아서 예외를 생성
    // 예: throw new CustomException(ErrorCode.NOT_FOUND)
    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage()); // 부모 클래스에 에러 메시지 전달
        this.errorCode = errorCode;
    }
}