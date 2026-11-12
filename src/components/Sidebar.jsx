import { NavLink } from "react-router-dom";

const STEPS = [
  { id: "idea", title: "아이디어", path: "/idea" },
  { id: "explore", title: "경쟁 탐색", path: "/explore" },
  { id: "create", title: "BMC 생성", path: "/bmc/create" },
  { id: "analyze", title: "BMC 분석", path: "/bmc/analyze" },
  { id: "result", title: "결과", path: "/bmc/result" },
];

// 작업 단계 이동: 넓은 화면은 세로 목록, 좁은 화면은 가로 탭
function Sidebar({ activeStep = "idea", variant = "desktop" }) {
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  if (variant === "desktop") {
    return (
      <aside className="hidden lg:block w-52 shrink-0 pt-10 pr-6">
        <p className="px-3 mb-3 text-xs font-semibold text-gray-400">진행 단계</p>

        <nav>
          <ol className="relative flex flex-col gap-1">
            {STEPS.map(({ id, title, path }, index) => {
              const active = id === activeStep;
              const done = index < activeIndex;

              return (
                <li key={id}>
                  <NavLink
                    to={path}
                    aria-current={active ? "step" : undefined}
                    className={`group h-10 px-3 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900 font-semibold"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center tabular-nums ${
                        active
                          ? "bg-gray-900 text-white"
                          : done
                            ? "bg-accent-soft text-accent"
                            : "border border-gray-200 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {title}
                  </NavLink>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
    );
  }

  return (
      <nav className="lg:hidden -mx-5 px-5 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <ol className="flex gap-1 py-2 min-w-max">
          {STEPS.map(({ id, title, path }, index) => {
            const active = id === activeStep;

            return (
              <li key={id}>
                <NavLink
                  to={path}
                  aria-current={active ? "step" : undefined}
                  className={`h-9 px-3 rounded-lg flex items-center gap-2 text-sm whitespace-nowrap ${
                    active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs tabular-nums text-gray-400">{index + 1}</span>
                  {title}
                </NavLink>
              </li>
            );
          })}
        </ol>
      </nav>
  );
}

export default Sidebar;
