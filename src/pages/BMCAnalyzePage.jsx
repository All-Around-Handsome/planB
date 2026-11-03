import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import {
  getBmcLimit,
  saveBmcAnalysis,
} from "../api/bmc";
import { analyzeBmc } from "../api/bmcAi";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import AILoading from "../components/AILoading";
import BMCDisplayCanvas from "../components/BMCDisplayCanvas";

import { getProjectData, saveProjectData } from "../utils/projectStorage";
import { EMPTY_BMC, STAGE_CODES, bmcToItems } from "../utils/bmc";

const TERM_TYPES = {
  단기: "SHORT",
  중기: "MID",
  장기: "LONG",
};

function BMCAnalyzePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [project] = useState(() => getProjectData());
  const [ideaTitle, setIdeaTitle] = useState(
    () => state?.ideaTitle ?? project?.ideaTitle ?? ""
  );
  const [bmc, setBmc] = useState(() => state?.bmc ?? EMPTY_BMC);

  const [bmcLimit, setBmcLimit] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleChange = (key, value) => {
    setBmc((prev) => ({ ...prev, [key]: value }));
  };

  const isReady =
    bmc.valueProposition.trim() && bmc.customerSegments.trim();
  const noneLeft = bmcLimit?.remainingAnalysis === 0;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError("");

    try {
      const analyzeResult = await analyzeBmc(bmc);

      const saved = await saveBmcAnalysis({
        ideaText: ideaTitle.trim(),
        stage: STAGE_CODES[project?.selectedStep] || "VALIDATION",
        items: bmcToItems(bmc),
        validityScore: analyzeResult.viabilityScore,
        scoreReason: analyzeResult.scoreRationale,
        risks: analyzeResult.risks.map((risk) => ({
          riskContent: risk.risk,
          responseContent: risk.mitigation,
        })),
        actions: analyzeResult.actionItems.map((item) => ({
          actionContent: item.action,
          termType: TERM_TYPES[item.term] || "LONG",
        })),
      });

      if (!saved?.success) {
        setError("분석 결과를 저장하지 못했어요.");
        return;
      }

      const id = saved.data.bmcRecordId;

      saveProjectData({ ...project, lastBmcRecordId: id });
      navigate(`/bmc/analyze/result/${id}`);
    } catch (error) {
      console.error("BMC 분석 실패", error);

      if (error.status === 429) {
        setBmcLimit((prev) => prev && { ...prev, remainingAnalysis: 0 });
      }

      setError(
        error.status === 429
          ? "오늘 분석 횟수를 모두 사용했어요."
          : "분석하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="analyze" />

          <main className="flex-1 min-w-0 flex flex-col self-stretch">
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="제목"
                className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </header>

            <div className="flex-1 px-12 py-8">
              <div className="max-w-[1120px]">
                {isAnalyzing ? (
                  <div className="min-h-[420px] flex items-center justify-center">
                    <AILoading title="BMC를 분석하는 중이에요" />
                  </div>
                ) : (
                  <BMCDisplayCanvas data={bmc} onChange={handleChange} />
                )}
              </div>
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-between gap-6 px-12 bg-white">
              <p className={`text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
                {error ||
                  (!isReady
                    ? "가치 제안과 고객 세그먼트를 입력해 주세요."
                    : bmcLimit
                    ? `오늘 ${bmcLimit.remainingAnalysis}/${bmcLimit.analysisLimit}회 남음`
                    : "")}
              </p>

              <button
                onClick={handleAnalyze}
                disabled={!isReady || isAnalyzing || noneLeft}
                className="h-11 px-6 shrink-0 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Sparkles size={18} />
                분석하기
              </button>
            </footer>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default BMCAnalyzePage;
