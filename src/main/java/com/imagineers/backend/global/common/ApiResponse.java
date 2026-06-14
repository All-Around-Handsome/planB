package com.imagineers.backend.global.common;

import com.imagineers.backend.global.exception.ErrorCode;
import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private final boolean success; // 성공 여부
    private final T data;          // 성공 시 반환할 데이터
    private final ErrorInfo error; // 실패 시 반환할 에러 정보

    // 성공 응답 생성자
    private ApiResponse(T data) {
        this.success = true;
        this.data = data;
        this.error = null;
    }

    // 실패 응답 생성자
    private ApiResponse(ErrorCode errorCode) {
        this.success = false;
        this.data = null;
        this.error = new ErrorInfo(errorCode.getCode(), errorCode.getMessage());
    }

    // 성공 응답 반환 메서드
    // 사용 예: return ApiResponse.success(bmcRecord);
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data);
    }

    // 실패 응답 반환 메서드
    // 사용 예: return ApiResponse.fail(ErrorCode.NOT_FOUND);
    public static <T> ApiResponse<T> fail(ErrorCode errorCode) {
        return new ApiResponse<>(errorCode);
    }

    // 에러 정보를 담는 내부 클래스
    @Getter
    public static class ErrorInfo {
        private final String code;    // 에러 코드 (예: "NOT_FOUND")
        private final String message; // 에러 메시지 (예: "존재하지 않는 리소스입니다.")

        public ErrorInfo(String code, String message) {
            this.code = code;
            this.message = message;
        }
    }
}