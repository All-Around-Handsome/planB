import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Target,
  FileText,
  ArrowRight,
} from "lucide-react";

import { getBmcLimit } from "../api/bmc";

import WorkspaceLayout from "../layouts/WorkspaceLayout";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import DraftRestoreModal from "../components/DraftRestoreModal";
import BMCSelectModal from "../components/BMCSelectModal";

import {
  getDraftData,
  getProjectData,
  saveProjectData,
  saveDraftData,
  removeDraftData,
} from "../utils/projectStorage";

const STEP_OPTIONS = [
  { id: "idea", icon: Lightbulb, title: "아이디어" },
  { id: "validate", icon: ShieldCheck, title: "검증" },
  { id: "launch", icon: Rocket, title: "초기 런칭" },
  { id: "growth", icon: TrendingUp, title: "성장" },
];

const SEARCH_OPTIONS = [
  { id: "withSearch", icon: Target, title: "경쟁 탐색 후 작성", description: "비슷한 서비스를 먼저 찾아 비교해요" },
  { id: "withoutSearch", icon: FileText, title: "바로 작성", description: "BMC 생성이나 직접 작성으로 넘어가요" },
];

const MIN_IDEA_LENGTH = 10;

const EMPTY_FORM = {
  ideaTitle: "",
  ideaContent: "",
  selectedStep: "idea",
  searchOption: "withSearch",
};

function OptionGroup({ label, options, value, onChange, columns }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">{label}</h2>

      <div className={`grid gap-2 ${columns}`}>
        {options.map(({ id, icon: Icon, title, description }) => {
          const active = value === id;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(id)}
              className={`min-h-12 px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon size={17} className={active ? "text-white" : "text-gray-400"} />
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{title}</span>
                {description && (
                  <span className={`text-xs mt-0.5 ${active ? "text-white/70" : "text-gray-400"}`}>
                    {description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function IdeaPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isFresh = !!state?.fresh;

  const [form, setForm] = useState(() =>
    isFresh ? EMPTY_FORM : { ...EMPTY_FORM, ...getProjectData() }
  );
  const [draftData, setDraftData] = useState(() =>
    isFresh ? null : getDraftData()
  );
  const [isBMCSelectOpen, setIsBMCSelectOpen] = useState(false);
  const [bmcLimit, setBmcLimit] = useState(null);

  useEffect(() => {
    getBmcLimit()
      .then((response) => {
        if (response?.success) {
          setBmcLimit(response.data);
        }
      })
      .catch((error) => console.error("사용 횟수 조회 실패", error));
  }, []);

  // 사용자가 직접 고친 내용만 임시 저장한다
  const updateForm = (patch) => {
    const next = { ...form, ...patch };

    setForm(next);
    saveDraftData({
      ideaTitle: next.ideaTitle,
      ideaContent: next.ideaContent,
      selectedStep: next.selectedStep,
      searchOption: next.searchOption,
    });
  };

  const handleRestoreDraft = () => {
    setForm({ ...form, ...draftData });
    setDraftData(null);
  };

  const handleNewProject = () => {
    removeDraftData();
    setForm(EMPTY_FORM);
    setDraftData(null);
  };

  // AI 서버가 10자 미만 아이디어를 거절하므로 미리 안내한다
  const ideaLength = form.ideaContent.trim().length;
  const isIdeaTooShort = ideaLength > 0 && ideaLength < MIN_IDEA_LENGTH;
  const canSubmit = form.ideaTitle.trim() && ideaLength >= MIN_IDEA_LENGTH;

  const handleSubmit = () => {
    saveProjectData({
      ideaTitle: form.ideaTitle,
      ideaContent: form.ideaContent,
      selectedStep: form.selectedStep,
      searchOption: form.searchOption,
    });
    removeDraftData();

    if (form.searchOption === "withSearch") {
      navigate("/explore");
    } else {
      setIsBMCSelectOpen(true);
    }
  };

  return (
    <WorkspaceLayout
      step="idea"
      header={
        <input
          value={form.ideaTitle}
          onChange={(e) => updateForm({ ideaTitle: e.target.value })}
          placeholder="아이디어 제목"
          aria-label="아이디어 제목"
          className="w-full text-2xl md:text-[28px] font-bold tracking-tight text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
        />
      }
      description="어떤 문제를, 누구를 위해, 어떻게 해결하는지 적어 주세요."
      actions={
        <>
          {isIdeaTooShort ? (
            <p className="text-sm text-red-500" role="status">
              아이디어를 {MIN_IDEA_LENGTH}자 이상 입력해 주세요. (지금 {ideaLength}자)
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              {bmcLimit &&
                `오늘 남은 횟수 · 탐색 ${bmcLimit.remainingSearch} · 생성 ${bmcLimit.remainingGeneration} · 분석 ${bmcLimit.remainingAnalysis}`}
            </p>
          )}

          <Button onClick={handleSubmit} disabled={!canSubmit} iconRight={ArrowRight}>
            다음
          </Button>
        </>
      }
    >
      <DraftRestoreModal
        open={!!draftData}
        onRestore={handleRestoreDraft}
        onNew={handleNewProject}
      />

      <div className="flex flex-col gap-8">
        <Textarea
          placeholder="예) 대학생들이 학기마다 비싼 전공서적을 사는 부담을 줄이기 위해, 같은 학교 학생끼리 학과별로 중고 책을 찾고 캠퍼스에서 직거래하는 앱"
          value={form.ideaContent}
          onChange={(ideaContent) => updateForm({ ideaContent })}
          rows={8}
          limit={1000}
          maxLimit={1500}
        />

        <OptionGroup
          label="지금 어느 단계인가요?"
          options={STEP_OPTIONS}
          value={form.selectedStep}
          onChange={(selectedStep) => updateForm({ selectedStep })}
          columns="grid-cols-2 md:grid-cols-4"
        />

        <OptionGroup
          label="어떻게 진행할까요?"
          options={SEARCH_OPTIONS}
          value={form.searchOption}
          onChange={(searchOption) => updateForm({ searchOption })}
          columns="grid-cols-1 md:grid-cols-2"
        />
      </div>

      <BMCSelectModal
        open={isBMCSelectOpen}
        onClose={() => setIsBMCSelectOpen(false)}
        onAI={() => navigate("/bmc/create")}
        onWrite={() => navigate("/bmc/analyze")}
      />
    </WorkspaceLayout>
  );
}

export default IdeaPage;
