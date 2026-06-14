package com.imagineers.backend.domain.limit.repository;

import com.imagineers.backend.domain.limit.entity.DailyLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyLimitRepository extends JpaRepository<DailyLimit, Long> {

    // 오늘 날짜 기준 사용자 횟수 조회 (L-001, L-002)
    // SELECT * FROM daily_limits WHERE user_id = ? AND limit_date = ?
    Optional<DailyLimit> findByUserIdAndLimitDate(Long userId, LocalDate limitDate);
}