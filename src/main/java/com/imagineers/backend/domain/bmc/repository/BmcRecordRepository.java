package com.imagineers.backend.domain.bmc.repository;

import com.imagineers.backend.domain.bmc.entity.BmcRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BmcRecordRepository extends JpaRepository<BmcRecord, Long> {

    // 사용자의 BMC 목록 최신순 조회 (P-001)
    // SELECT * FROM bmc_records WHERE user_id = ?
    // ORDER BY created_at DESC LIMIT ? OFFSET ?
    Page<BmcRecord> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 사용자의 BMC 목록 전체를 최신순으로 조회 (P-001, 페이징 없이 전부)
    List<BmcRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
}