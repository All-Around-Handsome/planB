import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import {
  getBmcLimit,
  saveBmcAnalysis,
} from "../api/bmc";
import { analyzeBmc } from "../api/bmcAi";

import WorkspaceLayout from "../layouts/WorkspaceLayout";
import Button from "../components/Button";
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
    <WorkspaceLayout
      step="analyze"
      header={
        <input
          value={ideaTitle}
          onChange={(e) => setIdeaTitle(e.target.value)}
          placeholder="BMC 제목"
          aria-label="BMC 제목"
          className="w-full text-2xl md:text-[28px] font-bold tracking-tight text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
        />
      }
      description="BMC를 채우면 AI가 타당성 점수, 리스크, 실행 계획을 알려 줘요."
      actions={
        <>
          <p className={`text-sm ${error ? "text-red-500" : "text-gray-400"}`}>
            {error ||
              (!isReady
                ? "가치 제안과 고객 세그먼트는 꼭 입력해 주세요."
                : bmcLimit
                  ? `오늘 ${bmcLimit.remainingAnalysis}/${bmcLimit.analysisLimit}회 남음`
                  : "")}
          </p>

          <Button
            variant="accent"
            icon={Sparkles}
            onClick={handleAnalyze}
            disabled={!isReady || isAnalyzing || noneLeft}
          >
            분석하기
          </Button>
        </>
      }
    >
      {isAnalyzing ? (
        <div className="min-h-[420px] rounded-2xl border border-gray-200 flex items-center justify-center">
          <AILoading title="BMC를 분석하는 중이에요" description="40초~1분 정도 걸려요. 화면을 닫지 말아 주세요." />
        </div>
      ) : (
        <BMCDisplayCanvas data={bmc} onChange={handleChange} />
      )}
    </WorkspaceLayout>
  );
}

export default BMCAnalyzePage;
