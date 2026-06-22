import {
  Edit3,
  FileText,
  Target,
  BarChart3,
  LogOut,
} from "lucide-react";

function Sidebar({ activeStep = "idea" }) {
  const pageInfo = {
    idea: {
      title: "아이디어 입력",
      desc: (
        <>
          비즈니스 아이디어를 입력하면
          <br />
          AI가 기반 정보를 파악하여 분석을 시작합니다.
        </>
      ),
    },
    explore: {
      title: "경쟁 서비스 탐색",
      desc: (
        <>
          입력한 아이디어를 기준으로
          <br />
          유사한 서비스를 분석합니다.
        </>
      ),
    },
    create: {
      title: "AI 기반 BMC 생성",
      desc: (
        <>
          입력한 정보를 바탕으로
          <br />
          BMC를 자동 생성합니다.
        </>
      ),
    },
    analyze: {
      title: "BMC 분석",
      desc: (
        <>
          생성된 BMC의 요소를 분석하고
          <br />
          개선 인사이트를 제공합니다.
        </>
      ),
    },
    result: {
      title: "결과 출력",
      desc: (
        <>
          분석 결과를 보고서로 정리하여
          <br />
          다운로드할 수 있습니다.
        </>
      ),
    },
  };

  const items = [
    {
      id: "idea",
      icon: <Edit3 size={34} />,
      title: "아이디어 입력",
      desc: "AI가 도와주는 비즈니스 모델 캔버스 플랫폼",
    },
    {
      id: "explore",
      icon: <Target size={34} />,
      title: "경쟁 서비스 탐색",
      desc: "입력한 아이디어와 유사한 서비스와 시장을 분석합니다.",
    },
    {
      id: "create",
      icon: <FileText size={34} />,
      title: "AI 기반 BMC 생성",
      desc: "입력한 정보를 바탕으로 AI가 BMC를 자동으로 생성합니다.",
    },
    {
      id: "analyze",
      icon: <BarChart3 size={34} />,
      title: "BMC 분석",
      desc: "생성된 BMC의 각 요소를 분석하고 개선 인사이트를 제공합니다.",
    },
    {
      id: "result",
      icon: <LogOut size={34} />,
      title: "결과 출력",
      desc: "분석 결과를 보고서로 정리하여 다운로드할 수 있습니다.",
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

      <div className="flex flex-col gap-6">
        {items.map((item) => {
          const active = activeStep === item.id;

          return (
            <div
              key={item.id}
              className={`
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
                  w-[72px] h-[72px]
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
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