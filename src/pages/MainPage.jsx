import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const scrollToSection = (id) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
    });
  }
};

const guideSteps = [
  {
    step: "STEP 1",
    title: "아이디어 입력",
    desc: "사업 아이디어의 제목과 핵심 내용을 입력합니다.",
    image: "/Guide_01_Idea.png",
  },
  {
    step: "STEP 2",
    title: "경쟁 서비스 탐색",
    desc: "입력한 아이디어와 유사한 경쟁 서비스를 탐색합니다.",
    image: "/Guide_02_Explore.png",
  },
  {
    step: "STEP 3",
    title: "BMC 자동 생성",
    desc: "AI가 아이디어를 기반으로 비즈니스 모델 캔버스를\n생성합니다.",
    image: "/Guide_03_Create.png",
  },
  {
    step: "STEP 4",
    title: "BMC 분석",
    desc: "생성된 BMC의 강점과 보완점을 분석합니다.",
    image: "/Guide_04_Analyze.png",
  },
  {
    step: "STEP 5",
    title: "분석 결과 확인",
    desc: "AI 분석 결과를 확인하고 개선 방향을 파악합니다.",
    image: "/Guide_05_Result.png",
  },
  {
    step: "STEP 6",
    title: "마이페이지",
    desc: "생성한 아이디어와 BMC 기록을 관리합니다.",
    image: "/Guide_06_MyPage.png",
  },
  {
    step: "STEP 7",
    title: "BMC 수정",
    desc: "필요한 내용을 직접 수정하며 BMC를 완성합니다.",
    image: "/Guide_07_Edit.png",
  },
];

function MainPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const isLoggedIn = false; // 나중에 실제 로그인 상태로 교체

  const handleStart = () => {
    if (isLoggedIn) {
      navigate("/idea");
    } else {
      navigate("/auth");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) =>
      prev === 0 ? guideSteps.length - 1 : prev - 1
    );
  };

  const nextStep = () => {
    setCurrentStep((prev) =>
      prev === guideSteps.length - 1 ? 0 : prev + 1
    );
  };

  const step = guideSteps[currentStep];

  return (
    <MainLayout>
      {/* Hero */}
      <section
        id="hero"
        className="
          relative
          overflow-hidden
          bg-[#EEF3FF]
        "
      >
        {/* LEFT BG */}
        <div
          className="
            absolute
            inset-y-0
            left-0
            w-1/2
            bg-[#F4F7FF]
          "
        />

        {/* RIGHT BG */}
        <div
          className="
            absolute
            inset-y-0
            right-0
            w-1/2
            bg-[#DCE6FF]
          "
        />

        {/* CENTER */}
        <div
          className="
            relative
            w-[1440px]
            h-[817px]
            mx-auto
            bg-cover
            bg-center
            bg-no-repeat
            z-10
          "
          style={{
            backgroundImage: "url('/MainPage_Background.png')",
          }}
        >

          {/* Content */}
          <div className="relative z-10 px-10 pt-32">
            <div className="w-[760px] flex flex-col items-start gap-6">
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                아이디어를 구조화하고
                <br />
                비즈니스를 설계하다
              </h1>

              <p className="text-gray-600 text-xl leading-8">
                AI가 도와주는 비즈니스 모델 분석으로,
                <br />
                아이디어를 실행 가능한 전략으로 바꿔보세요.
              </p>

              <Button onClick={handleStart}>시작하기</Button>
            </div>
          </div>

          {/* Scroll Button */}
          <button
            onClick={() => scrollToSection("description")}
            className="
              absolute
              bottom-10
              left-1/2
              -translate-x-1/2
              text-gray-500
              hover:text-blue-500
              transition
              animate-bounce
              z-20
            "
          >
            <ChevronDown size={44} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* Description */}
      <section
        id="description"
        className="relative bg-[#F9FAFB] py-40"
      >
        <div className="max-w-[1440px] mx-auto px-10 text-center">
          <p className="text-gray-800 text-4xl font-bold leading-[1.7]">
            아이디어를 입력하면 비즈니스 모델이 구조화됩니다.
            <br />
            AI 기반 분석을 통해 BMC를 자동 생성하고,
            <br />
            핵심 요소를 빠르게 정리할 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => scrollToSection("guide")}
          className="
            absolute
            bottom-8
            left-1/2
            -translate-x-1/2
            text-gray-500
            hover:text-blue-500
            transition
            animate-bounce
          "
        >
          <ChevronDown size={44} strokeWidth={1.5} />
        </button>
      </section>

      {/* Guide */}
      <section id="guide" className="w-full bg-white pt-10 pb-15">
        <div className="max-w-[1440px] mx-auto px-10">
          
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              PlanB 사용 방법
            </h2>
          </div>

          {/* STEP Tabs */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {guideSteps.map((item, index) => (
              <button
                key={item.step}
                onClick={() => setCurrentStep(index)}
                className={`
                  px-5 py-3 rounded-full text-sm font-semibold transition-all
                  ${
                    currentStep === index
                      ? "bg-blue-500 text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)]"
                      : "bg-white text-gray-400 border border-gray-200 hover:text-blue-500 hover:border-blue-300"
                  }
                `}
              >
                {item.step}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="relative overflow-hidden rounded-[36px] border border-gray-100 bg-[#F8FAFF] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

            <div className="grid grid-cols-[1.15fr_0.85fr] min-h-[620px]">

              {/* Left */}
              <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F4F7FF] to-[#DCE6FF] p-14">

                {/* Blur */}
                <div className="absolute w-[520px] h-[520px] rounded-full bg-white/40 blur-3xl" />

                {/* Prev */}
                <button
                  onClick={prevStep}
                  className="
                    absolute left-8 z-20
                    w-12 h-12 rounded-full bg-white/90
                    flex items-center justify-center
                    border border-gray-100
                    shadow-md
                    hover:bg-blue-50
                    active:scale-95
                    transition
                  "
                >
                  <ChevronLeft className="text-blue-500" />
                </button>

                {/* Image */}
                <div
                  key={currentStep}
                  className="
                    relative z-10
                    w-full max-w-[760px]
                    animate-[slideIn_0.45s_ease]
                  "
                >
                  <div className="rounded-[30px] bg-white/70 p-4 backdrop-blur shadow-[0_18px_50px_rgba(15,23,42,0.12)]">

                    <img
                      src={step.image}
                      alt={step.title}
                      className="
                        w-full
                        h-[420px]
                        object-cover
                        object-top
                        rounded-[22px]
                      "
                    />
                  </div>
                </div>

                {/* Next */}
                <button
                  onClick={nextStep}
                  className="
                    absolute right-8 z-20
                    w-12 h-12 rounded-full bg-white/90
                    flex items-center justify-center
                    border border-gray-100
                    shadow-md
                    hover:bg-blue-50
                    active:scale-95
                    transition
                  "
                >
                  <ChevronRight className="text-blue-500" />
                </button>
              </div>

              {/* Guide Step Text */}
              <div className="flex flex-col px-16 pt-40 pb-14">

                <p className="text-blue-500 text-lg font-bold mb-4">
                  {step.step}
                </p>

                <h3 className="text-5xl font-bold text-gray-900 leading-tight mb-8">
                  {step.title}
                </h3>

                <p className="text-gray-500 text-lg leading-8 mb-8 min-h-[72px] whitespace-pre-line">
                  {step.desc}
                </p>

                {/* Progress */}
                <div className="flex gap-2 mt-2">
                  {guideSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${
                          currentStep === index
                            ? "w-10 bg-blue-500"
                            : "w-2 bg-gray-300"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(40px);
              }

              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}
        </style>
      </section>
    </MainLayout>
  );
}

export default MainPage;