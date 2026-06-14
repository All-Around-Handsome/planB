package com.imagineers.backend.domain.limit.entity;

import com.imagineers.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(
        name = "daily_limits",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_daily_limits_user_date",
                columnNames = {"user_id", "limit_date"}
        )
)
@Getter
@NoArgsConstructor
public class DailyLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "limit_date", nullable = false)
    private LocalDate limitDate;

    @Column(name = "generation_count", nullable = false)
    private int generationCount = 0;

    @Column(name = "analysis_count", nullable = false)
    private int analysisCount = 0;

    @Builder
    public DailyLimit(User user, LocalDate limitDate) {
        this.user = user;
        this.limitDate = limitDate;
        this.generationCount = 0;
        this.analysisCount = 0;
    }

    // AI 생성 횟수 +1 (L-001)
    public void incrementGenerationCount() {
        this.generationCount++;
    }

    // 직접 분석 횟수 +1 (L-001)
    public void incrementAnalysisCount() {
        this.analysisCount++;
    }
}