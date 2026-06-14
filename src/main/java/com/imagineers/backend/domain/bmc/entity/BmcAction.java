package com.imagineers.backend.domain.bmc.entity;

import com.imagineers.backend.global.enums.TermType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bmc_actions")
@Getter
@NoArgsConstructor
public class BmcAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bmc_record_id", nullable = false)
    private BmcRecord bmcRecord;

    @Column(name = "action_content", nullable = false, columnDefinition = "TEXT")
    private String actionContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "term_type", nullable = false, length = 10)
    private TermType termType;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Builder
    public BmcAction(BmcRecord bmcRecord, String actionContent,
                     TermType termType, Integer orderIndex) {
        this.bmcRecord = bmcRecord;
        this.actionContent = actionContent;
        this.termType = termType;
        this.orderIndex = orderIndex;
    }
}