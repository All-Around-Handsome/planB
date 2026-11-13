package com.bmc.ai.config;

import com.bmc.ai.ai.BmcAnalyzer;
import com.bmc.ai.ai.BmcGenerator;
import com.bmc.ai.ai.CompetitorAnalyzer;
import com.bmc.ai.ai.IdeaTitler;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.voyageai.VoyageAiEmbeddingModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class LangChainConfig {

    private static final Logger log = LoggerFactory.getLogger(LangChainConfig.class);

    @Value("${anthropic.api-key}")  private String anthropicApiKey;
    @Value("${anthropic.model}")    private String anthropicModel;
    @Value("${anthropic.max-tokens}") private int maxTokens;

    @Value("${voyage.api-key}") private String voyageApiKey;
    @Value("${voyage.model}")   private String voyageModel;

    @Value("${anthropic.title-model:claude-haiku-4-5}") private String titleModel;

    /** LLM = Claude (아키텍처의 GPT-4o 박스를 대체). */
    @Bean
    public ChatModel chatModel() {
        return AnthropicChatModel.builder()
                .apiKey(anthropicApiKey)
                .modelName(anthropicModel)
                .maxTokens(maxTokens)
                .temperature(0.7)
                .logRequests(true)
                .logResponses(false)
                .build();
    }

    /** 임베딩 = Voyage AI. VOYAGE_API_KEY 미설정 시 NoOp 폴백 (RAG 비활성화, 기동은 정상). */
    @Bean
    public EmbeddingModel embeddingModel() {
        if (!org.springframework.util.StringUtils.hasText(voyageApiKey)) {
            log.warn("VOYAGE_API_KEY 미설정 — RAG 비활성화 (NoOp 임베딩 사용)");
            return textSegments -> Response.from(
                textSegments.stream()
                    .map(ts -> Embedding.from(new float[0]))
                    .collect(Collectors.toList())
            );
        }
        return VoyageAiEmbeddingModel.builder()
                .apiKey(voyageApiKey)
                .modelName(voyageModel)
                .build();
    }

    // ---- 선언적 AiServices: 인터페이스 + ChatModel 만으로 구현체 자동 생성 ----
    @Bean
    public BmcGenerator bmcGenerator(ChatModel chatModel) {
        return AiServices.create(BmcGenerator.class, chatModel);
    }

    @Bean
    public CompetitorAnalyzer competitorAnalyzer(ChatModel chatModel) {
        return AiServices.create(CompetitorAnalyzer.class, chatModel);
    }

    @Bean
    public BmcAnalyzer bmcAnalyzer(ChatModel chatModel) {
        return AiServices.create(BmcAnalyzer.class, chatModel);
    }

    /** 제목 짓기는 빠르고 저렴한 작은 모델로 따로 부른다. */
    @Bean
    public IdeaTitler ideaTitler() {
        ChatModel titleChatModel = AnthropicChatModel.builder()
                .apiKey(anthropicApiKey)
                .modelName(titleModel)
                .maxTokens(60)
                .temperature(0.3)
                .timeout(Duration.ofSeconds(15))
                .build();
        return AiServices.create(IdeaTitler.class, titleChatModel);
    }
}
