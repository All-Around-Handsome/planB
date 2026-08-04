import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";

import {
  getBmcDetail,
  updateBmcItem,
} from "../api/bmc";

import MainLayout from "../layouts/MainLayout";

// BMC 항목 이름
const ITEM_LABELS = {
  VALUE_PROPOSITION: "가치 제안",
  CUSTOMER_SEGMENT: "고객 세그먼트",
  REVENUE_STREAM: "수익 구조",
  COST_STRUCTURE: "비용 구조",
  KEY_PARTNERS: "핵심 파트너",
  KEY_ACTIVITIES: "핵심 활동",
  KEY_RESOURCES: "핵심 자원",
  CHANNELS: "채널",
  CUSTOMER_RELATIONSHIPS: "고객 관계",
};


// BMC 항목 카드
function BMCItemCard({
  itemType,
  item,
  variant = "small",
  isEditing,
  editContent,
  editMemo,
  showMemo,
  focusMemo,
  onStartEdit,
  onChangeContent,
  onChangeMemo,
  onSave,
  onCancel,
  onToggleMemo,
  saving,
}) {

  const memoRef = useRef(null);

  useEffect(() => {
    if (isEditing && showMemo && focusMemo) {
      memoRef.current?.focus();
    }
  }, [isEditing, showMemo, focusMemo]);

  /*
    카드 유형
    - vertical   : 세로로 긴 카드
    - small      : 위아래 작은 카드
    - horizontal : 가로로 긴 카드
  */

  // 카드 기본 높이
  const cardHeight = {
    vertical: "h-[500px]",
    small: isEditing ? "h-[360px]" : "h-[240px]",
    horizontal: isEditing ? "h-[330px]" : "h-[260px]",
  };

  return (
    <div
      className={`
        min-w-0
        w-full
        ${cardHeight[variant]}
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition
        flex
        flex-col
        box-border
        ${
          isEditing
            ? "border-blue-400 ring-2 ring-blue-100"
            : "border-gray-200 hover:border-blue-200"
        }
      `}
    >
      {/* 제목 */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-base font-bold text-gray-900">
          {ITEM_LABELS[itemType]}
        </h3>

        {!isEditing && (
          <button
            type="button"
            onClick={onToggleMemo}
            className="
              flex
              items-center
              gap-1
              text-xs
              font-medium
              text-gray-400
              hover:text-blue-600
              transition
              shrink-0
            "
          >
            {showMemo ? (
              <>
                <EyeOff size={14} />
                메모 숨기기
              </>
            ) : (
              <>
                <Eye size={14} />
                메모 보기
              </>
            )}
          </button>
        )}
      </div>

      {/* 내용이 없는 경우 */}
      {!item ? (
        <div className="flex-1">
          <p className="text-sm text-gray-400">
            내용이 없습니다.
          </p>
        </div>
      ) : isEditing ? (
        /* =========================
           수정 모드
        ========================= */
        <div className="flex flex-col flex-1 min-h-0">
          {/* 내용 입력 영역 */}
          <div className="flex-1 min-h-0">
            <textarea
              value={editContent}
              onChange={(e) =>
                onChangeContent(e.target.value)
              }
              className="
                w-full
                h-full
                min-h-0
                resize-none
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-3
                outline-none
                text-sm
                leading-6
                text-[#3D4770]
                overflow-y-auto
                box-border
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* 메모 입력 */}
          {showMemo && (
            <textarea
              ref={memoRef}
              value={editMemo}
              onChange={(e) =>
                onChangeMemo(e.target.value)
              }
              placeholder="메모를 입력하세요"
              rows={3}
              className="
                mt-3
                w-full
                h-[72px]
                shrink-0
                resize-none
                rounded-xl
                border
                border-gray-200
                bg-yellow-50
                p-3
                outline-none
                text-xs
                leading-5
                text-gray-600
                overflow-y-auto
                box-border
                focus:border-yellow-300
                focus:ring-2
                focus:ring-yellow-100
              "
            />
          )}

          {/* 저장 / 취소 */}
          <div
            className="
              flex
              justify-end
              gap-2
              mt-3
              shrink-0
            "
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="
                h-8
                px-3
                rounded-lg
                border
                border-gray-200
                text-xs
                font-semibold
                text-gray-500
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              <span className="flex items-center gap-1">
                <X size={14} />
                취소
              </span>
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="
                h-8
                px-3
                rounded-lg
                bg-blue-600
                text-xs
                font-semibold
                text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              <span className="flex items-center gap-1">
                <Check size={14} />
                {saving ? "저장 중..." : "저장"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* =========================
          일반 표시 모드
        ========================= */
        <div
          className="
            flex
            flex-col
            flex-1
            min-h-0
          "
        >
          {/* 내용 */}
          <div
            onClick={() => onStartEdit("content")}
            className="
              flex-1
              min-h-0
              w-full
              min-w-0
              overflow-y-auto
              whitespace-pre-wrap
              break-words
              text-sm
              leading-6
              text-[#3D4770]
              cursor-text
              rounded-xl
              transition
              hover:bg-gray-100
            "
          >
            {item.content || "내용이 없습니다."}
          </div>

          {/* 메모 */}
          {showMemo && (
            <div
              onClick={() => onStartEdit("memo")}
              className="
                mt-3
                rounded-xl
                bg-yellow-50
                border
                border-yellow-100
                px-3
                py-1
                h-[72px]
                shrink-0
                box-border
                cursor-text
                transition
                hover:bg-yellow-100
              "
            >
              <p className="mb-1 text-xs font-bold text-yellow-700">
                메모
              </p>

              <p className="h-[40px] overflow-y-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-600">
                {item.memo || "메모가 없습니다."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function BMCEditPage() {
  const { bmcRecordId } = useParams();
  const navigate = useNavigate();

  const [bmc, setBmc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 현재 편집 중인 itemType
  const [editingItemType, setEditingItemType] = useState(null);

  // 편집 내용
  const [editContent, setEditContent] = useState("");
  const [editMemo, setEditMemo] = useState("");

  // 메모 포커스 여부
  const [focusMemo, setFocusMemo] = useState(false);

  // 메모 표시 여부
  const [visibleMemos, setVisibleMemos] = useState({});

  // 저장 중인 item
  const [savingItemId, setSavingItemId] = useState(null);

  // BMC 상세 조회
  useEffect(() => {
    const fetchBmcDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getBmcDetail(bmcRecordId);

        if (result?.success) {
          setBmc(result.data);
        } else {
          setError(
            result?.error?.message ||
              "BMC 정보를 불러오지 못했습니다."
          );
        }
      } catch (err) {
        console.error("BMC 상세 조회 실패:", err);

        setError(
          err.message || "BMC 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBmcDetail();
  }, [bmcRecordId]);

  // itemType으로 BMC 항목 찾기
  const getItem = (itemType) => {
    return bmc?.items?.find(
      (item) => item.itemType === itemType
    );
  };

  // 편집 시작
  const handleStartEdit = (itemType, target = "content") => {
    const item = getItem(itemType);

    if (!item) {
      return;
    }

    setEditingItemType(itemType);
    setEditContent(item.content || "");
    setEditMemo(item.memo || "");
    setFocusMemo(target === "memo");
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingItemType(null);
    setEditContent("");
    setEditMemo("");
    setFocusMemo(false);
  };

  // 저장
  const handleSave = async (itemType) => {
    const item = getItem(itemType);

    if (!item) {
      return;
    }

    try {
      setSavingItemId(item.itemId);

      const response = await updateBmcItem(item.itemId, {
        content: editContent,
        memo: editMemo,
      });

      if (!response?.success) {
        alert(
          response?.error?.message ||
            "BMC 항목을 저장하지 못했습니다."
        );
        return;
      }

      // 화면 데이터 업데이트
      setBmc((prev) => ({
        ...prev,
        items: prev.items.map((currentItem) =>
          currentItem.itemId === item.itemId
            ? {
                ...currentItem,
                content: editContent,
                memo: editMemo,
              }
            : currentItem
        ),
      }));

      setEditingItemType(null);
      setEditContent("");
      setEditMemo("");
      setFocusMemo(false);

    } catch (error) {
      console.error("BMC 항목 수정 실패:", error);
      alert("BMC 항목 수정에 실패했습니다.");
    } finally {
      setSavingItemId(null);
    }
  };

  // 메모 토글
  const handleToggleMemo = (itemType) => {
    setVisibleMemos((prev) => ({
      ...prev,
      [itemType]: !prev[itemType],
    }));
  };

  // 뒤로가기
  const handleBack = () => {
    navigate("/my/test");
  };

  // 로딩
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-[1440px] px-12 py-10">
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-sm text-gray-500">
                BMC 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 에러
  if (error || !bmc) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-[1440px] px-12 py-10">
            <button
              type="button"
              onClick={handleBack}
              className="
                mb-6
                flex
                items-center
                gap-2
                text-sm
                text-gray-500
                transition
                hover:text-gray-900
              "
            >
              <ArrowLeft size={18} />
              마이페이지
            </button>

            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                {error ||
                  "BMC 정보를 불러올 수 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] px-12 py-8">

          {/* 상단 */}
          <div className="mb-8">
            <button
              type="button"
              onClick={handleBack}
              className="
                mb-5
                flex
                items-center
                gap-2
                text-sm
                text-gray-500
                transition
                hover:text-blue-600
              "
            >
              <ArrowLeft size={18} />
              마이페이지
            </button>

            <div className="flex items-end justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  BMC 편집
                </h1>

                <p className="mt-2 max-w-[900px] truncate text-sm text-gray-500">
                  {bmc.ideaText}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-blue-100
                    bg-blue-50
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-blue-600
                  "
                >
                  {bmc.bmcType === "AI_GENERATED"
                    ? "AI 생성"
                    : "직접 분석"}
                </span>
              </div>
            </div>
          </div>

          {/* BMC */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                BMC
              </h2>

              <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                항목을 클릭하여 편집
              </span>
            </div>

            <div
              className="
                min-w-0
                rounded-3xl
                border
                border-gray-200
                bg-[#F8FAFF]
                p-6
                shadow-sm
              "
            >
              {/* 상단 5열 */}
              <div className="grid min-w-0 grid-cols-5 gap-4">

                {/* 핵심 파트너 */}
                <div className="min-w-0">
                  <BMCItemCard
                    itemType="KEY_PARTNERS"
                    item={getItem("KEY_PARTNERS")}
                    variant="vertical"
                    isEditing={
                      editingItemType === "KEY_PARTNERS"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.KEY_PARTNERS
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("KEY_PARTNERS", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave("KEY_PARTNERS")
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo("KEY_PARTNERS")
                    }
                    saving={
                      savingItemId ===
                      getItem("KEY_PARTNERS")?.itemId
                    }
                  />
                </div>

                {/* 핵심 활동 + 핵심 자원 */}
                <div className="grid min-w-0 grid-rows-2 gap-4">
                  <BMCItemCard
                    itemType="KEY_ACTIVITIES"
                    item={getItem("KEY_ACTIVITIES")}
                    variant="small"
                    isEditing={
                      editingItemType === "KEY_ACTIVITIES"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.KEY_ACTIVITIES
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("KEY_ACTIVITIES", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave("KEY_ACTIVITIES")
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo("KEY_ACTIVITIES")
                    }
                    saving={
                      savingItemId ===
                      getItem("KEY_ACTIVITIES")?.itemId
                    }
                  />

                  <BMCItemCard
                    itemType="KEY_RESOURCES"
                    item={getItem("KEY_RESOURCES")}
                    variant="small"
                    isEditing={
                      editingItemType === "KEY_RESOURCES"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.KEY_RESOURCES
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("KEY_RESOURCES", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave("KEY_RESOURCES")
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo("KEY_RESOURCES")
                    }
                    saving={
                      savingItemId ===
                      getItem("KEY_RESOURCES")?.itemId
                    }
                  />
                </div>

                {/* 가치 제안 */}
                <div className="min-w-0">
                  <BMCItemCard
                    itemType="VALUE_PROPOSITION"
                    item={getItem("VALUE_PROPOSITION")}
                    variant="vertical"
                    isEditing={
                      editingItemType ===
                      "VALUE_PROPOSITION"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.VALUE_PROPOSITION
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("VALUE_PROPOSITION", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave(
                        "VALUE_PROPOSITION"
                      )
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo(
                        "VALUE_PROPOSITION"
                      )
                    }
                    saving={
                      savingItemId ===
                      getItem("VALUE_PROPOSITION")?.itemId
                    }
                  />
                </div>

                {/* 고객 관계 + 채널 */}
                <div className="grid min-w-0 grid-rows-2 gap-4">
                  <BMCItemCard
                    itemType="CUSTOMER_RELATIONSHIPS"
                    item={getItem(
                      "CUSTOMER_RELATIONSHIPS"
                    )}
                    variant="small"
                    isEditing={
                      editingItemType ===
                      "CUSTOMER_RELATIONSHIPS"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.CUSTOMER_RELATIONSHIPS
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("CUSTOMER_RELATIONSHIPS", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave(
                        "CUSTOMER_RELATIONSHIPS"
                      )
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo(
                        "CUSTOMER_RELATIONSHIPS"
                      )
                    }
                    saving={
                      savingItemId ===
                      getItem(
                        "CUSTOMER_RELATIONSHIPS"
                      )?.itemId
                    }
                  />

                  <BMCItemCard
                    itemType="CHANNELS"
                    item={getItem("CHANNELS")}
                    isEditing={
                      editingItemType === "CHANNELS"
                    }
                    variant="small"
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.CHANNELS
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("CHANNELS", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave("CHANNELS")
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo("CHANNELS")
                    }
                    saving={
                      savingItemId ===
                      getItem("CHANNELS")?.itemId
                    }
                  />
                </div>

                {/* 고객 세그먼트 */}
                <div className="min-w-0">
                  <BMCItemCard
                    itemType="CUSTOMER_SEGMENT"
                    item={getItem("CUSTOMER_SEGMENT")}
                    variant="vertical"
                    isEditing={
                      editingItemType ===
                      "CUSTOMER_SEGMENT"
                    }
                    editContent={editContent}
                    editMemo={editMemo}
                    showMemo={
                      !!visibleMemos.CUSTOMER_SEGMENT
                    }
                    onStartEdit={(target) =>
                      handleStartEdit("CUSTOMER_SEGMENT", target)
                    }
                    onChangeContent={setEditContent}
                    onChangeMemo={setEditMemo}
                    onSave={() =>
                      handleSave(
                        "CUSTOMER_SEGMENT"
                      )
                    }
                    onCancel={handleCancelEdit}
                    onToggleMemo={() =>
                      handleToggleMemo(
                        "CUSTOMER_SEGMENT"
                      )
                    }
                    saving={
                      savingItemId ===
                      getItem(
                        "CUSTOMER_SEGMENT"
                      )?.itemId
                    }
                  />
                </div>
              </div>

              {/* 하단 2열 */}
              <div className="mt-4 grid min-w-0 grid-cols-2 gap-4">
                <BMCItemCard
                  itemType="COST_STRUCTURE"
                  item={getItem("COST_STRUCTURE")}
                  variant="horizontal"
                  isEditing={
                    editingItemType ===
                    "COST_STRUCTURE"
                  }
                  editContent={editContent}
                  editMemo={editMemo}
                  showMemo={
                    !!visibleMemos.COST_STRUCTURE
                  }
                  onStartEdit={(target) =>
                    handleStartEdit("COST_STRUCTURE", target)
                  }
                  onChangeContent={setEditContent}
                  onChangeMemo={setEditMemo}
                  onSave={() =>
                    handleSave("COST_STRUCTURE")
                  }
                  onCancel={handleCancelEdit}
                  onToggleMemo={() =>
                    handleToggleMemo("COST_STRUCTURE")
                  }
                  saving={
                    savingItemId ===
                    getItem("COST_STRUCTURE")?.itemId
                  }
                />

                <BMCItemCard
                  itemType="REVENUE_STREAM"
                  item={getItem("REVENUE_STREAM")}
                  variant="horizontal"
                  isEditing={
                    editingItemType ===
                    "REVENUE_STREAM"
                  }
                  editContent={editContent}
                  editMemo={editMemo}
                  showMemo={
                    !!visibleMemos.REVENUE_STREAM
                  }
                  onStartEdit={(target) =>
                    handleStartEdit("REVENUE_STREAM", target)
                  }
                  onChangeContent={setEditContent}
                  onChangeMemo={setEditMemo}
                  onSave={() =>
                    handleSave("REVENUE_STREAM")
                  }
                  onCancel={handleCancelEdit}
                  onToggleMemo={() =>
                    handleToggleMemo("REVENUE_STREAM")
                  }
                  saving={
                    savingItemId ===
                    getItem("REVENUE_STREAM")?.itemId
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default BMCEditPage;