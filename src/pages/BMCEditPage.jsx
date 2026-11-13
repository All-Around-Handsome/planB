import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Pencil, StickyNote } from "lucide-react";

import { getBmcDetail, updateBmcItem } from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import BMCText from "../components/BMCText";

import { BMC_FIELDS, getIdeaTitle } from "../utils/bmc";

// BMC 표준 배치 (넓은 화면 10칸 기준)
const LAYOUT = {
  KEY_PARTNERS: "lg:col-span-2 lg:row-span-2",
  KEY_ACTIVITIES: "lg:col-span-2",
  VALUE_PROPOSITION: "lg:col-span-2 lg:row-span-2",
  CUSTOMER_RELATIONSHIPS: "lg:col-span-2",
  CUSTOMER_SEGMENT: "lg:col-span-2 lg:row-span-2",
  KEY_RESOURCES: "lg:col-span-2",
  CHANNELS: "lg:col-span-2",
  COST_STRUCTURE: "lg:col-span-5",
  REVENUE_STREAM: "lg:col-span-5",
};

// BMC 항목 카드: 누르면 그 자리에서 내용과 메모를 고칠 수 있다
function BMCItemCard({ label, item, layout, isEditing, saving, onStart, onSave, onCancel }) {
  const [content, setContent] = useState(item?.content || "");
  const [memo, setMemo] = useState(item?.memo || "");
  const contentRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      contentRef.current?.focus();
    }
  }, [isEditing]);

  if (!item) {
    return null;
  }

  if (isEditing) {
    return (
      <div className={`${layout} min-w-0 flex flex-col gap-3 rounded-xl border border-gray-900 ring-4 ring-gray-100 bg-white p-4`}>
        <h3 className="text-[13px] font-semibold text-gray-900">{label}</h3>

        <textarea
          ref={contentRef}
          aria-label={`${label} 내용`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-[120px] w-full resize-none outline-none text-sm leading-6 text-gray-800"
        />

        <label className="flex flex-col gap-1.5 rounded-lg bg-amber-50/70 px-3 py-2">
          <span className="text-[11px] font-semibold text-amber-600">메모</span>
          <textarea
            aria-label={`${label} 메모`}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="나만 보는 메모"
            rows={2}
            className="w-full resize-none bg-transparent outline-none text-sm leading-6 text-gray-700 placeholder:text-amber-300"
          />
        </label>

        <div className="flex justify-end gap-1.5">
          <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
            취소
          </Button>
          <Button size="sm" icon={Check} onClick={() => onSave(content, memo)} disabled={saving}>
            {saving ? "저장 중" : "저장"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className={`${layout} group min-w-0 min-h-[170px] flex flex-col text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:bg-gray-50/50 transition-colors`}
    >
      <span className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-gray-500">{label}</span>
        <Pencil size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>

      <span className="flex-1">
        <BMCText text={item.content} empty="비어 있음 · 눌러서 작성" />
      </span>

      {item.memo && (
        <span className="mt-3 flex gap-1.5 rounded-lg bg-amber-50/70 px-2.5 py-2 text-xs leading-5 text-amber-700">
          <StickyNote size={13} className="mt-0.5 shrink-0" />
          <span className="whitespace-pre-line">{item.memo}</span>
        </span>
      )}
    </button>
  );
}

function BMCEditPage() {
  const { bmcRecordId } = useParams();
  const navigate = useNavigate();

  const [bmc, setBmc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItemType, setEditingItemType] = useState(null);
  const [savingItemType, setSavingItemType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBmcDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getBmcDetail(bmcRecordId);

        if (result?.success) {
          setBmc(result.data);
        } else {
          setError(result?.error?.message || "BMC 정보를 불러오지 못했어요.");
        }
      } catch (err) {
        console.error("BMC 상세 조회 실패:", err);
        setError(err.message || "BMC 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchBmcDetail();
  }, [bmcRecordId]);

  const getItem = (itemType) => bmc?.items?.find((item) => item.itemType === itemType);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleSave = async (itemType, content, memo) => {
    const item = getItem(itemType);

    if (!item) {
      return;
    }

    try {
      setSavingItemType(itemType);

      const response = await updateBmcItem(item.itemId, { content, memo });

      if (!response?.success) {
        showToast(response?.error?.message || "저장하지 못했어요.");
        return;
      }

      setBmc((prev) => ({
        ...prev,
        items: prev.items.map((currentItem) =>
          currentItem.itemId === item.itemId ? { ...currentItem, content, memo } : currentItem
        ),
      }));

      setEditingItemType(null);
      showToast("저장했어요.");
    } catch (err) {
      console.error("BMC 항목 수정 실패:", err);
      showToast("저장하지 못했어요.");
    } finally {
      setSavingItemType(null);
    }
  };

  return (
    <MainLayout footer={false}>
      <main className="w-full max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-16 animate-fade-up">
        <button
          type="button"
          onClick={() => navigate(bmc ? `/bmc/result/${bmc.bmcRecordId}` : "/my")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          {bmc ? "결과로 돌아가기" : "내 BMC"}
        </button>

        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse" aria-label="불러오는 중">
            <div className="h-10 w-1/2 rounded-lg bg-gray-100" />
            <div className="h-96 rounded-2xl bg-gray-100" />
          </div>
        ) : error || !bmc ? (
          <EmptyState title={error || "BMC 정보를 불러올 수 없어요."} />
        ) : (
          <>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-gray-900 truncate">
                  {getIdeaTitle(bmc.ideaText)}
                </h1>
                <p className="mt-2 text-[15px] text-gray-500">
                  블록을 누르면 내용과 메모를 고칠 수 있어요. 저장은 블록마다 따로 돼요.
                </p>
              </div>

              <span className="shrink-0 self-start sm:self-auto h-7 px-2.5 rounded-md bg-gray-100 text-xs font-medium text-gray-500 inline-flex items-center">
                {bmc.bmcType === "AI_GENERATED" ? "AI 생성" : "직접 작성"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-2 lg:auto-rows-[minmax(170px,auto)]">
              {BMC_FIELDS.map(({ itemType, label }) => (
                <BMCItemCard
                  key={`${itemType}-${editingItemType === itemType}`}
                  label={label}
                  item={getItem(itemType)}
                  layout={LAYOUT[itemType]}
                  isEditing={editingItemType === itemType}
                  saving={savingItemType === itemType}
                  onStart={() => setEditingItemType(itemType)}
                  onCancel={() => setEditingItemType(null)}
                  onSave={(content, memo) => handleSave(itemType, content, memo)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </MainLayout>
  );
}

export default BMCEditPage;
