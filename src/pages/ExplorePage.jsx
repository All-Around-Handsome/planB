import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PenLine, RotateCcw, Search } from "lucide-react";

import { getBmcLimit } from "../api/bmc";
import { searchCompetitors } from "../api/competitorApi";

import WorkspaceLayout from "../layouts/WorkspaceLayout";
import AILoading from "../components/AILoading";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import IdeaSummary from "../components/IdeaSummary";
import BMCSelectModal from "../components/BMCSelectModal";

import { getProjectData, saveProjectData } from "../utils/projectStorage";

function ExplorePage() {
  const navigate = useNavigate();

  const [project] = useState(() => getProjectData());
  const [competitors, setCompetitors] = useState(
    () => project?.exploreResult ?? null
  );

  const [bmcLimit, setBmcLimit] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isBMCSelectOpen, setIsBMCSelectOpen] = useState(false);

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
  const noneLeft = bmcLimit?.remainingSearch === 0;

  const handleExplore = async () => {
    setIsSearching(true);
    setError("");

    try {
      const result = await searchCompetitors(project.ideaContent);
      const found = result.competitors || [];

      setCompetitors(found);

      // 다시 들어와도 횟수를 또 쓰지 않도록 결과를 남긴다
      saveProjectData({ ...project, exploreResult: found });
    } catch (e) {
      console.error(e);

      if (e.status === 429) {
        setBmcLimit((prev) => prev && { ...prev, remainingSearch: 0 });
      }

      setError(
        e.status === 429
          ? "오늘 탐색 횟수를 모두 사용했어요."
          : "탐색하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <WorkspaceLayout
      step="explore"
      title={project?.ideaTitle || "경쟁 탐색"}
      description="AI가 비슷한 문제를 푸는 실제 서비스를 찾아 내 아이디어와 비교해요."
      actions={
        <>
          <Button variant="ghost" icon={RotateCcw} onClick={() => navigate("/idea")}>
            아이디어 수정
          </Button>
          <Button
            iconRight={ArrowRight}
            onClick={() => setIsBMCSelectOpen(true)}
            disabled={!hasIdea}
          >
            BMC 작성
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {hasIdea && <IdeaSummary text={project.ideaContent} />}

        {competitors ? (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                유사 서비스 <span className="text-accent">{competitors.length}</span>
              </h2>
              {competitors.length > 0 && (
                <p className="text-xs text-gray-400">AI가 찾은 결과라 실제와 다를 수 있어요</p>
              )}
            </div>

            {competitors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {competitors.map((service, index) => (
                  <CompetitorCard key={service.serviceName || index} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="비슷한 서비스를 찾지 못했어요"
                description="아이디어가 새롭거나 설명이 짧을 수 있어요. 바로 BMC를 작성해도 괜찮아요."
              />
            )}
          </section>
        ) : !hasIdea ? (
          <EmptyState
            icon={PenLine}
            title="먼저 아이디어를 입력해 주세요"
            action={<Button variant="secondary" onClick={() => navigate("/idea")}>아이디어 입력하기</Button>}
          />
        ) : isSearching ? (
          <div className="min-h-[300px] rounded-2xl border border-gray-200 flex items-center justify-center">
            <AILoading title="비슷한 서비스를 찾는 중이에요" description="20초 정도 걸려요." />
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="경쟁 서비스를 찾아볼까요?"
            description={bmcLimit ? `오늘 ${bmcLimit.remainingSearch}/${bmcLimit.searchLimit}회 남았어요.` : undefined}
            action={
              <>
                <Button variant="accent" icon={Search} onClick={handleExplore} disabled={noneLeft}>
                  경쟁 서비스 탐색
                </Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </>
            }
          />
        )}
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

function CompetitorCard({ service }) {
  const rows = [
    ["타겟 고객", service.targetCustomer],
    ["수익 모델", service.revenueModel],
    ["핵심 기능", service.coreFeatures],
  ].filter(([, value]) => value);

  return (
    <article className="rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900">{service.serviceName}</h3>
        {service.category && (
          <span className="shrink-0 h-6 px-2 rounded-md bg-gray-100 text-xs font-medium text-gray-500 flex items-center">
            {service.category}
          </span>
        )}
      </div>

      {service.differentiation && (
        <p className="text-sm leading-6 text-gray-700 rounded-xl bg-accent-soft/60 px-4 py-3">
          <span className="font-semibold text-accent">차별점 </span>
          {service.differentiation}
        </p>
      )}

      <dl className="flex flex-col gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="w-16 shrink-0 text-gray-400">{label}</dt>
            <dd className="text-gray-600 leading-6">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default ExplorePage;
