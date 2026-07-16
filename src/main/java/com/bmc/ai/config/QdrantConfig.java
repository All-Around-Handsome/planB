package com.bmc.ai.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class QdrantConfig {

    @Value("${qdrant.host}")       private String host;
    @Value("${qdrant.port}")       private int port;
    @Value("${qdrant.collection}") private String collection;

    // Qdrant Cloud requires an API key and TLS (grpc over TLS on port 6334).
    // Local docker Qdrant (no auth) typically needs neither, so both default safely.
    @Value("${qdrant.api-key:}")   private String apiKey;
    @Value("${qdrant.use-tls:false}") private boolean useTls;

    /**
     * Qdrant vector store. Collection must already exist (see README).
     * vector size must match voyage.dimension, distance must be Cosine.
     *
     * For Qdrant Cloud:
     *   - host: cluster hostname only, e.g. "xxxx-xxxx.us-east.aws.cloud.qdrant.io"
     *           (no "https://" prefix, no port suffix)
     *   - port: 6334 (gRPC port)
     *   - api-key: the cluster API key from the Qdrant Cloud dashboard
     *   - use-tls: true
     *
     * For local docker Qdrant:
     *   - host: localhost, port: 6334, api-key: (empty), use-tls: false
     */
    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        QdrantEmbeddingStore.Builder builder = QdrantEmbeddingStore.builder()
                .host(host)
                .port(port)
                .collectionName(collection)
                .useTls(useTls);

        if (StringUtils.hasText(apiKey)) {
            builder.apiKey(apiKey);
        }

        return builder.build();
    }
}
