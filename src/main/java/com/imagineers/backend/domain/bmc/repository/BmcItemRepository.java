package com.imagineers.backend.domain.bmc.repository;

import com.imagineers.backend.domain.bmc.entity.BmcItem;
import com.imagineers.backend.global.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BmcItemRepository extends JpaRepository<BmcItem, Long> {

    // 특정 BMC의 9개 항목 전부 조회 (P-002)
    // SELECT * FROM bmc_items WHERE bmc_record_id = ?
    List<BmcItem> findByBmcRecordId(Long bmcRecordId);

    // 특정 BMC의 특정 항목 조회 (B-003 수정할 때 사용)
    // SELECT * FROM bmc_items WHERE bmc_record_id = ? AND item_type = ?
    Optional<BmcItem> findByBmcRecordIdAndItemType(Long bmcRecordId, ItemType itemType);
}