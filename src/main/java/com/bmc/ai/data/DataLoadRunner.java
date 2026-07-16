package com.bmc.ai.data;

import com.bmc.ai.model.CompetitorService;
import com.bmc.ai.service.CompetitorIngestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 앱 기동 시 yc_s2024.csv 를 읽어 Qdrant 컬렉션(competitor_services)에 적재한다.
 *
 * 기본적으로 비활성화되어 있음 (매 기동마다 중복 적재되는 걸 방지하기 위함).
 * 아래처럼 명시적으로 켰을 때만 동작:
 *
 *   ./gradlew bootRun --args='--app.load-data=true'
 *   또는
 *   java -jar app.jar --app.load-data=true
 *
 * 재적재가 필요하면(데이터 갱신 등) 먼저 Qdrant 컬렉션을 비우고 다시 실행하는 걸 권장.
 * (Qdrant는 동일 id 재삽입 시 upsert 되지만, 여기서는 id를 지정하지 않으므로
 *  다시 실행하면 중복 적재된다 — 운영에서는 point id를 company 명 해시 등으로 고정하는 걸 고려)
 */
@Component
@ConditionalOnProperty(name = "app.load-data", havingValue = "true")
public class DataLoadRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoadRunner.class);

    private final CsvCompetitorLoader loader;
    private final CompetitorIngestionService ingestionService;

    public DataLoadRunner(CsvCompetitorLoader loader, CompetitorIngestionService ingestionService) {
        this.loader = loader;
        this.ingestionService = ingestionService;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("yc_s2024.csv 로드 및 Qdrant 적재를 시작합니다...");

        List<CompetitorService> services = loader.loadFromClasspath();
        log.info("{}개 회사 파싱 완료. 임베딩 생성 및 적재 중...", services.size());

        int ingested = ingestionService.ingest(services);
        log.info("적재 완료: {}건", ingested);
    }
}
