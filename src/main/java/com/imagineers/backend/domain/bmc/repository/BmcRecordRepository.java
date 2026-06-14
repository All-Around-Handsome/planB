package com.imagineers.backend.domain.bmc.repository;

import com.imagineers.backend.domain.bmc.entity.BmcRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BmcRecordRepository extends JpaRepository<BmcRecord, Long> {

    // 사용자의 BMC 목록 최신순 조회 (P-001)
    // SELECT * FROM bmc_records WHERE user_id = ?
    // ORDER BY created_at DESC LIMIT ? OFFSET ?
    Page<BmcRecord> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}