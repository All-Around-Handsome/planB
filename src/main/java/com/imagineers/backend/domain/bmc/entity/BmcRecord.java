package com.imagineers.backend.domain.bmc.entity;

import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.global.enums.BmcType;
import com.imagineers.backend.global.enums.Stage;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "bmc_records",
        indexes = @Index(
                name = "idx_bmc_records_user_created",
                columnList = "user_id, created_at"
        )
)
@Getter
@NoArgsConstructor
public class BmcRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "idea_text", nullable = false, columnDefinition = "TEXT")
    private String ideaText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Stage stage;

    @Enumerated(EnumType.STRING)
    @Column(name = "bmc_type", nullable = false, length = 20)
    private BmcType bmcType;

    // 직접분석 타입일 때만 값이 있음. AI생성이면 NULL
    @Column(name = "validity_score")
    private Integer validityScore;

    @Column(name = "score_reason", columnDefinition = "TEXT")
    private String scoreReason;

    @OneToMany(mappedBy = "bmcRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BmcItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "bmcRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BmcRisk> risks = new ArrayList<>();

    @OneToMany(mappedBy = "bmcRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BmcAction> actions = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public BmcRecord(User user, String ideaText, Stage stage, BmcType bmcType) {
        this.user = user;
        this.ideaText = ideaText;
        this.stage = stage;
        this.bmcType = bmcType;
    }

    // 직접분석 결과 저장할 때 사용
    public void updateAnalysisResult(Integer validityScore, String scoreReason) {
        this.validityScore = validityScore;
        this.scoreReason = scoreReason;
    }
}