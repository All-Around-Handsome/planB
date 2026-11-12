import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  ShieldCheck,
} from "lucide-react";

import { getBmcDetail } from "../api/bmc";

import WorkspaceLayout from "../layouts/WorkspaceLayout";
import Button from "../components/Button";
import BMCDisplayCanvas from "../components/BMCDisplayCanvas";

import { TERM_LABELS, formatDate, getIdeaTitle, itemsToBmc } from "../utils/bmc";
import { buildReportText, downloadReportPdf } from "../utils/bmcReport";

function BMCResultPage() {
  const navigate = useNavigate();
  const { bmcRecordId } = useParams();

  const [result, setResult] = useState({ id: null, bmc: null, error: "" });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    getBmcDetail(bmcRecordId)
      .then((response) => {
        if (ignore || !response) return;

        setResult({
          id: bmcRecordId,
          bmc: response.success ? response.data : null,
          error: response.success ? "" : "결과를 불러오지 못했어요.",
        });
      })
      .catch((error) => {
        console.error("BMC 조회 실패", error);

        if (!ignore) {
          setResult({
            id: bmcRecordId,
            bmc: null,
            error: "결과를 불러오지 못했어요.",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [bmcRecordId]);

  const isLoading = result.id !== bmcRecordId;
  const bmc = isLoading ? null : result.bmc;
  const error = isLoading ? "" : result.error;

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildReportText(bmc));
      showToast("복사했어요.");
    } catch (error) {
      console.error(error);
      showToast("복사하지 못했어요.");
    }
  };

  const handleDownload = () => {
    try {
      downloadReportPdf(bmc);
      showToast("PDF를 저장했어요.");
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      showToast("PDF를 만들지 못했어요.");
    }
  };

  const handleAnalyze = () => {
    navigate("/bmc/analyze", {
      state: {
        bmc: itemsToBmc(bmc.items),
        ideaTitle: getIdeaTitle(bmc.ideaText),
      },
    });
  };

  const hasAnalysis = bmc?.validityScore != null;

  return (
    <WorkspaceLayout
      step="result"
      title={bmc ? getIdeaTitle(bmc.ideaText) : "결과"}
      description={
        bmc &&
        [formatDate(bmc.createdAt), bmc.bmcType === "AI_GENERATED" ? "AI 생성" : "직접 작성", hasAnalysis && "분석 완료"]
          .filter(Boolean)
          .join(" · ")
      }
      headerRight={
        bmc && (
          <>
            <Button variant="secondary" size="sm" icon={Copy} onClick={handleCopy}>
              복사
            </Button>
            <Button variant="secondary" size="sm" icon={Download} onClick={handleDownload}>
              PDF
            </Button>
          </>
        )
      }
      actions={
        bmc && (
          <>
            <Button variant="ghost" iconRight={ArrowRight} onClick={() => navigate("/my")}>
              내 BMC 목록
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={hasAnalysis ? "primary" : "secondary"}
                icon={Edit3}
                onClick={() => navigate(`/bmc/edit/${bmc.bmcRecordId}`)}
              >
                수정
              </Button>
              {!hasAnalysis && (
                <Button variant="accent" icon={BarChart3} onClick={handleAnalyze}>
                  분석하기
                </Button>
              )}
            </div>
          </>
        )
      }
    >
      {isLoading && <ResultSkeleton />}

      {error && <p className="text-red-500">{error}</p>}

      {bmc && (
        <div className="flex flex-col gap-10">
          {hasAnalysis && <ScoreCard score={bmc.validityScore} reason={bmc.scoreReason} />}

          <section>
            <SectionTitle>비즈니스 모델 캔버스</SectionTitle>
            <BMCDisplayCanvas data={itemsToBmc(bmc.items)} />
          </section>

          {bmc.risks?.length > 0 && (
            <section>
              <SectionTitle count={bmc.risks.length}>리스크와 대응</SectionTitle>
              <ul className="grid md:grid-cols-2 gap-3">
                {bmc.risks.map((risk) => (
                  <li key={risk.riskId} className="rounded-xl border border-gray-200 p-5 flex flex-col gap-3 text-sm leading-6">
                    <p className="flex gap-2.5 font-semibold text-gray-900">
                      <AlertTriangle size={16} className="mt-1 shrink-0 text-amber-500" />
                      {risk.riskContent}
                    </p>
                    <p className="flex gap-2.5 text-gray-600">
                      <ShieldCheck size={16} className="mt-1 shrink-0 text-emerald-500" />
                      {risk.responseContent}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {bmc.actions?.length > 0 && (
            <section>
              <SectionTitle count={bmc.actions.length}>실행 계획</SectionTitle>
              <div className="grid md:grid-cols-3 gap-3">
                {["SHORT", "MID", "LONG"].map((term) => {
                  const items = bmc.actions.filter((action) => action.termType === term);
                  if (items.length === 0) return null;

                  return (
                    <div key={term} className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                      <p className="text-xs font-semibold text-gray-400 mb-3">{TERM_LABELS[term]}</p>
                      <ul className="flex flex-col gap-3">
                        {items.map((action) => (
                          <li key={action.actionId} className="flex gap-2.5 text-sm leading-6 text-gray-700">
                            <CheckCircle2 size={16} className="mt-1 shrink-0 text-gray-300" />
                            {action.actionContent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {toastMessage && (
        <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium shadow-lg animate-fade-up">
          {toastMessage}
        </div>
      )}
    </WorkspaceLayout>
  );
}

function SectionTitle({ children, count }) {
  return (
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-baseline gap-2">
      {children}
      {count != null && <span className="text-sm font-medium text-gray-400">{count}</span>}
    </h2>
  );
}

function ScoreCard({ score, reason }) {
  const tone = score >= 7 ? "text-emerald-600" : score >= 4 ? "text-amber-500" : "text-red-500";
  const bar = score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-400" : "bg-red-500";
  const label = score >= 7 ? "가능성 높음" : score >= 4 ? "보완 필요" : "재검토 필요";

  return (
    <section className="rounded-2xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
      <div className="shrink-0 md:w-40">
        <p className="text-xs font-semibold text-gray-400">타당성 점수</p>
        <p className="mt-2 flex items-baseline gap-1">
          <span className={`text-5xl font-bold tracking-tight tabular-nums ${tone}`}>{score}</span>
          <span className="text-lg font-semibold text-gray-300">/ 10</span>
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${score * 10}%` }} />
        </div>
        <p className={`mt-2 text-sm font-semibold ${tone}`}>{label}</p>
      </div>
      <p className="text-[15px] leading-7 text-gray-600 whitespace-pre-line">{reason}</p>
    </section>
  );
}

function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse" aria-label="불러오는 중">
      <div className="h-32 rounded-2xl bg-gray-100" />
      <div className="h-80 rounded-2xl bg-gray-100" />
    </div>
  );
}

export default BMCResultPage;
