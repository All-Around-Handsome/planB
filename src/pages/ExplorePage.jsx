import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ThumbsUp,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";
import ExploreLoading from "../components/ExploreLoading";
import CompetitorListPanel from "../components/CompetitorListPanel";

function ExplorePage() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    ideaTitle: "",
    ideaContent: "",
    selectedStep: "idea",
    searchOption: "withSearch",
    exploreResult: null,
  });

  useEffect(() => {
    const savedProject = localStorage.getItem("planb_project");

    if (savedProject) {
      setProject({
        ...JSON.parse(savedProject),
        exploreResult: null,
      });
    }
  }, []);

  const [isSearching, setIsSearching] = useState(false);

  const [hasExploreResult, setHasExploreResult] = useState(
    project.exploreResult !== null
  );

  const [isListOpen, setIsListOpen] = useState(false);

  const competitors = [
    {
      title: "유사 서비스 1",
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "유사 서비스 2",
      color: "text-green-600 bg-green-50 border-green-100",
    },
    {
      title: "유사 서비스 3",
      color: "text-gray-700 bg-gray-100 border-gray-200",
    },
    {
      title: "유사 서비스 4",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
  ];

  const insights = [
    {
      icon: <ThumbsUp size={34} strokeWidth={1.8} />,
      title: "AI가 도출한 시장 기회",
      desc: "현재 프로젝트 아이디어를 기준으로 시장 기회 요약이 표시됩니다.",
    },
    {
      icon: <TrendingUp size={34} strokeWidth={1.8} />,
      title: "AI가 도출한 핵심 니즈",
      desc: "유사 서비스 분석을 바탕으로 고객 니즈 요약이 표시됩니다.",
    },
    {
      icon: <Lightbulb size={34} strokeWidth={1.8} />,
      title: "AI가 도출한 차별화 방향",
      desc: "경쟁 서비스와 비교한 차별화 전략이 표시됩니다.",
    },
  ];

  const similarServices = [
    { name: "유사 서비스 1" },
    { name: "유사 서비스 2" },
    { name: "유사 서비스 3" },
    { name: "유사 서비스 4" },
    { name: "유사 서비스 5" },
    { name: "유사 서비스 6" },
  ];
  const previewServices = similarServices.slice(0, 3);
  const hiddenServiceCount = similarServices.length - previewServices.length;

  const handleExplore = () => {
    /**
     * 지금은 디자인 확인용
     * 나중에는 현재 projectId + ideaContent를 백엔드/AI로 보내면 됨
     */
    setIsSearching(true);
  };

  const handlePrev = () => {
    navigate("/idea");
  };

  const handleNext = () => {
    navigate("/bmc/create");
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="explore" />

          <ProjectNav />

          <main className="flex-1 flex flex-col self-stretch">
            {/* 상단 헤더: IdeaPage의 ideaTitle이 이어지는 영역 */}
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.ideaTitle || "아이디어 제목 입력"}
              </h1>
            </header>

            <div className="flex-1 px-12 pt-8 pb-8">
              <div className="max-w-[1120px] h-full flex flex-col">
                {/* 1. 현재 프로젝트 아이디어 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    1. 현재 프로젝트 아이디어
                  </h2>

                  <div className="rounded-2xl border-2 border-blue-400 bg-white p-6 shadow-sm">
                    <p className="text-base font-medium text-[#071642] leading-7 whitespace-pre-line">
                      {project.ideaContent || "입력된 아이디어 내용이 없습니다."}
                    </p>
                  </div>
                </section>

                {!hasExploreResult ? (
                  <section className="flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      2. 경쟁 서비스 탐색
                    </h2>

                    <div
                      className="
                        flex-1
                        min-h-[360px]
                        rounded-2xl
                        border
                        border-gray-200
                        bg-[#F8FAFF]
                        px-10
                        py-14
                        text-center
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >
                      {isSearching ? (
                        <ExploreLoading
                          duration={3000}
                          onComplete={() => {
                            setIsSearching(false);
                            setHasExploreResult(true);
                          }}
                        />
                      ) : (
                        <>
                          <div
                            className="
                              w-20 h-20
                              rounded-full
                              bg-blue-50
                              text-blue-500
                              flex
                              items-center
                              justify-center
                              mx-auto
                              mb-6
                            "
                          >
                            <Search size={38} strokeWidth={1.8} />
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            아직 경쟁 서비스 탐색 결과가 없습니다
                          </h3>

                          <p className="text-[#3D4770] text-base leading-7 mb-8">
                            이 프로젝트는 아직 경쟁 서비스 탐색을 진행하지 않았습니다.
                            <br />
                            현재 입력된 아이디어를 기준으로 유사 서비스와 시장을 분석할 수 있습니다.
                          </p>

                          <button
                            onClick={handleExplore}
                            className="
                              h-12
                              px-8
                              rounded-xl
                              bg-blue-600
                              text-white
                              font-bold
                              inline-flex
                              items-center
                              gap-2
                              hover:bg-blue-700
                              active:scale-[0.98]
                              transition
                            "
                          >
                            <Sparkles size={18} />
                            경쟁 서비스 탐색하기
                          </button>
                        </>
                      )}
                    </div>
                  </section>
                ) : (
                  <>
                    {/* 2. 유사 서비스 분석 결과 */}
                    <section className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">
                        2. 유사 서비스 분석 결과
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-[#3D4770] mb-4">
                        <Sparkles size={18} className="text-blue-500" />
                        <span>
                          AI가 현재 프로젝트의 아이디어와 유사한 경쟁 서비스를 분석했습니다.
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_54px_340px] gap-5 items-center">
                        <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] p-6">
                          <div className="flex items-center justify-between gap-4 mb-5">
                            <div className="flex items-center gap-2">
                              <Search size={18} className="text-blue-500" />
                              <h3 className="text-base font-bold text-gray-900">
                                유사 서비스 리스트 요약
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsListOpen(true)}
                              className="
                                h-9
                                px-4
                                rounded-lg
                                border
                                border-blue-200
                                bg-white
                                text-blue-600
                                text-sm
                                font-bold
                                hover:bg-blue-50
                                active:scale-[0.98]
                                transition
                              "
                            >
                              전체 리스트 보기
                            </button>
                          </div>

                          {/* 유사 서비스 태그: 최대 3개 + 나머지 개수 */}
                          {similarServices.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {previewServices.map((service, index) => (
                                <span
                                  key={service.name || index}
                                  className="
                                    px-3
                                    py-2
                                    rounded-full
                                    border
                                    text-sm
                                    font-bold
                                    text-blue-600
                                    bg-blue-50
                                    border-blue-100
                                  "
                                >
                                  {service.name || `유사 서비스 ${index + 1}`}
                                </span>
                              ))}

                              {hiddenServiceCount > 0 && (
                                <span
                                  className="
                                    px-3
                                    py-2
                                    rounded-full
                                    border
                                    text-sm
                                    font-bold
                                    text-gray-600
                                    bg-gray-50
                                    border-gray-200
                                  "
                                >
                                  +{hiddenServiceCount}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="mb-5 rounded-xl bg-white border border-gray-100 px-5 py-4">
                              <p className="text-sm text-[#3D4770]">
                                AI가 탐색한 유사 서비스가 없는 경우 이 문구가 표시됩니다.
                              </p>
                            </div>
                          )}

                          {/* AI 요약 */}
                          <div className="rounded-xl bg-white border border-gray-100 p-5">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">
                              AI 유사 서비스 요약
                            </h4>

                            <ul className="space-y-2 text-sm text-[#3D4770] leading-6">
                              <li>유사 서비스들의 공통 특징 요약이 표시됩니다.</li>
                              <li>현재 프로젝트와 비교했을 때 부족한 기능이나 한계점이 표시됩니다.</li>
                              <li>BMC 생성 과정에서 참고할 수 있는 경쟁 구조 요약이 표시됩니다.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500 font-bold shadow-sm">
                            VS
                          </div>
                        </div>

                        <div className="rounded-2xl border-2 border-blue-500 bg-white overflow-hidden shadow-sm">
                          <div className="h-11 bg-blue-600 text-white flex items-center px-5 gap-2 font-bold">
                            <Sparkles size={18} />
                            유사 서비스와 차별점
                          </div>

                          <div className="p-5">
                            <div className="flex gap-3 mb-4">
                              <CheckCircle2
                                size={22}
                                className="text-blue-500 shrink-0 mt-1"
                              />

                              <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                  AI가 분석한 차별점 1
                                </h4>
                                <p className="text-sm text-gray-500 leading-6">
                                  현재 프로젝트가 유사 서비스와 비교해 가지는 차별점 설명이 표시됩니다.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3 mb-4">
                              <CheckCircle2
                                size={22}
                                className="text-blue-500 shrink-0 mt-1"
                              />

                              <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                  AI가 분석한 차별점 2
                                </h4>
                                <p className="text-sm text-gray-500 leading-6">
                                  기능, 사용자 경험, 시장 접근 방식 등의 비교 분석 결과가 표시됩니다.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <CheckCircle2
                                size={22}
                                className="text-blue-500 shrink-0 mt-1"
                              />

                              <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                  AI가 분석한 차별점 3
                                </h4>
                                <p className="text-sm text-gray-500 leading-6">
                                  BMC 생성 과정에서 활용할 수 있는 전략적 차별화 포인트가 표시됩니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* 3. 인사이트 요약 */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        3. 인사이트 요약
                      </h2>

                      <div className="grid grid-cols-3 gap-5">
                        {insights.map((item) => (
                          <div
                            key={item.title}
                            className="h-[125px] rounded-2xl border border-gray-200 bg-white px-6 flex items-center gap-5 shadow-sm"
                          >
                            <div className="text-blue-500 shrink-0">
                              {item.icon}
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-gray-900 mb-2">
                                {item.title}
                              </h3>

                              <p className="text-sm text-[#3D4770] leading-6">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>

            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-end px-12 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="
                    h-11
                    px-6
                    rounded-xl
                    border
                    border-blue-200
                    text-blue-600
                    font-bold
                    flex
                    items-center
                    gap-2
                    hover:bg-blue-50
                    active:scale-[0.98]
                    transition
                  "
                >
                  <RotateCcw size={18} />
                  아이디어로 돌아가기
                </button>

                <button
                  onClick={handleNext}
                  className="
                    h-11
                    px-7
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-bold
                    flex
                    items-center
                    gap-2
                    hover:bg-blue-700
                    active:scale-[0.98]
                    transition
                  "
                >
                  BMC 생성으로 이동
                  <ArrowRight size={18} />
                </button>
              </div>
            </footer>
            <CompetitorListPanel
              open={isListOpen}
              onClose={() => setIsListOpen(false)}
              services={similarServices}
            />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default ExplorePage;