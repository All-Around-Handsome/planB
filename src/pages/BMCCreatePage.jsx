import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, Sparkles } from "lucide-react";

import { generateBmc } from "../api/bmcAi";
import {
  getBmcLimit,
  saveGeneratedBmc,
} from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import AILoading from "../components/AILoading";

import { getProjectData, saveProjectData } from "../utils/projectStorage";
import {
  STAGE_CODES,
  STAGE_LABELS,
  bmcToItems,
  buildIdeaText,
} from "../utils/bmc";

function BMCCreatePage() {
  const navigate = useNavigate();

  const [project] = useState(() => getProjectData());
  const [bmcLimit, setBmcLimit] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBmcLimit()
      .then((response) => {
        if (response?.success) {
          setBmcLimit(response.data);
        }
      })
      .catch((error) => console.error("사용 횟수 조회 실패", error));
  }, []);

  const hasIdea = !!project?.ideaContent?.trim();
  const noneLeft = bmcLimit?.remainingGeneration === 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const aiResult = await generateBmc({
        idea: project.ideaContent,
        stage: STAGE_LABELS[project.selectedStep],
        useCompetitorContext: project.searchOption === "withSearch",
        // 경쟁 탐색에서 받은 결과를 넘겨 AI가 같은 서비스를 다시 찾지 않게 한다
        competitors: project.exploreResult?.slice(0, 10),
      });

      const saved = await saveGeneratedBmc({
        ideaText: buildIdeaText(project.ideaTitle, project.ideaContent),
        stage: STAGE_CODES[project.selectedStep],
        bmcType: "AI_GENERATED",
        items: bmcToItems(aiResult),
      });

      if (!saved?.success) {
        setError("생성한 BMC를 저장하지 못했어요.");
        return;
      }

      const id = saved.data.bmcRecordId;

      saveProjectData({ ...project, lastBmcRecordId: id });
      navigate(`/bmc/result/${id}`);
    } catch (error) {
      console.error("BMC 생성 실패", error);

      if (error.status === 429) {
        setBmcLimit((prev) => prev && { ...prev, remainingGeneration: 0 });
      }

      setError(
        error.status === 429
          ? "오늘 생성 횟수를 모두 사용했어요."
          : "BMC를 생성하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="create" />

          <main className="flex-1 min-w-0 flex flex-col self-stretch">
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {project?.ideaTitle || "BMC 생성"}
              </h1>
            </header>

            <div className="flex-1 px-12 py-8">
              <div className="max-w-[1120px] flex flex-col gap-6">
                {hasIdea && (
                  <p className="rounded-2xl bg-[#F8FAFF] p-6 text-[#071642] leading-7 whitespace-pre-line">
                    {project.ideaContent}
                  </p>
                )}

                <div className="min-h-[320px] rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-5 text-center px-10">
                  {!hasIdea ? (
                    <>
                      <p className="text-gray-500">먼저 아이디어를 입력해 주세요.</p>
                      <Link to="/idea" className="font-bold text-blue-600">
                        아이디어 입력하기
                      </Link>
                    </>
                  ) : isGenerating ? (
                    <AILoading title="BMC를 만드는 중이에요" />
                  ) : (
                    <>
                      <button
                        onClick={handleGenerate}
                        disabled={noneLeft}
                        className="h-12 px-8 rounded-xl bg-blue-600 text-white font-bold inline-flex items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={18} />
                        BMC 생성
                      </button>

                      {bmcLimit && (
                        <p className="text-sm text-gray-500">
                          오늘 {bmcLimit.remainingGeneration}/{bmcLimit.generationLimit}회 남음
                        </p>
                      )}

                      {error && <p className="text-sm text-red-500">{error}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-end px-12 bg-white">
              <button
                onClick={() => navigate("/idea")}
                className="h-11 px-5 rounded-xl border border-blue-200 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 transition"
              >
                <RotateCcw size={18} />
                아이디어 수정
              </button>
            </footer>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default BMCCreatePage;
