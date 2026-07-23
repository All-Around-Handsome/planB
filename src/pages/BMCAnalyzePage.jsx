import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { getBmcLimit } from "../api/bmc";
import { checkAnalysis } from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";
import BMCAnalyzeLoading from "../components/BMCAnalyzeLoading";

import { getProjectData } from "../utils/projectStorage";

function BMCAnalyzePage() {
  const navigate = useNavigate();

  /**
   * 지금은 프론트 디자인용 임시 프로젝트 데이터
   * 나중에는 백엔드에서 현재 projectId 기준으로 받아오면 됨
   */
  const project = {
    ideaTitle: "아이디어 페이지에서 입력한 제목이 표시됩니다",
    bmc: {
      valueProposition:
        "고객이 겪는 문제를 해결할 수 있는 핵심 가치를 제공합니다.",
      customerSegments:
        "서비스의 주요 고객층과 초기 타겟 사용자를 정의합니다.",
      revenueStreams:
        "서비스 이용료, 구독료, 광고 수익 등 수익 발생 구조를 정리합니다.",
      costStructure:
        "서비스 운영, 개발, 마케팅에 필요한 주요 비용을 정리합니다.",
      keyPartners:
        "서비스 운영과 성장을 위해 협력할 수 있는 외부 파트너를 정리합니다.",
      keyActivities:
        "서비스 제공을 위해 반드시 수행해야 하는 핵심 활동을 정리합니다.",
      keyResources:
        "서비스 운영에 필요한 기술, 인력, 데이터, 브랜드 자산을 정리합니다.",
      channels:
        "고객에게 서비스를 전달하고 홍보할 수 있는 채널을 정리합니다.",
      customerRelationships:
        "고객과의 관계를 유지하고 재방문을 유도하는 방식을 정리합니다.",
    },
    analysisResult: null,
  };

  const [activeSection, setActiveSection] = useState(null);

  const getCardClass = (section) =>
    `
      rounded-2xl
      bg-white
      p-5
      shadow-sm
      transition-all
      duration-200
      border
      ${
        activeSection === section
          ? "border-blue-500 ring-2 ring-blue-100 shadow-md"
          : "border-gray-200"
      }
    `;

  const handleFocus = (section) => setActiveSection(section);
  const handleBlur = () => setActiveSection(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzeResult, setHasAnalyzeResult] = useState(
    project.analysisResult !== null
  );

  const [bmcLimit, setBmcLimit] = useState(null);

  const bmcItems = [
    {
      title: "가치 제안",
      content: project.bmc.valueProposition,
    },
    {
      title: "고객 세그먼트",
      content: project.bmc.customerSegments,
    },
    {
      title: "수익 구조",
      content: project.bmc.revenueStreams,
    },
    {
      title: "비용 구조",
      content: project.bmc.costStructure,
    },
    {
      title: "핵심 파트너",
      content: project.bmc.keyPartners,
    },
    {
      title: "핵심 활동",
      content: project.bmc.keyActivities,
    },
    {
      title: "핵심 자원",
      content: project.bmc.keyResources,
    },
    {
      title: "채널",
      content: project.bmc.channels,
    },
    {
      title: "고객 관계",
      content: project.bmc.customerRelationships,
    },
  ];

  const strengthItems = [
    {
      icon: <CheckCircle2 size={24} />,
      title: "핵심 가치가 명확합니다",
      desc: "고객 문제와 제공 가치가 비교적 분명하게 연결되어 있습니다.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "시장 확장 가능성이 있습니다",
      desc: "초기 고객층을 기준으로 점진적인 확장 전략을 세울 수 있습니다.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "운영 구조를 설계하기 좋습니다",
      desc: "핵심 활동과 자원이 구분되어 실행 계획으로 연결하기 쉽습니다.",
    },
  ];

  const improveItems = [
    {
      icon: <AlertTriangle size={24} />,
      title: "수익 구조 구체화 필요",
      desc: "수익 발생 시점과 결제 방식이 더 구체적으로 정리되면 좋습니다.",
    },
    {
      icon: <Lightbulb size={24} />,
      title: "차별화 포인트 보완 필요",
      desc: "경쟁 서비스와 비교했을 때 사용자가 선택할 이유를 더 명확히 해야 합니다.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "고객 관계 전략 보완 필요",
      desc: "고객 유지, 재방문, 피드백 수집 방식이 추가되면 완성도가 높아집니다.",
    },
  ];

  const handleAnalyze = () => {
    /**
     * 지금은 디자인 확인용
     * 나중에는 현재 projectId + bmc 데이터를 백엔드/AI로 보내면 됨
     */
    setIsAnalyzing(true);
  };

  const handlePrev = () => {
    setIsAnalyzing(false);
    setHasAnalyzeResult(false);
  };

  const handleNext = () => {
    navigate("/bmc/analyze/result");
  };

  const [ideaTitle, setIdeaTitle] = useState("");

  useEffect(() => {
    const savedProject = getProjectData();

    if (savedProject) {
      setIdeaTitle(savedProject.ideaTitle);
    }

    async function fetchBmcLimit() {
      try {
        const response = await getBmcLimit();

        if (response.success) {
          setBmcLimit(response.data);
        }
      } catch (error) {
        console.error("사용 횟수 조회 실패", error);
      }
    }

    fetchBmcLimit();
  }, []);

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="analyze" />

          <ProjectNav />

          <main className="flex-1 flex flex-col self-stretch">
            {/* 상단 헤더 */}
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <h1 className="text-2xl font-bold text-gray-900">
                {ideaTitle || "아이디어 제목 입력"}
              </h1>
            </header>

            {/* 콘텐츠 */}
            <div className="flex-1 px-12 pt-8 pb-8">
              <div className="max-w-[1120px] h-full flex flex-col">
                {/* 1. 생성된 BMC 요약 (기존 BMC UI)*/}
                {/*
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      1. 생성된 BMC 요약
                    </h2>

                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                      분석 대상
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {bmcItems.map((item) => (
                      <div
                        key={item.title}
                        className="
                          min-h-[135px]
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                        "
                      >
                        <h3 className="text-base font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>

                        <p className="text-sm text-[#3D4770] leading-6">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
                */}

                {/* 1. BMC 직접 작성 */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      1. BMC 직접 작성
                    </h2>

                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                      분석 대상
                    </span>
                  </div>

                  {/* BMC Canvas UI */}
                  <div className="rounded-3xl border border-gray-200 bg-[#F8FAFF] p-6 shadow-sm">
                    {/* 상단 5열 영역 */}
                    <div className="grid grid-cols-5 gap-4 h-[430px]">
                      {/* Key Partners */}
                      <div className={getCardClass("keyPartners")}>
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                          핵심 파트너
                        </h3>

                        <textarea
                          placeholder="핵심 파트너를 입력하세요"
                          onFocus={() => handleFocus("keyPartners")}
                          onBlur={handleBlur}
                          className="w-full h-[320px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                        />
                      </div>

                      {/* Key Activities + Key Resources */}
                      <div className="grid grid-rows-2 gap-4">
                        <div className={getCardClass("keyActivities")}>
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            핵심 활동
                          </h3>

                          <textarea
                            placeholder="핵심 활동을 입력하세요"
                            onFocus={() => handleFocus("keyActivities")}
                            onBlur={handleBlur}
                            className="w-full h-[120px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                          />
                        </div>

                        <div className={getCardClass("keyResources")}>
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            핵심 자원
                          </h3>

                          <textarea
                            placeholder="핵심 자원을 입력하세요"
                            onFocus={() => handleFocus("keyResources")}
                            onBlur={handleBlur}
                            className="w-full h-[120px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                          />
                        </div>
                      </div>

                      {/* Value Proposition */}
                      <div className={getCardClass("valueProposition")}>
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                          가치 제안
                        </h3>

                        <textarea
                          placeholder="고객에게 제공할 핵심 가치를 입력하세요"
                          onFocus={() => handleFocus("valueProposition")}
                          onBlur={handleBlur}
                          className="w-full h-[320px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                        />
                      </div>

                      {/* Customer Relationships + Channels */}
                      <div className="grid grid-rows-2 gap-4">
                        <div className={getCardClass("customerRelationships")}>
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            고객 관계
                          </h3>

                          <textarea
                            placeholder="고객 관계 전략을 입력하세요"
                            onFocus={() => handleFocus("customerRelationships")}
                            onBlur={handleBlur}
                            className="w-full h-[120px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                          />
                        </div>

                        <div className={getCardClass("channels")}>
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            채널
                          </h3>

                          <textarea
                            placeholder="채널을 입력하세요"
                            onFocus={() => handleFocus("channels")}
                            onBlur={handleBlur}
                            className="w-full h-[120px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                          />
                        </div>
                      </div>

                      {/* Customer Segments */}
                      <div className={getCardClass("customerSegments")}>
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                          고객 세그먼트
                        </h3>

                        <textarea
                          placeholder="고객 세그먼트를 입력하세요"
                          onFocus={() => handleFocus("customerSegments")}
                          onBlur={handleBlur}
                          className="w-full h-[320px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                        />
                      </div>
                    </div>

                    {/* Cost Structure / Revenue Streams */}
                    <div className="grid grid-cols-2 gap-4 mt-4 h-[150px]">
                      <div className={getCardClass("costStructure")}>
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                          비용 구조
                        </h3>

                        <textarea
                          placeholder="비용 구조를 입력하세요"
                          onFocus={() => handleFocus("costStructure")}
                          onBlur={handleBlur} 
                          className="w-full h-[70px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                        />
                      </div>

                      <div className={getCardClass("revenueStreams")}>
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                          수익 구조
                        </h3>

                        <textarea
                          placeholder="수익 구조를 입력하세요"
                          onFocus={() => handleFocus("revenueStreams")}
                          onBlur={handleBlur}
                          className="w-full h-[70px] resize-none outline-none text-sm text-[#3D4770] leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {!hasAnalyzeResult ? (
                  <section className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        2. BMC 분석
                      </h2>

                      {bmcLimit && (
                        <div className="text-sm font-semibold text-gray-500">
                          오늘 분석 가능 횟수{" "}
                          <span className="text-blue-600">
                            {bmcLimit.remainingAnalysis}/{bmcLimit.analysisLimit}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className="
                        flex-1
                        min-h-[330px]
                        rounded-2xl
                        border
                        border-gray-200
                        bg-[#F8FAFF]
                        px-10
                        py-12
                        text-center
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >
                      {isAnalyzing ? (
                        <BMCAnalyzeLoading
                          duration={3000}
                          onComplete={() => {
                            setIsAnalyzing(false);
                            setHasAnalyzeResult(true);
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
                            <BarChart3 size={38} strokeWidth={1.8} />
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            아직 BMC 분석 결과가 없습니다
                          </h3>

                          <p className="text-[#3D4770] text-base leading-7 mb-8">
                            생성된 BMC를 기준으로 사업 모델의 강점과 보완점을 분석할 수 있습니다.
                            <br />
                            분석 결과는 이후 결과 페이지에서 정리해 확인할 수 있습니다.
                          </p>

                          <button
                            onClick={handleAnalyze}
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
                            BMC 분석하기
                          </button>
                        </>
                      )}
                    </div>
                  </section>
                ) : (
                  <>
                    {/* 2. 분석 결과 요약 */}
                    <section className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        2. 분석 결과 요약
                      </h2>

                      <div className="grid grid-cols-[1fr_1fr] gap-6">
                        {/* 강점 */}
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                          <div className="flex items-center gap-2 mb-5">
                            <CheckCircle2
                              size={22}
                              className="text-blue-600"
                            />

                            <h3 className="text-lg font-bold text-gray-900">
                              강점
                            </h3>
                          </div>

                          <div className="flex flex-col gap-4">
                            {strengthItems.map((item) => (
                              <div
                                key={item.title}
                                className="rounded-xl bg-white border border-blue-100 p-5 flex gap-4"
                              >
                                <div className="text-blue-500 shrink-0 mt-1">
                                  {item.icon}
                                </div>

                                <div>
                                  <h4 className="text-base font-bold text-gray-900 mb-2">
                                    {item.title}
                                  </h4>

                                  <p className="text-sm text-[#3D4770] leading-6">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 보완점 */}
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                          <div className="flex items-center gap-2 mb-5">
                            <AlertTriangle
                              size={22}
                              className="text-amber-500"
                            />

                            <h3 className="text-lg font-bold text-gray-900">
                              보완점
                            </h3>
                          </div>

                          <div className="flex flex-col gap-4">
                            {improveItems.map((item) => (
                              <div
                                key={item.title}
                                className="rounded-xl bg-white border border-amber-100 p-5 flex gap-4"
                              >
                                <div className="text-amber-500 shrink-0 mt-1">
                                  {item.icon}
                                </div>

                                <div>
                                  <h4 className="text-base font-bold text-gray-900 mb-2">
                                    {item.title}
                                  </h4>

                                  <p className="text-sm text-[#3D4770] leading-6">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* 3. AI 개선 방향 */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        3. AI 개선 방향
                      </h2>

                      <div className="rounded-2xl border-2 border-blue-500 bg-white overflow-hidden shadow-sm">
                        <div className="h-12 bg-blue-600 text-white flex items-center px-6 gap-2 font-bold">
                          <Sparkles size={18} />
                          AI가 제안하는 BMC 개선 방향
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-5">
                            <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] p-5">
                              <h3 className="text-base font-bold text-gray-900 mb-3">
                                1. 수익 모델 구체화
                              </h3>

                              <p className="text-sm text-[#3D4770] leading-6">
                                구독형, 수수료형, 광고형 등 가능한 수익 방식을 비교하고
                                초기 단계에 적합한 수익 구조를 선택해야 합니다.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] p-5">
                              <h3 className="text-base font-bold text-gray-900 mb-3">
                                2. 초기 고객층 좁히기
                              </h3>

                              <p className="text-sm text-[#3D4770] leading-6">
                                전체 고객을 한 번에 대상으로 하기보다 가장 문제를 크게 느끼는
                                초기 고객 세그먼트를 먼저 정의하는 것이 좋습니다.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] p-5">
                              <h3 className="text-base font-bold text-gray-900 mb-3">
                                3. 차별화 전략 강화
                              </h3>

                              <p className="text-sm text-[#3D4770] leading-6">
                                경쟁 서비스와 비교해 사용자가 선택할 만한 기능, 가격,
                                경험 차별점을 더 명확히 정리해야 합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>

            {/* 하단 영역 */}
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
                  분석 결과 초기화
                </button>

                <button
                  onClick={handleNext}
                  disabled={!hasAnalyzeResult}
                  className={`
                    h-11
                    px-7
                    rounded-xl
                    font-bold
                    flex
                    items-center
                    gap-2
                    active:scale-[0.98]
                    transition
                    ${
                      hasAnalyzeResult
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  결과 확인
                  <ArrowRight size={18} />
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default BMCAnalyzePage;