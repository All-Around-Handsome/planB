package com.bmc.ai.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class QdrantConfig {

    private static final Logger log = LoggerFactory.getLogger(QdrantConfig.class);

    @Value("${qdrant.host:}")      private String host;
    @Value("${qdrant.port:6334}")  private int port;
    @Value("${qdrant.collection:competitor_services}") private String collection;
    @Value("${qdrant.api-key:}")   private String apiKey;
    @Value("${qdrant.use-tls:false}") private boolean useTls;

    /** QDRANT_HOST 미설정 시 인메모리 빈 스토어로 폴백 — 경쟁사 RAG는 비활성화되지만 서비스는 정상 기동. */
    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        if (!StringUtils.hasText(host)) {
            log.warn("QDRANT_HOST 미설정 — 경쟁사 RAG 비활성화 (인메모리 폴백)");
            return new InMemoryEmbeddingStore<>();
        }
        QdrantEmbeddingStore.Builder builder = QdrantEmbeddingStore.builder()
                .host(host).port(port).collectionName(collection).useTls(useTls);
        if (StringUtils.hasText(apiKey)) builder.apiKey(apiKey);
        log.info("Qdrant 연결: {}:{}/{}", host, port, collection);
        return builder.build();
    }
}
