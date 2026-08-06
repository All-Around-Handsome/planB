# planB - Backend

AI 기반 비즈니스 모델 캔버스(BMC) 생성 서비스의 백엔드입니다.

## 기술 스택

- Java 21
- Spring Boot 3.5.14
- Spring Security 6 + JWT
- Spring Data JPA
- MySQL 8
- Gradle

## 주요 기능

- 소셜 로그인 (카카오 / 구글) + JWT 인증
- 일일 사용 횟수 제한 (생성/분석 각 5회)
- BMC 저장 (AI 생성 / 직접 분석)
- BMC 삭제 및 항목 수정

## 사전 준비

- JDK 21 설치
- MySQL 8 설치 및 실행
- `imagineers` 데이터베이스 생성
```sql
  CREATE DATABASE imagineers;
```

## 실행 방법

1. `application.yml` 설정 (아래 "환경 설정" 참고)
2. 프로젝트 실행
    - IntelliJ에서 `BackendApplication` 실행
    - 또는 터미널에서:
```bash
     ./gradlew bootRun
```
3. 서버 주소: `http://localhost:8080`

## 환경 설정

`src/main/resources/application.yml` 파일이 필요합니다.
보안을 위해 이 파일은 Git에 포함되지 않으며(`.gitignore`),
`application.yml.example`을 참고해 직접 작성해야 합니다.

설정에 필요한 값:
- MySQL 접속 정보 (URL, username, password)
- JWT secret 및 만료 시간
- 카카오 / 구글 OAuth 키 (client-id, redirect-uri 등)

## API 문서

프론트엔드 연동을 위한 API 명세는 [API.md](./API.md)를 참고하세요.

## 브랜치 전략

- `main` ← `develop` ← `backend` / `frontend` / `ai`
- `main`에 직접 push 하지 않습니다.