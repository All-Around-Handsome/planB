package com.bmc.ai.service;

import com.bmc.ai.model.CompetitorService;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Embeds competitor services with Voyage and stores them in Qdrant.
 *
 * Batches embedding requests instead of one-call-per-item, because Voyage's free tier
 * (no payment method on file) is rate-limited to 3 requests/minute and 10K tokens/minute.
 * Calling embed() once per company (255 calls) blows through 3 RPM almost immediately.
 * Batching groups many texts into a single API call, and a delay between batches keeps
 * us under the per-minute request limit.
 *
 * If a payment method is added on https://dashboard.voyageai.com/, the reduced limits
 * are lifted (the 200M free tokens still apply) and this batching/delay becomes mostly
 * unnecessary — but it's harmless to leave in either way.
 */
@Service
public class CompetitorIngestionService {

    private static final Logger log = LoggerFactory.getLogger(CompetitorIngestionService.class);

    // Free-tier Voyage limit is 3 requests/minute. Stay safely under that.
    private static final int BATCH_SIZE = 20;
    private static final long DELAY_BETWEEN_BATCHES_MS = 21_000; // ~21s -> under 3 req/min

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public CompetitorIngestionService(EmbeddingModel embeddingModel,
                                      EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }

    public int ingest(List<CompetitorService> services) {
        List<TextSegment> segments = new ArrayList<>(services.size());

        for (CompetitorService s : services) {
            String embedText = "%s. 카테고리: %s. 핵심기능: %s. 설명: %s"
                    .formatted(s.name(), s.category(), s.coreFeatures(), s.description());

            Metadata meta = Metadata.from(Map.of(
                    "name", s.name(),
                    "category", s.category(),
                    "coreFeatures", s.coreFeatures(),
                    "targetCustomer", s.targetCustomer(),
                    "revenueModel", s.revenueModel()
            ));

            segments.add(TextSegment.from(embedText, meta));
        }

        int total = segments.size();
        int ingested = 0;

        for (int i = 0; i < total; i += BATCH_SIZE) {
            List<TextSegment> batch = segments.subList(i, Math.min(i + BATCH_SIZE, total));

            log.info("Embedding batch {}-{} of {}...", i + 1, i + batch.size(), total);
            Response<List<Embedding>> response = embeddingModel.embedAll(batch);
            List<Embedding> embeddings = response.content();

            embeddingStore.addAll(embeddings, batch);
            ingested += batch.size();

            boolean isLastBatch = (i + BATCH_SIZE) >= total;
            if (!isLastBatch) {
                sleep(DELAY_BETWEEN_BATCHES_MS);
            }
        }

        return ingested;
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Ingestion interrupted while waiting for rate limit", e);
        }
    }
}