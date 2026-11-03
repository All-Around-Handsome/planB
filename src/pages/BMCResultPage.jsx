import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Copy,
  Download,
  Edit3,
} from "lucide-react";

import { getBmcDetail } from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
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
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="result" />

          <main className="flex-1 min-w-0 flex flex-col self-stretch">
            <header className="h-[72px] border-b border-gray-200 flex items-center justify-between gap-6 px-12">
              <div className="min-w-0 flex items-baseline gap-3">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {bmc ? getIdeaTitle(bmc.ideaText) : "결과"}
                </h1>

                {bmc && (
                  <span className="text-sm text-gray-400 shrink-0">
                    {formatDate(bmc.createdAt)}
                  </span>
                )}
              </div>

              {bmc && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition"
                  >
                    <Copy size={16} />
                    복사
                  </button>

                  <button
                    onClick={handleDownload}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition"
                  >
                    <Download size={16} />
                    PDF
                  </button>
                </div>
              )}
            </header>

            <div className="flex-1 px-12 py-8">
              {isLoading && <p className="text-gray-500">불러오는 중...</p>}

              {error && <p className="text-red-500">{error}</p>}

              {bmc && (
                <div className="max-w-[1120px] flex flex-col gap-8">
                  {hasAnalysis && (
                    <section className="flex items-center gap-6 rounded-2xl bg-[#F8FAFF] p-6">
                      <div className="shrink-0 flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-blue-600">
                          {bmc.validityScore}
                        </span>
                        <span className="text-lg font-bold text-gray-400">
                          / 10
                        </span>
                      </div>

                      <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                        {bmc.scoreReason}
                      </p>
                    </section>
                  )}

                  <BMCDisplayCanvas data={itemsToBmc(bmc.items)} />

                  {bmc.risks?.length > 0 && (
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">
                        리스크와 대응
                      </h2>

                      <ul className="divide-y divide-gray-100 border-y border-gray-100">
                        {bmc.risks.map((risk) => (
                          <li key={risk.riskId} className="grid grid-cols-2 gap-6 py-3 text-sm leading-6">
                            <span className="font-bold text-gray-900">
                              {risk.riskContent}
                            </span>
                            <span className="text-[#3D4770]">
                              {risk.responseContent}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {bmc.actions?.length > 0 && (
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">
                        실행 항목
                      </h2>

                      <ul className="flex flex-col gap-2">
                        {bmc.actions.map((action) => (
                          <li key={action.actionId} className="flex items-start gap-3 text-sm leading-6">
                            <span className="shrink-0 px-2 rounded-md bg-blue-50 text-blue-600 font-bold">
                              {TERM_LABELS[action.termType] || action.termType}
                            </span>
                            <span className="text-[#3D4770]">
                              {action.actionContent}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-end gap-3 px-12 bg-white">
              {bmc && (
                <button
                  onClick={() => navigate(`/bmc/edit/${bmc.bmcRecordId}`)}
                  className="h-11 px-5 rounded-xl border border-blue-200 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 transition"
                >
                  <Edit3 size={18} />
                  수정
                </button>
              )}

              {bmc && !hasAnalysis && (
                <button
                  onClick={handleAnalyze}
                  className="h-11 px-5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <BarChart3 size={18} />
                  분석하기
                </button>
              )}

              <button
                onClick={() => navigate("/my")}
                className="h-11 px-5 rounded-xl border border-gray-200 text-gray-600 font-bold flex items-center gap-2 hover:bg-gray-50 transition"
              >
                내 프로젝트
                <ArrowRight size={18} />
              </button>
            </footer>
          </main>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] rounded-full bg-[#071642] text-white px-6 py-3 text-sm font-bold shadow-[0_12px_32px_rgba(15,23,42,0.24)]">
          {toastMessage}
        </div>
      )}
    </MainLayout>
  );
}

export default BMCResultPage;
