package com.bmc.ai.model;

/** Qdrant 경쟁 서비스 컬렉션에 적재/검색되는 단위 (기능명세서 S-001). */
public record CompetitorService(
        String name,
        String category,
        String coreFeatures,
        String targetCustomer,
        String revenueModel,
        String description
) {}
