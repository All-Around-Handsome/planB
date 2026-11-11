import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Target,
  FileText,
  Sparkles,
} from "lucide-react";

import { getBmcLimit } from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
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
  { id: "withSearch", icon: Target, title: "경쟁 탐색 후 작성" },
  { id: "withoutSearch", icon: FileText, title: "바로 작성" },
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
      <h2 className="text-sm font-bold text-gray-900 mb-3">{label}</h2>

      <div className={`grid gap-3 ${columns}`}>
        {options.map(({ id, icon: Icon, title }) => {
          const active = value === id;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(id)}
              className={`
                h-14
                rounded-xl
                border
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-bold
                transition
                ${
                  active
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-700 hover:border-blue-300"
                }
              `}
            >
              <Icon size={18} />
              {title}
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
    <MainLayout>
      <DraftRestoreModal
        open={!!draftData}
        onRestore={handleRestoreDraft}
        onNew={handleNewProject}
      />
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="idea" />

          <main className="flex-1 min-w-0 flex flex-col">
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <input
                value={form.ideaTitle}
                onChange={(e) => updateForm({ ideaTitle: e.target.value })}
                placeholder="아이디어 제목"
                className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </header>

            <div className="flex-1 px-12 py-8">
              <div className="max-w-[1120px] flex flex-col gap-6">
                <Textarea
                  placeholder="어떤 문제를, 누구를 위해, 어떻게 해결하나요?"
                  value={form.ideaContent}
                  onChange={(ideaContent) => updateForm({ ideaContent })}
                  rows={10}
                  limit={1000}
                  maxLimit={1500}
                />

                <OptionGroup
                  label="진행 단계"
                  options={STEP_OPTIONS}
                  value={form.selectedStep}
                  onChange={(selectedStep) => updateForm({ selectedStep })}
                  columns="grid-cols-4"
                />

                <OptionGroup
                  label="경쟁 탐색"
                  options={SEARCH_OPTIONS}
                  value={form.searchOption}
                  onChange={(searchOption) => updateForm({ searchOption })}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-between px-12 bg-white">
              {isIdeaTooShort ? (
                <p className="text-sm text-red-500" role="status">
                  아이디어를 {MIN_IDEA_LENGTH}자 이상 입력해 주세요. (지금 {ideaLength}자)
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {bmcLimit &&
                    `오늘 남은 횟수: 탐색 ${bmcLimit.remainingSearch} · 생성 ${bmcLimit.remainingGeneration} · 분석 ${bmcLimit.remainingAnalysis}`}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="h-12 px-8 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Sparkles size={20} />
                다음
              </button>
            </footer>

            <BMCSelectModal
              open={isBMCSelectOpen}
              onClose={() => setIsBMCSelectOpen(false)}
              onAI={() => navigate("/bmc/create")}
              onWrite={() => navigate("/bmc/analyze")}
            />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default IdeaPage;
