package com.imagineers.backend.domain.bmc.entity;

import com.imagineers.backend.global.enums.ItemType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bmc_items",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_bmc_items_type",
                columnNames = {"bmc_record_id", "item_type"}
        )
)
@Getter
@NoArgsConstructor
public class BmcItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bmc_record_id", nullable = false)
    private BmcRecord bmcRecord;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 50)
    private ItemType itemType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public BmcItem(BmcRecord bmcRecord, ItemType itemType, String content) {
        this.bmcRecord = bmcRecord;
        this.itemType = itemType;
        this.content = content;
    }

    // 항목 수정할 때 사용 (B-003)
    public void update(String content, String memo) {
        if (content != null) this.content = content;
        if (memo != null)    this.memo = memo;
    }
}