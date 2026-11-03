import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw, Search } from "lucide-react";

import { getBmcLimit } from "../api/bmc";
import { searchCompetitors } from "../api/competitorApi";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import AILoading from "../components/AILoading";
import CompetitorListPanel from "../components/CompetitorListPanel";
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
  const [isListOpen, setIsListOpen] = useState(false);

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
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="explore" />

          <main className="flex-1 min-w-0 flex flex-col self-stretch">
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {project?.ideaTitle || "경쟁 탐색"}
              </h1>
            </header>

            <div className="flex-1 px-12 py-8">
              <div className="max-w-[1120px] flex flex-col gap-6">
                {hasIdea && (
                  <p className="rounded-2xl bg-[#F8FAFF] p-6 text-[#071642] leading-7 whitespace-pre-line">
                    {project.ideaContent}
                  </p>
                )}

                {competitors ? (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        유사 서비스 {competitors.length}개
                      </h2>

                      {competitors.length > 0 && (
                        <button
                          onClick={() => setIsListOpen(true)}
                          className="text-sm font-bold text-blue-600 hover:underline"
                        >
                          자세히 보기
                        </button>
                      )}
                    </div>

                    {competitors.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {competitors.map((service, index) => (
                          <article
                            key={service.serviceName || index}
                            className="rounded-2xl border border-gray-200 p-5"
                          >
                            <h3 className="font-bold text-gray-900 mb-2">
                              {service.serviceName}
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6">
                              {service.differentiation}
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        비슷한 서비스를 찾지 못했어요.
                      </p>
                    )}
                  </section>
                ) : (
                  <div className="min-h-[320px] rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-5 text-center px-10">
                    {!hasIdea ? (
                      <>
                        <p className="text-gray-500">먼저 아이디어를 입력해 주세요.</p>
                        <Link to="/idea" className="font-bold text-blue-600">
                          아이디어 입력하기
                        </Link>
                      </>
                    ) : isSearching ? (
                      <AILoading title="비슷한 서비스를 찾는 중이에요" />
                    ) : (
                      <>
                        <button
                          onClick={handleExplore}
                          disabled={noneLeft}
                          className="h-12 px-8 rounded-xl bg-blue-600 text-white font-bold inline-flex items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Search size={18} />
                          경쟁 서비스 탐색
                        </button>

                        {bmcLimit && (
                          <p className="text-sm text-gray-500">
                            오늘 {bmcLimit.remainingSearch}/{bmcLimit.searchLimit}회 남음
                          </p>
                        )}

                        {error && <p className="text-sm text-red-500">{error}</p>}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-end gap-3 px-12 bg-white">
              <button
                onClick={() => navigate("/idea")}
                className="h-11 px-5 rounded-xl border border-blue-200 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 transition"
              >
                <RotateCcw size={18} />
                아이디어 수정
              </button>

              <button
                onClick={() => setIsBMCSelectOpen(true)}
                disabled={!hasIdea}
                className="h-11 px-6 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                BMC 작성
                <ArrowRight size={18} />
              </button>
            </footer>

            <CompetitorListPanel
              open={isListOpen}
              onClose={() => setIsListOpen(false)}
              services={competitors ?? []}
            />
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

export default ExplorePage;
