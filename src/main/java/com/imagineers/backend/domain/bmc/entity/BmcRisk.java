package com.imagineers.backend.domain.bmc.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bmc_risks")
@Getter
@NoArgsConstructor
public class BmcRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bmc_record_id", nullable = false)
    private BmcRecord bmcRecord;

    @Column(name = "risk_content", nullable = false, columnDefinition = "TEXT")
    private String riskContent;

    @Column(name = "response_content", nullable = false, columnDefinition = "TEXT")
    private String responseContent;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Builder
    public BmcRisk(BmcRecord bmcRecord, String riskContent,
                   String responseContent, Integer orderIndex) {
        this.bmcRecord = bmcRecord;
        this.riskContent = riskContent;
        this.responseContent = responseContent;
        this.orderIndex = orderIndex;
    }
}