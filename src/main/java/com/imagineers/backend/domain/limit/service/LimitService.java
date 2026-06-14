package com.imagineers.backend.domain.limit.service;

import com.imagineers.backend.domain.limit.entity.DailyLimit;
import com.imagineers.backend.domain.limit.repository.DailyLimitRepository;
import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.domain.user.repository.UserRepository;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * 일일 사용 횟수 제한 로직 (L-001 횟수 추적, L-002 초과 차단).
 * BMC 생성/분석을 하기 "직전"에 호출되어,
 * 한도를 넘었으면 막고(L-002), 안 넘었으면 횟수를 1 증가시킨다(L-001).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class LimitService {

    private final DailyLimitRepository dailyLimitRepository;
    private final UserRepository userRepository;

    // application.yml의 한도 설정값을 읽어온다
    @Value("${limit.daily-generation}")
    private int dailyGenerationLimit;

    @Value("${limit.daily-analysis}")
    private int dailyAnalysisLimit;

    /**
     * AI 생성 횟수 체크 + 증가.
     * BMC 자동생성(G 경로) 직전에 호출한다.
     * @param userId 요청한 사용자 ID
     */
    public void checkAndIncrementGeneration(Long userId) {
        // 1. 오늘 날짜의 사용 기록을 가져온다 (없으면 새로 만든다)
        DailyLimit dailyLimit = getOrCreateTodayLimit(userId);

        // 2. 한도를 넘었는지 검사 (L-002)
        if (dailyLimit.getGenerationCount() >= dailyGenerationLimit) {
            // 넘었으면 차단 → "오늘의 생성 횟수를 모두 사용하였습니다"
            throw new CustomException(ErrorCode.LIMIT_EXCEEDED);
        }

        // 3. 통과했으면 횟수 1 증가 (L-001)
        dailyLimit.incrementGenerationCount();
        // dailyLimit은 조회/저장된 "관리 상태"라, 값만 바꾸면 트랜잭션 끝날 때 자동 반영
    }

    /**
     * 직접 분석 횟수 체크 + 증가.
     * BMC 직접분석(N 경로) 직전에 호출한다.
     */
    public void checkAndIncrementAnalysis(Long userId) {
        DailyLimit dailyLimit = getOrCreateTodayLimit(userId);

        if (dailyLimit.getAnalysisCount() >= dailyAnalysisLimit) {
            throw new CustomException(ErrorCode.LIMIT_EXCEEDED);
        }

        dailyLimit.incrementAnalysisCount();
    }

    /**
     * 오늘 날짜의 사용 기록을 가져온다.
     * 없으면(오늘 첫 사용이면) 새로 만들어 저장한다.
     */
    private DailyLimit getOrCreateTodayLimit(Long userId) {
        LocalDate today = LocalDate.now(); // 오늘 날짜 (자정 지나면 자동으로 다음 날짜)

        return dailyLimitRepository
                .findByUserIdAndLimitDate(userId, today)
                .orElseGet(() -> {
                    // 오늘 기록이 없으면 → 사용자를 찾아서 새 기록 생성
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

                    DailyLimit newLimit = DailyLimit.builder()
                            .user(user)
                            .limitDate(today)
                            .build();
                    return dailyLimitRepository.save(newLimit);
                });
    }
}