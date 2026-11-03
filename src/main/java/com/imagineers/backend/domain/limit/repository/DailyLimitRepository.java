package com.imagineers.backend.domain.limit.repository;

import com.imagineers.backend.domain.limit.entity.DailyLimit;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyLimitRepository extends JpaRepository<DailyLimit, Long> {

    // 오늘 날짜 기준 사용자 횟수 조회 (L-001, L-002)
    // SELECT * FROM daily_limits WHERE user_id = ? AND limit_date = ?
    Optional<DailyLimit> findByUserIdAndLimitDate(Long userId, LocalDate limitDate);

    // 차감용 조회: 동시 요청이 한도를 넘지 못하도록 행을 잠근다
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from DailyLimit d where d.user.id = :userId and d.limitDate = :limitDate")
    Optional<DailyLimit> findForUpdate(@Param("userId") Long userId, @Param("limitDate") LocalDate limitDate);
}