package com.imagineers.backend.domain.bmc.repository;

import com.imagineers.backend.domain.bmc.entity.BmcRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BmcRiskRepository extends JpaRepository<BmcRisk, Long> {

    // 특정 BMC의 리스크 목록 순서대로 조회 (N-014)
    // SELECT * FROM bmc_risks WHERE bmc_record_id = ?
    // ORDER BY order_index
    List<BmcRisk> findByBmcRecordIdOrderByOrderIndex(Long bmcRecordId);
}