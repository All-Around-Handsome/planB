package com.bmc.ai.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QdrantConfig {

    @Value("${qdrant.host}")       private String host;
    @Value("${qdrant.port}")       private int port;
    @Value("${qdrant.collection}") private String collection;

    /**
     * Qdrant 벡터 스토어. 컬렉션은 사전에 생성되어 있어야 한다(README 참고).
     * vector size 는 voyage.dimension 과 동일, distance 는 Cosine.
     */
    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return QdrantEmbeddingStore.builder()
                .host(host)
                .port(port)            // gRPC 포트(6334)
                .collectionName(collection)
                .build();
    }
}
