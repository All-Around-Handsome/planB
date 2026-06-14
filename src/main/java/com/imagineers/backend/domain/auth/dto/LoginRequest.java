package com.imagineers.backend.domain.auth.dto;

// 프론트 → 백엔드로 들어오는 요청 그릇. 카카오에게 받은 인가 코드(code)를 담는다.
public record LoginRequest(String code) {

}