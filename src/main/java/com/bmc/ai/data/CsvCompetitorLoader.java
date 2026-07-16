package com.bmc.ai.data;

import com.bmc.ai.model.CompetitorService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * yc_s2024.csv (허깅페이스 YC S2024 배치 데이터셋)를 읽어
 * CompetitorService 리스트로 변환한다.
 *
 * CSV 컬럼: company, headquarters, founders, description, sector, website, demo, contact
 * CompetitorService 필드: name, category, coreFeatures, targetCustomer, revenueModel, description
 *
 * 주의: 데이터셋에 coreFeatures / targetCustomer / revenueModel 에 해당하는 원본 컬럼이 없어서
 * 빈 문자열로 채운다. 검색 매칭은 name/category/description 텍스트가 임베딩에 실제로 반영되므로
 * 크게 문제되지 않지만, 비교 분석(CompetitorSearchService#toContext)에서 이 세 필드를 그대로
 * 프롬프트에 노출하므로 "정보 없음"으로 보일 수 있다. 필요하면 description 을 LLM으로 파싱해
 * 세 필드를 보강하는 후처리를 추가하는 걸 추천한다.
 */
@Component
public class CsvCompetitorLoader {

    private static final String CLASSPATH_LOCATION = "data/yc_s2024.csv";

    /** 기본 위치(src/main/resources/data/yc_s2024.csv, 즉 classpath)에서 로드 */
    public List<CompetitorService> loadFromClasspath() throws IOException {
        try (InputStream is = new ClassPathResource(CLASSPATH_LOCATION).getInputStream()) {
            return parse(is);
        }
    }

    /** 임의 경로의 CSV를 로드하고 싶을 때 사용 (예: 다른 데이터셋으로 교체 테스트) */
    public List<CompetitorService> loadFromPath(String absolutePath) throws IOException {
        try (InputStream is = new java.io.FileInputStream(absolutePath)) {
            return parse(is);
        }
    }

    private List<CompetitorService> parse(InputStream is) throws IOException {
        List<CompetitorService> result = new ArrayList<>();

        // CSVFormat.DEFAULT.withFirstRecordAsHeader(): 헤더 자동 인식, 따옴표 안의 콤마도 안전하게 처리
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreSurroundingSpaces(true)
                .build();

        // 허깅페이스/엑셀 CSV는 앞에 UTF-8 BOM(EF BB BF)이 붙어 있는 경우가 많다.
        // BOM을 안 걷어내면 첫 헤더가 "company"가 아니라 "\uFEFFcompany"로 인식되어 매핑이 깨진다.
        // (별도 의존성 추가 없이 PushbackInputStream으로 직접 처리)
        InputStream bomSafeStream = stripUtf8Bom(is);

        try (Reader reader = new InputStreamReader(bomSafeStream, StandardCharsets.UTF_8);
             CSVParser parser = new CSVParser(reader, format)) {

            for (CSVRecord record : parser) {
                String company = get(record, "company");
                if (company.isBlank()) {
                    continue; // company 명이 없는 빈 행은 스킵
                }

                result.add(new CompetitorService(
                        company,
                        get(record, "sector"),          // category
                        "",                              // coreFeatures - 원본 데이터에 없음
                        "",                               // targetCustomer - 원본 데이터에 없음
                        "",                               // revenueModel - 원본 데이터에 없음
                        get(record, "description")
                ));
            }
        }
        return result;
    }

    private String get(CSVRecord record, String column) {
        return record.isMapped(column) ? record.get(column).trim() : "";
    }

    /** 스트림 맨 앞의 UTF-8 BOM(EF BB BF) 3바이트가 있으면 제거하고, 없으면 그대로 되돌려 놓는다. */
    private InputStream stripUtf8Bom(InputStream is) throws IOException {
        java.io.PushbackInputStream pb = new java.io.PushbackInputStream(is, 3);
        byte[] bom = new byte[3];
        int read = pb.read(bom, 0, 3);
        if (read == 3 && (bom[0] & 0xFF) == 0xEF && (bom[1] & 0xFF) == 0xBB && (bom[2] & 0xFF) == 0xBF) {
            return pb; // BOM 소비 완료, 되돌리지 않음
        }
        if (read > 0) {
            pb.unread(bom, 0, read); // BOM이 아니면 읽은 바이트 되돌리기
        }
        return pb;
    }
}
