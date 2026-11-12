import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, RotateCcw, Sparkles } from "lucide-react";

import { generateBmc } from "../api/bmcAi";
import {
  getBmcLimit,
  saveGeneratedBmc,
} from "../api/bmc";

import WorkspaceLayout from "../layouts/WorkspaceLayout";
import AILoading from "../components/AILoading";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import IdeaSummary from "../components/IdeaSummary";

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

  const stageLabel = STAGE_LABELS[project?.selectedStep];
  const withSearch = project?.searchOption === "withSearch";
  const competitorCount = project?.exploreResult?.length ?? 0;

  return (
    <WorkspaceLayout
      step="create"
      title={project?.ideaTitle || "BMC 생성"}
      description="아이디어를 바탕으로 AI가 비즈니스 모델 캔버스 9개 블록을 채워요."
      actions={
        <>
          <Button variant="ghost" icon={RotateCcw} onClick={() => navigate("/idea")}>
            아이디어 수정
          </Button>
          <span />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {hasIdea && <IdeaSummary text={project.ideaContent} />}

        {!hasIdea ? (
          <EmptyState
            icon={PenLine}
            title="먼저 아이디어를 입력해 주세요"
            action={<Button variant="secondary" onClick={() => navigate("/idea")}>아이디어 입력하기</Button>}
          />
        ) : isGenerating ? (
          <div className="min-h-[300px] rounded-2xl border border-gray-200 flex items-center justify-center">
            <AILoading title="BMC를 만드는 중이에요" description="40초~1분 정도 걸려요. 화면을 닫지 말아 주세요." />
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="AI로 BMC를 만들어 볼까요?"
            description={[
              stageLabel && `진행 단계: ${stageLabel}`,
              withSearch && competitorCount > 0 && `유사 서비스 ${competitorCount}개 참고`,
              bmcLimit && `오늘 ${bmcLimit.remainingGeneration}/${bmcLimit.generationLimit}회 남음`,
            ]
              .filter(Boolean)
              .join(" · ")}
            action={
              <>
                <Button variant="accent" icon={Sparkles} onClick={handleGenerate} disabled={noneLeft}>
                  BMC 생성하기
                </Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </>
            }
          />
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default BMCCreatePage;
