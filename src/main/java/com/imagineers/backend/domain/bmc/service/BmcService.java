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
import com.imagineers.backend.domain.bmc.repository.BmcItemRepository;
import com.imagineers.backend.domain.bmc.dto.BmcListResponse;
import com.imagineers.backend.domain.bmc.dto.BmcDetailResponse;
import java.util.List;

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
    private final LimitService limitService;
    private final BmcItemRepository bmcItemRepository;

    /**
     * BMC 생성 결과 저장 (G-004)
     * @param userId  요청한 사용자 (JWT 필터가 넣어준 값)
     * @param request 프론트가 보낸 BMC 데이터 (아이디어 + 9항목)
     * @return 저장된 BmcRecord의 id
     */
    public Long saveBmc(Long userId, BmcCreateRequest request) {
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

    /**
     * BMC 삭제 (P-003)
     * 본인 소유의 BMC만 삭제할 수 있다.
     * @param userId 요청한 사용자 (토큰에서 추출)
     * @param bmcRecordId 삭제할 BMC의 id
     */
    public void deleteBmc(Long userId, Long bmcRecordId) {
        // 1. 삭제할 BMC를 찾는다. 없으면 404
        BmcRecord bmcRecord = bmcRecordRepository.findById(bmcRecordId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 2. 본인 소유인지 확인 (핵심 보안 체크!)
        //    이 BMC 주인의 id와 요청자 id가 다르면 → 남의 것이니 거부
        if (!bmcRecord.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 3. 삭제. cascade + orphanRemoval 덕분에
        //    딸린 item/risk/action도 자동으로 함께 삭제된다.
        bmcRecordRepository.delete(bmcRecord);
    }

    /**
     * BMC 항목 수정 (B-003)
     * 본인 소유 BMC의 항목만 수정할 수 있다.
     * @param userId 요청한 사용자
     * @param itemId 수정할 항목(BmcItem)의 id
     * @param content 새 내용 (null이면 내용은 안 바꿈)
     * @param memo 새 메모 (null이면 메모는 안 바꿈)
     */
    public void updateItem(Long userId, Long itemId, String content, String memo) {
        // 1. 수정할 항목을 찾는다. 없으면 404
        BmcItem item = bmcItemRepository.findById(itemId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 2. 본인 소유인지 확인
        //    item → 속한 record → 그 record의 주인 id 가 요청자와 같아야 함
        Long ownerId = item.getBmcRecord().getUser().getId();
        if (!ownerId.equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 3. 수정. 엔티티의 update가 null이 아닌 값만 골라 바꿔줌.
        //    @Transactional이라 save 안 해도 변경 감지로 자동 반영됨!
        item.update(content, memo);
    }

    /**
     * 내 BMC 목록 조회 (P-001)
     * 로그인한 사용자가 저장한 BMC들을 최신순으로 반환한다.
     * @param userId 요청한 사용자
     * @return 간략 정보 목록 (마이페이지용)
     */
    @Transactional(readOnly = true)  // 조회만 하므로 readOnly (성능 최적화)
    public List<BmcListResponse> getMyBmcList(Long userId) {
        // 이 사용자의 BMC를 최신순으로 조회 (레포지토리에 이미 있는 메서드 활용)
        // Pageable 없이 전체를 가져오려면 findAll 계열이 필요하므로,
        // 우선 레포지토리에 맞는 메서드를 사용한다 (아래 3단계에서 메서드 추가)
        return bmcRecordRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(BmcListResponse::from)  // 각 record를 목록 DTO로 변환
                .toList();
    }

    /**
     * BMC 상세 조회 (P-002)
     * 본인 소유의 BMC 하나를, 아이디어+항목+리스크+액션까지 전부 반환한다.
     * @param userId 요청한 사용자
     * @param bmcRecordId 조회할 BMC의 id
     * @return 전체 내용 (상세 페이지용)
     */
    @Transactional(readOnly = true)
    public BmcDetailResponse getBmcDetail(Long userId, Long bmcRecordId) {
        // 1. BMC를 찾는다. 없으면 404
        BmcRecord bmcRecord = bmcRecordRepository.findById(bmcRecordId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        // 2. 본인 소유인지 확인 (남의 BMC는 못 봄)
        if (!bmcRecord.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 3. record 하나를 통째로 DTO로 변환 (항목/리스크/액션 다 포함)
        return BmcDetailResponse.from(bmcRecord);
    }
}