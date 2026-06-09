import { useState } from "react";
import {
  Lightbulb,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Target,
  FileText,
  Sparkles,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";
import Textarea from "../components/Textarea";

function IdeaPage() {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaContent, setIdeaContent] = useState("");
  const [selectedStep, setSelectedStep] = useState("idea");
  const [searchOption, setSearchOption] = useState("withSearch");

  const stepOptions = [
    {
      id: "idea",
      icon: <Lightbulb size={42} strokeWidth={1.8} />,
      title: "아이디어",
      desc: "아이디어를 구체화하고\n가능성을 탐색하는 단계",
    },
    {
      id: "validate",
      icon: <ShieldCheck size={42} strokeWidth={1.8} />,
      title: "검증",
      desc: "시장을 조사하고\n가설을 검증하는 단계",
    },
    {
      id: "launch",
      icon: <Rocket size={42} strokeWidth={1.8} />,
      title: "초기 런칭",
      desc: "MVP를 출시하고\n초기 고객을 확보하는 단계",
    },
    {
      id: "growth",
      icon: <TrendingUp size={42} strokeWidth={1.8} />,
      title: "성장",
      desc: "서비스를 확장하고\n성장을 가속하는 단계",
    },
  ];

  const searchOptions = [
    {
      id: "withSearch",
      icon: <Target size={38} strokeWidth={1.8} />,
      title: "경쟁 탐색 진행",
      desc: "유사 서비스와 시장을 분석합니다.",
    },
    {
      id: "withoutSearch",
      icon: <FileText size={38} strokeWidth={1.8} />,
      title: "탐색 없이 바로 BMC 생성",
      desc: "경쟁 탐색을 건너뛰고 바로 생성합니다.",
    },
  ];

  const handleSubmit = () => {
    console.log({
      ideaTitle,
      ideaContent,
      selectedStep,
      searchOption,
    });
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          {/* 왼쪽 STEP 사이드바 */}
          <Sidebar />

          {/* 가운데 프로필/이동 메뉴 */}
          <ProjectNav />

          {/* 오른쪽 메인 영역 */}
          <main className="flex-1 flex flex-col">
            {/* 상단 헤더 */}
            <header className="h-[72px] border-b border-gray-200 flex items-center px-12">
              <input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="아이디어 제목 입력"
                className="
                  w-full
                  text-2xl
                  font-bold
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                "
              />
            </header>

            {/* 콘텐츠 */}
            <div className="px-12 pt-8 pb-11 shrink-0">
              <div className="max-w-[1120px]">
                {/* 1. 아이디어 입력 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    1. 아이디어 입력
                  </h2>

                  <Textarea
                    placeholder={`아이디어를 자세히 입력해주세요`}
                    value={ideaContent}
                    onChange={setIdeaContent}
                    rows={12}
                    limit={1000}
                    maxLimit={1500}
                  />
                </section>

                {/* 2. 진행 단계 선택 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    2. 진행 단계 선택
                  </h2>

                  <div className="grid grid-cols-4 gap-5">
                    {stepOptions.map((option) => {
                      const active = selectedStep === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() => setSelectedStep(option.id)}
                          className={`
                            h-[180px]
                            rounded-2xl
                            border
                            flex flex-col
                            items-center
                            justify-center
                            text-center
                            transition
                            ${
                              active
                                ? "border-blue-500 bg-blue-50 text-blue-500 shadow-sm"
                                : "border-gray-200 bg-white text-[#071642] hover:border-blue-300 hover:bg-blue-50/40"
                            }
                          `}
                        >
                          <div className="mb-5">{option.icon}</div>

                          <h3
                            className={`
                              text-xl font-bold mb-3
                              ${active ? "text-blue-500" : "text-gray-900"}
                            `}
                          >
                            {option.title}
                          </h3>

                          <p className="text-sm leading-6 text-[#3D4770] whitespace-pre-line">
                            {option.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 3. 경쟁 서비스 탐색 설정 */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    3. 경쟁 서비스 탐색 설정
                  </h2>

                  <div className="grid grid-cols-2 gap-6">
                    {searchOptions.map((option) => {
                      const active = searchOption === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() => setSearchOption(option.id)}
                          className={`
                            h-[110px]
                            rounded-2xl
                            border
                            flex
                            items-center
                            px-10
                            gap-8
                            text-left
                            transition
                            ${
                              active
                                ? "border-blue-500 bg-blue-50 text-blue-500 shadow-sm"
                                : "border-gray-200 bg-white text-[#071642] hover:border-blue-300 hover:bg-blue-50/40"
                            }
                          `}
                        >
                          <div>{option.icon}</div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {option.title}
                            </h3>

                            <p className="text-sm text-[#3D4770]">
                              {option.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>

            {/* 하단 고정 영역 */}
            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-between px-12 bg-white">
              
              {/* LEFT */}
              <div className="flex items-center gap-3 h-full">
                <ShieldCheck size={22} className="shrink-0" />

                <span className="text-[#3D4770] font-medium flex items-center h-full">
                  입력한 정보는 안전하게 저장되며, 분석 결과는 언제든지 확인할 수 있습니다.
                </span>
              </div>

              {/* RIGHT */}
              <button
                onClick={handleSubmit}
                className="
                  h-12
                  px-8
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-bold
                  flex
                  items-center
                  gap-3
                  hover:bg-blue-700
                  active:scale-[0.98]
                  transition
                "
              >
                <Sparkles size={20} />
                분석 시작하기
              </button>

            </footer>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

export default IdeaPage;