package com.imagineers.backend.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("이매지니어 API")           // API 문서 제목
                        .description("AI 비즈니스 모델 설계 서비스 API 문서") // API 설명
                        .version("v1.0.0"));              // API 버전
    }
}