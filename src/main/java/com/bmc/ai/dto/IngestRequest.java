package com.bmc.ai.dto;

import com.bmc.ai.model.CompetitorService;
import java.util.List;

/** 경쟁 서비스 컬렉션 적재 요청(관리/배치용). */
public record IngestRequest(List<CompetitorService> services) {}
