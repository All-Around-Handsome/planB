import {
  Edit3,
  FileText,
  Search,
  BarChart3,
  LogOut,
} from "lucide-react";

function Sidebar({ activeStep = "idea" }) {
  const pageInfo = {
    idea: {
      title: "아이디어 입력",
      desc: (
        <>
          비즈니스 아이디어를 입력하고
          <br />
          분석 진행 단계를 설정하여
          <br />
          BMC 생성을 준비합니다.
        </>
      ),
    },
    explore: {
      title: "경쟁 서비스 탐색",
      desc: (
        <>
          입력한 아이디어를 기반으로
          <br />
          경쟁 서비스와 시장 정보를
          <br />
          탐색하여 방향을 확인합니다.
        </>
      ),
    },
    create: {
      title: "AI 기반 BMC 생성",
      desc: (
        <>
          입력한 아이디어 정보를 분석하여
          <br />
          AI가 비즈니스 모델 캔버스의
          <br />
          9가지 요소를 자동 생성합니다.
        </>
      ),
    },
    analyze: {
      title: "BMC 분석",
      desc: (
        <>
          작성한 BMC를 기반으로
          <br />
          AI가 사업 모델을 분석하고
          <br />
          개선 방향을 제공합니다.
        </>
      ),
    },
    result: {
      title: "결과 출력",
      desc: (
        <>
          생성된 BMC와 분석 결과를
          <br />
          하나의 보고서 형태로 정리하여
          <br />
          확인하고 출력할 수 있습니다.
        </>
      ),
    },
  };

  const items = [
    {
      id: "idea",
      icon: <Edit3 size={34} />,
      title: "아이디어 입력",
      desc: (
        <>
          아이디어를 입력하고
          <br />
          진행단계를 설정합니다.
        </>
      ),
    },
    {
      id: "explore",
      icon: <Search size={34} />,
      title: "경쟁 서비스 탐색",
      desc: (
        <>
          유사한 경쟁 서비스와
          <br />
          시장 정보를 탐색합니다.
        </>
      ),
    },
    {
      id: "create",
      icon: <FileText size={34} />,
      title: "AI 기반 BMC 생성",
      desc: (
        <>
          아이디어를 기반으로
          <br />
          AI가 BMC를 생성합니다.
        </>
      ),
    },
    {
      id: "analyze",
      icon: <BarChart3 size={34} />,
      title: "BMC 분석",
      desc: (
        <>
          직접 작성한 BMC를
          <br />
          AI가 분석하고 개선합니다.
        </>
      ),
    },
    {
      id: "result",
      icon: <LogOut size={34} />,
      title: "결과 출력",
      desc: (
        <>
          BMC와 분석 결과를
          <br />
          보고서로 출력합니다.
        </>
      ),
    },
  ];

  const currentPage = pageInfo[activeStep] || pageInfo.idea;

  return (
    <aside className="w-[320px] shrink-0 bg-[#F6F9FF] px-8 py-10">
      <h1 className="text-[30px] leading-tight font-bold text-[#071642] mb-5 whitespace-nowrap">
        {currentPage.title}
      </h1>

      <p className="text-[#3D4770] text-base leading-7 mb-10">
        {currentPage.desc}
      </p>

      <div className="flex flex-col gap-6 w-full">
        {items.map((item) => {
          const active = activeStep === item.id;

          return (
            <div
              key={item.id}
              className={`
                w-full
                flex items-center gap-5 rounded-2xl p-4 transition
                ${
                  active
                    ? "bg-[#EEF4FF] border border-blue-100"
                    : "bg-transparent"
                }
              `}
            >
              <div
                className={`
                  flex
                  items-center
                  justify-center
                  shrink-0
                  ${active ? "text-blue-500" : "text-blue-400"}
                `}
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-[#3D4770]">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;