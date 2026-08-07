import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { generateBmc } from "../api/bmcAi";
import {
  getBmcLimit,
  checkGeneration,
  saveGeneratedBmc,
} from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";
import BMCLoading from "../components/BMCLoading";

import { getProjectData } from "../utils/projectStorage";

function BMCCreatePage() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    ideaTitle: "",
    ideaContent: "",
    selectedStep: "idea",
    searchOption: "withoutSearch",
  });

  const [bmcLimit, setBmcLimit] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedBmc, setGeneratedBmc] = useState(null);
  const [bmcRecordId, setBmcRecordId] = useState(null);

  useEffect(() => {
    const savedProject = getProjectData();

    if (savedProject) {
      setProject(savedProject);
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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      // 1. 생성 횟수 차감
      await checkGeneration();

      // 2. 차감된 최신 사용량 조회
      const updatedLimit = await getBmcLimit();

      if (updatedLimit.success) {
        setBmcLimit(updatedLimit.data);
      }

      // 3. AI 생성
      const aiResult = await generateBmc({
        idea: project.ideaContent,
      });

      // 화면에 저장
      setGeneratedBmc(aiResult);

      // 4. 생성 결과 저장
      const saveResult = await saveGeneratedBmc({
        ideaText: project.ideaContent,
        stage: "IDEA",
        bmcType: "AI_GENERATED",
        items: [
          {
            itemType: "VALUE_PROPOSITION",
            content: aiResult.valueProposition,
          },
          {
            itemType: "CUSTOMER_SEGMENT",
            content: aiResult.customerSegments,
          },
          {
            itemType: "REVENUE_STREAM",
            content: aiResult.revenueStreams,
          },
          {
            itemType: "COST_STRUCTURE",
            content: aiResult.costStructure,
          },
          {
            itemType: "KEY_PARTNERS",
            content: aiResult.keyPartners,
          },
          {
            itemType: "KEY_ACTIVITIES",
            content: aiResult.keyActivities,
          },
          {
            itemType: "KEY_RESOURCES",
            content: aiResult.keyResources,
          },
          {
            itemType: "CHANNELS",
            content: aiResult.channels,
          },
          {
            itemType: "CUSTOMER_RELATIONSHIPS",
            content: aiResult.customerRelationships,
          },
        ],
      });

      if (saveResult.success) {
        const id = saveResult.data.bmcRecordId;

        setBmcRecordId(id);
        setIsGenerated(true);

        console.log("저장된 BMC ID:", id);
      }

    } catch (error) {
      console.error("BMC 생성 실패", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrev = () => {
    navigate("/idea");
  };

  const handleNext = () => {
    if (!bmcRecordId) {
      return;
    }
    navigate(`/bmc/result/${bmcRecordId}`);
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

                    <div className="flex items-center gap-4">
                      {bmcLimit && (
                        <div className="text-sm font-semibold text-gray-500">
                          오늘 생성 가능 횟수{" "}
                          <span className="text-blue-600">
                            {bmcLimit.remainingGeneration}/{bmcLimit.generationLimit}
                          </span>
                        </div>
                      )}

                      {isGenerated && (
                        <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                          <CheckCircle2 size={18} />
                          BMC 생성 완료
                        </div>
                      )}
                    </div>
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
                        <BMCLoading duration={3000} />
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

                          <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                            {generatedBmc?.keyPartners}
                          </p>
                        </div>

                        {/* Key Activities + Key Resources */}
                        <div className="grid grid-rows-2 gap-4">
                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              핵심 활동
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                              {generatedBmc?.keyActivities}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              핵심 자원
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                              {generatedBmc?.keyResources}
                            </p>
                          </div>
                        </div>

                        {/* Value Proposition */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            가치 제안
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                            {generatedBmc?.valueProposition}
                          </p>
                        </div>

                        {/* Customer Relationships + Channels */}
                        <div className="grid grid-rows-2 gap-4">
                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              고객 관계
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                              {generatedBmc?.customerRelationships}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4">
                              채널
                            </h3>

                            <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                              {generatedBmc?.channels}
                            </p>
                          </div>
                        </div>

                        {/* Customer Segments */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            고객 세그먼트
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                            {generatedBmc?.customerSegments}
                          </p>
                        </div>
                      </div>

                      {/* cost Structure / Revenue Streams */}
                      <div className="grid grid-cols-2 gap-4 mt-4 h-[150px]">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            비용 구조
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                            {generatedBmc?.costStructure}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-bold text-gray-900 mb-4">
                            수익 구조
                          </h3>

                          <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line">
                            {generatedBmc?.revenueStreams}
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
                  아이디어 수정
                </button>

                <button
                  onClick={handleNext}
                  disabled={!bmcRecordId}
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

export default BMCCreatePage;