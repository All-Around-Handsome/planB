import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, LayoutGrid, PenLine, Search } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useLogin } from "../contexts/LoginContext.jsx";

const STEPS = [
  {
    icon: PenLine,
    title: "아이디어 입력",
    description: "만들고 싶은 서비스를 몇 문장으로 적어요.",
  },
  {
    icon: Search,
    title: "유사 서비스 탐색",
    description: "비슷한 서비스를 찾아 차별점을 비교해요.",
  },
  {
    icon: LayoutGrid,
    title: "BMC 자동 생성",
    description: "9개 블록의 비즈니스 모델 캔버스를 채워요.",
  },
  {
    icon: BarChart3,
    title: "타당성 분석",
    description: "점수, 리스크, 실행 계획까지 받아봐요.",
  },
];

// 히어로 아래 보여줄 캔버스 미리보기 (BMC 표준 배치)
const PREVIEW = [
  { label: "핵심 파트너", area: "col-start-1 col-span-2 row-start-1 row-span-2", text: "캠퍼스 서점, 학생회" },
  { label: "핵심 활동", area: "col-start-3 col-span-2 row-start-1", text: "학과별 도서 매칭" },
  { label: "핵심 자원", area: "col-start-3 col-span-2 row-start-2", text: "학교 인증 회원망" },
  { label: "가치 제안", area: "col-start-5 col-span-2 row-start-1 row-span-2", text: "같은 캠퍼스에서 전공서적을 반값에", highlight: true },
  { label: "고객 관계", area: "col-start-7 col-span-2 row-start-1", text: "학기별 알림" },
  { label: "채널", area: "col-start-7 col-span-2 row-start-2", text: "대학 커뮤니티" },
  { label: "고객 세그먼트", area: "col-start-9 col-span-2 row-start-1 row-span-2", text: "전공서적이 필요한 대학생" },
  { label: "비용 구조", area: "col-start-1 col-span-5 row-start-3", text: "서버 운영, 캠퍼스 마케팅" },
  { label: "수익 구조", area: "col-start-6 col-span-5 row-start-3", text: "프리미엄 노출, 거래 수수료" },
];

function CanvasPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-10 -inset-y-8 bg-[radial-gradient(ellipse_at_center,#eef3ff_0%,transparent_70%)]" />

      <div className="relative rounded-2xl border border-gray-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] p-3 sm:p-4">
        <div className="flex items-center gap-1.5 px-1 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <span className="ml-3 text-xs text-gray-400">캠퍼스 전공서적 직거래 · AI 생성</span>
        </div>

        <div className="grid grid-cols-10 auto-rows-[minmax(64px,auto)] gap-1.5 sm:gap-2 text-left">
          {PREVIEW.map(({ label, area, text, highlight }) => (
            <div
              key={label}
              className={`rounded-xl p-3 border ${area} ${
                highlight
                  ? "bg-accent text-white border-accent"
                  : "bg-gray-50/60 border-gray-100"
              }`}
            >
              <p className={`text-[11px] font-semibold mb-1 ${highlight ? "text-white/70" : "text-gray-400"}`}>
                {label}
              </p>
              <p className={`text-xs sm:text-[13px] leading-snug font-medium ${highlight ? "text-white" : "text-gray-700"}`}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const { isLogin } = useLogin();

  const start = (path) => navigate(isLogin ? path : "/auth");

  return (
    <MainLayout>
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16 text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              AI 비즈니스 모델 캔버스
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-gray-900">
              아이디어 한 줄이
              <br />
              <span className="text-accent">사업 계획</span>이 되기까지
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
              유사 서비스 탐색부터 BMC 작성, 타당성 분석까지.
              <br className="hidden sm:block" />
              PlanB가 아이디어를 구조화된 비즈니스 모델로 정리해 드려요.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" iconRight={ArrowRight} onClick={() => start("/idea")}>
                무료로 시작하기
              </Button>
              <Button size="lg" variant="secondary" onClick={() => start("/bmc/analyze")}>
                내 BMC 분석하기
              </Button>
            </div>
          </div>

          <div className="hidden sm:block mt-16 md:mt-20 max-w-4xl mx-auto animate-fade-up [animation-delay:150ms]">
            <CanvasPreview />
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-accent">사용 방법</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                네 단계면 충분해요
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                이미 만든 BMC가 있다면 바로 분석부터 시작할 수도 있어요.
              </p>
            </div>

            <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map(({ icon: Icon, title, description }, index) => (
                <li
                  key={title}
                  className="rounded-2xl bg-white border border-gray-200 p-6 flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                      <Icon size={19} />
                    </span>
                    <span className="text-sm font-semibold text-gray-300 tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <div className="rounded-3xl bg-gray-900 px-8 py-14 md:px-16 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                지금 떠오른 아이디어, 바로 정리해 보세요
              </h2>
              <p className="mt-3 text-gray-400">카카오나 구글 계정으로 바로 시작할 수 있어요.</p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              iconRight={ArrowRight}
              onClick={() => start("/idea")}
              className="border-transparent"
            >
              시작하기
            </Button>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

export default MainPage;
