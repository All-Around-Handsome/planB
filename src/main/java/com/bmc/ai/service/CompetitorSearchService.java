package com.bmc.ai.service;

import com.bmc.ai.ai.CompetitorAnalyzer;
import com.bmc.ai.model.CompetitorAnalysis;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * S-001(유사 서비스 자동 탐색) + S-002(비교 분석).
 * 흐름: 아이디어 임베딩 -> Qdrant 벡터 검색 -> 검색 결과를 컨텍스트로 Claude 비교 분석.
 */
@Service
public class CompetitorSearchService {

    private static final Logger log = LoggerFactory.getLogger(CompetitorSearchService.class);

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final CompetitorAnalyzer analyzer;

    @Value("${rag.top-k}")    private int topK;
    @Value("${rag.min-score}") private double minScore;

    public CompetitorSearchService(EmbeddingModel embeddingModel,
                                   EmbeddingStore<TextSegment> embeddingStore,
                                   CompetitorAnalyzer analyzer) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
        this.analyzer = analyzer;
    }

    /** 벡터 검색만 수행해 매칭된 경쟁 서비스 세그먼트를 반환 (BMC 생성 컨텍스트로도 재사용). */
    public List<EmbeddingMatch<TextSegment>> retrieveSimilar(String idea) {
        Embedding query = embeddingModel.embed(idea).content();
        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                .queryEmbedding(query)
                .maxResults(topK)
                .minScore(minScore)
                .build();
        List<EmbeddingMatch<TextSegment>> matches = embeddingStore.search(request).matches();

        // 실제 유사도 점수 확인용 임시 로그. rag.min-score 튜닝 끝나면 지워도 되고 남겨둬도 무방함
        // (호출량 많아지면 로그 레벨을 debug로 낮추는 걸 권장).
        /*
        log.info("query=[{}] min-score={} matched={}", idea, minScore, matches.size());
        for (EmbeddingMatch<TextSegment> m : matches) {
            String name = m.embedded().metadata().getString("name");
            log.info("  - {} (score={})", name, String.format("%.4f", m.score()));
        }
         */

        return matches;
    }

    /** S-001 + S-002: 검색 후 Claude 비교 분석까지. */
    public CompetitorAnalysis searchAndAnalyze(String idea) {
        List<EmbeddingMatch<TextSegment>> matches = retrieveSimilar(idea);
        if (matches.isEmpty()) {
            return new CompetitorAnalysis(List.of());
        }
        String competitorsContext = toContext(matches);
        return analyzer.analyze(idea, competitorsContext);
    }

    /** 검색 결과를 프롬프트용 텍스트로 변환. */
    public String toContext(List<EmbeddingMatch<TextSegment>> matches) {
        return matches.stream().map(m -> {
            var meta = m.embedded().metadata();
            return """
                    - name: %s
                      category: %s
                      coreFeatures: %s
                      targetCustomer: %s
                      revenueModel: %s
                      (score: %.3f)""".formatted(
                    meta.getString("name"),
                    meta.getString("category"),
                    meta.getString("coreFeatures"),
                    meta.getString("targetCustomer"),
                    meta.getString("revenueModel"),
                    m.score());
        }).collect(Collectors.joining("\n"));
    }
}