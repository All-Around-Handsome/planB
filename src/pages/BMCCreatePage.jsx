import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";
import BMCLoading from "../components/BMCLoading";

function BMCCreatePage() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    ideaTitle: "",
    ideaContent: "",
    selectedStep: "idea",
    searchOption: "withoutSearch",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const savedProject = localStorage.getItem("planb_project");

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
  };

  const handlePrev = () => {
    if (project.searchOption === "withSearch") {
      navigate("/explore");
    } else {
      navigate("/idea");
    }
  };

  const handleNext = () => {
    navigate("/bmc/analyze");
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="create" />

          <ProjectNav />

          <main className="flex-1 flex flex-col self-stretch">
            {/* 상단 헤더 */}
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

                {/* 2. BMC 생성 */}
                <section className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      2. AI 기반 BMC 생성
                    </h2>

                    {isGenerated && (
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                        <CheckCircle2 size={18} />
                        BMC 생성 완료
                      </div>
                    )}
                  </div>

                  {!isGenerated ? (
                    <div
                      className="
                        flex-1
                        min-h-[500px]
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
                      {isGenerating ? (
                        <BMCLoading
                          duration={3000}
                          onComplete={() => {
                            setIsGenerating(false);
                            setIsGenerated(true);
                          }}
                        />
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                            <Sparkles size={38} strokeWidth={1.8} />
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            아직 생성된 BMC가 없습니다
                          </h3>

                          <p className="text-[#3D4770] text-base leading-7 mb-8">
                            현재 입력된 아이디어를 기준으로
                            <br />
                            AI가 비즈니스 모델 캔버스를 자동 생성합니다.
                          </p>

                          <button
                            onClick={handleGenerate}
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
                            BMC 생성하기
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full rounded-[28px] border border-gray-200 bg-[#F8FAFF] p-5 shadow-sm">
                      {/* 상단 5열 영역 */}
                      <div className="grid grid-cols-5 gap-4 h-[430px]">
                        {/* Key Partners */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            핵심 파트너
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6">
                            서비스 운영에 필요한 협력사, 플랫폼, 데이터 제공자 등이 표시됩니다.
                          </p>
                        </div>

                        {/* Key Activities + Key Resources */}
                        <div className="grid grid-rows-2 gap-4">
                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              핵심 활동
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6">
                              서비스 개발, 고객 확보, 데이터 분석 등 핵심 활동이 표시됩니다.
                            </p>
                          </div>

                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              핵심 자원
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6">
                              서비스 구현에 필요한 기술, 인력, 데이터, 자산이 표시됩니다.
                            </p>
                          </div>
                        </div>

                        {/* Value Proposition */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            가치 제안
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6">
                            고객에게 제공하는 핵심 가치와 차별화 요소가 표시됩니다.
                          </p>
                        </div>

                        {/* Customer Relationships + Channels */}
                        <div className="grid grid-rows-2 gap-4">
                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              고객 관계
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6">
                              고객과의 관계 형성 방식과 유지 전략이 표시됩니다.
                            </p>
                          </div>

                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              채널
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6">
                              고객에게 서비스를 전달하는 경로와 마케팅 채널이 표시됩니다.
                            </p>
                          </div>
                        </div>

                        {/* Customer Segments */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            고객 세그먼트
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6">
                            주요 고객군과 타깃 사용자가 표시됩니다.
                          </p>
                        </div>
                      </div>

                      {/* cost Structure / Revenue Streams */}
                      <div className="grid grid-cols-2 gap-4 mt-4 h-[150px]">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            비용 구조
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6">
                            개발비, 운영비, 마케팅비 등 주요 비용 구조가 표시됩니다.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            수익 구조
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6">
                            구독료, 수수료, 광고 등 수익 창출 방식이 표시됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* 하단 버튼 */}
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
                  이전 단계로 돌아가기
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isGenerated}
                  className={`
                    h-11
                    px-7
                    rounded-xl
                    font-bold
                    flex
                    items-center
                    gap-2
                    transition
                    ${
                      isGenerated
                        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  BMC 분석으로 이동
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

export default BMCCreatePage;