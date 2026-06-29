package com.imagineers.backend.domain.bmc.service;

import com.imagineers.backend.domain.bmc.dto.BmcCreateRequest;
import com.imagineers.backend.domain.bmc.entity.BmcItem;
import com.imagineers.backend.domain.bmc.entity.BmcRecord;
import com.imagineers.backend.domain.bmc.repository.BmcRecordRepository;
import com.imagineers.backend.domain.limit.service.LimitService;
import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.domain.user.repository.UserRepository;
import com.imagineers.backend.global.exception.CustomException;
import com.imagineers.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.imagineers.backend.domain.bmc.dto.BmcAnalysisRequest;
import com.imagineers.backend.domain.bmc.entity.BmcAction;
import com.imagineers.backend.domain.bmc.entity.BmcRisk;
import com.imagineers.backend.global.enums.BmcType;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * BMC 저장/관리 로직.
 * G-004: AI가 생성한 BMC 9항목을 받아 DB에 저장한다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BmcService {

    private final BmcRecordRepository bmcRecordRepository;
    private final UserRepository userRepository;
    private final LimitService limitService;  // 방금 만든 횟수 제한 서비스 재사용!

    /**
     * BMC 생성 결과 저장 (G-004)
     * @param userId  요청한 사용자 (JWT 필터가 넣어준 값)
     * @param request 프론트가 보낸 BMC 데이터 (아이디어 + 9항목)
     * @return 저장된 BmcRecord의 id
     */
    public Long saveBmc(Long userId, BmcCreateRequest request) {
        // 1. 횟수 제한 체크 + 증가 (L-001/L-002)
        //    한도를 넘었으면 여기서 LIMIT_EXCEEDED 예외가 터져 저장이 안 됨
        limitService.checkAndIncrementGeneration(userId);

        // 2. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 3. BmcRecord(부모) 생성
        BmcRecord bmcRecord = BmcRecord.builder()
                .user(user)
                .ideaText(request.ideaText())
                .stage(request.stage())
                .bmcType(request.bmcType())
                .build();

        // 4. 받은 항목들(9개)을 BmcItem으로 만들어 record에 추가
        //    addItem이 양방향 연관관계를 연결해줌
        request.items().forEach(itemRequest -> {
            BmcItem item = BmcItem.builder()
                    .itemType(itemRequest.itemType())
                    .content(itemRequest.content())
                    .build();
            bmcRecord.addItem(item);
        });

        // 5. record를 저장하면 cascade로 item 9개도 자동 저장됨
        BmcRecord saved = bmcRecordRepository.save(bmcRecord);

        // 6. 저장된 id 반환
        return saved.getId();
    }

    /**
     * BMC 분석 결과 저장 (N-014)
     * G-004와 비슷하지만, 점수 + 리스크 + 액션까지 저장한다.
     * @param userId  요청한 사용자
     * @param request 프론트가 보낸 분석 데이터
     * @return 저장된 BmcRecord의 id
     */
    public Long saveAnalysis(Long userId, BmcAnalysisRequest request) {
        // 1. 분석 횟수 제한 체크 + 증가 (generation이 아니라 analysis!)
        limitService.checkAndIncrementAnalysis(userId);

        // 2. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 3. BmcRecord 생성 (분석이므로 bmcType은 DIRECT_ANALYSIS로 고정)
        BmcRecord bmcRecord = BmcRecord.builder()
                .user(user)
                .ideaText(request.ideaText())
                .stage(request.stage())
                .bmcType(BmcType.DIRECT_ANALYSIS)
                .build();

        // 4. 타당성 점수 + 근거 저장 (G-004엔 없던 부분, N-011)
        bmcRecord.updateAnalysisResult(request.validityScore(), request.scoreReason());

        // 5. 9항목 추가 (G-004와 동일)
        request.items().forEach(itemRequest -> {
            BmcItem item = BmcItem.builder()
                    .itemType(itemRequest.itemType())
                    .content(itemRequest.content())
                    .build();
            bmcRecord.addItem(item);
        });

        // 6. 리스크 추가 (N-012) - order_index는 순서대로 0,1,2...
        AtomicInteger riskOrder = new AtomicInteger(0);
        request.risks().forEach(riskRequest -> {
            BmcRisk risk = BmcRisk.builder()
                    .riskContent(riskRequest.riskContent())
                    .responseContent(riskRequest.responseContent())
                    .orderIndex(riskOrder.getAndIncrement())  // 0,1,2...
                    .build();
            bmcRecord.addRisk(risk);
        });

        // 7. 액션 추가 (N-013) - 역시 order_index 순서대로
        AtomicInteger actionOrder = new AtomicInteger(0);
        request.actions().forEach(actionRequest -> {
            BmcAction action = BmcAction.builder()
                    .actionContent(actionRequest.actionContent())
                    .termType(actionRequest.termType())
                    .orderIndex(actionOrder.getAndIncrement())
                    .build();
            bmcRecord.addAction(action);
        });

        // 8. record 저장 → cascade로 item/risk/action 전부 자동 저장
        BmcRecord saved = bmcRecordRepository.save(bmcRecord);
        return saved.getId();
    }
}