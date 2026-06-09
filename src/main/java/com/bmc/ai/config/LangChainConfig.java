package com.bmc.ai.config;

import com.bmc.ai.ai.BmcAnalyzer;
import com.bmc.ai.ai.BmcGenerator;
import com.bmc.ai.ai.CompetitorAnalyzer;
import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.voyageai.VoyageAiEmbeddingModel;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LangChainConfig {

    @Value("${anthropic.api-key}")  private String anthropicApiKey;
    @Value("${anthropic.model}")    private String anthropicModel;
    @Value("${anthropic.max-tokens}") private int maxTokens;

    @Value("${voyage.api-key}") private String voyageApiKey;
    @Value("${voyage.model}")   private String voyageModel;

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

    /** 임베딩 = Voyage AI (Claude 는 임베딩 모델이 없으므로 분리). */
    @Bean
    public EmbeddingModel embeddingModel() {
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
}
