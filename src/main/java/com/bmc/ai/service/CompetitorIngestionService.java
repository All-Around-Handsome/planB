package com.bmc.ai.service;

import com.bmc.ai.model.CompetitorService;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 경쟁 서비스 데이터를 Voyage 로 임베딩하여 Qdrant 에 적재 (S-001 의 데이터 소스 구축).
 * 검색 품질은 결국 이 컬렉션 데이터에 달려 있다.
 */
@Service
public class CompetitorIngestionService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public CompetitorIngestionService(EmbeddingModel embeddingModel,
                                      EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }

    public int ingest(List<CompetitorService> services) {
        for (CompetitorService s : services) {
            // 임베딩 대상 텍스트: 검색 매칭 품질을 위해 핵심 설명을 합친다.
            String embedText = "%s. 카테고리: %s. 핵심기능: %s. 설명: %s"
                    .formatted(s.name(), s.category(), s.coreFeatures(), s.description());

            // 구조화된 필드는 메타데이터로 저장 -> 검색 후 비교 분석에 재사용
            Metadata meta = Metadata.from(Map.of(
                    "name", s.name(),
                    "category", s.category(),
                    "coreFeatures", s.coreFeatures(),
                    "targetCustomer", s.targetCustomer(),
                    "revenueModel", s.revenueModel()
            ));

            TextSegment segment = TextSegment.from(embedText, meta);
            Embedding embedding = embeddingModel.embed(segment).content();
            embeddingStore.add(embedding, segment);
        }
        return services.size();
    }
}
