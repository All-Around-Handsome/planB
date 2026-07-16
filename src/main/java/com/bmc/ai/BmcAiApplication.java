package com.bmc.ai;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BmcAiApplication {
    public static void main(String[] args) {
        // Spring 시작 전에 .env 파일을 읽어서 시스템 환경변수로 주입
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()  // .env 없어도 에러 없이 진행 (배포 환경 대비)
                .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(BmcAiApplication.class, args);
    }
}