import MainLayout from "./MainLayout";
import Sidebar from "../components/Sidebar";

/**
 * 아이디어 → 탐색 → 생성 → 분석 → 결과 화면의 공통 틀.
 * title 대신 header 를 넘기면 제목 자리를 직접 꾸밀 수 있다 (예: 제목 입력칸).
 * actions 는 화면 아래에 붙는 버튼 줄이다.
 */
function WorkspaceLayout({ step, title, description, header, headerRight, actions, children }) {
  return (
    <MainLayout footer={false}>
      <div className="w-full max-w-6xl mx-auto px-5 md:px-8 flex-1 flex">
        <Sidebar activeStep={step} variant="desktop" />

        <main className="flex-1 min-w-0 flex flex-col lg:border-l lg:border-gray-100 lg:pl-10">
          <Sidebar activeStep={step} variant="mobile" />

          <div className="pt-8 lg:pt-10 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              {header ?? (
                <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-gray-900 truncate">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-[15px] text-gray-500">{description}</p>
              )}
            </div>
            {headerRight && <div className="shrink-0 flex items-center gap-2">{headerRight}</div>}
          </div>

          <div className="flex-1 pb-10 animate-fade-up">{children}</div>

          {actions && (
            <div className="sticky bottom-0 -mx-5 px-5 lg:mx-0 lg:px-0 py-4 bg-white/90 backdrop-blur border-t border-gray-100 flex items-center justify-between gap-4">
              {actions}
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}

export default WorkspaceLayout;
