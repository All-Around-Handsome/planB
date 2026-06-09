import {
  Home,
  Lightbulb,
  Search,
  BarChart3,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function ProjectNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      icon: <Home size={24} />,
      label: "홈",
      path: "/",
    },
    {
      icon: <Lightbulb size={24} />,
      label: "아이디어 입력",
      path: "/idea",
    },
    {
      icon: <Search size={24} />,
      label: "경쟁 탐색",
      path: "/explore",
    },
    {
      icon: <BarChart3 size={24} />,
      label: "분석",
      path: "/bmc/analyze",
    },
    {
      icon: <User size={24} />,
      label: "마이페이지",
      path: "/my",
    },
  ];

  return (
    <aside
      className="
        relative
        w-[88px]
        shrink-0
        bg-[#F6F9FF]
        border-r
        border-gray-200
        overflow-visible
      "
    >
      {/* 왼쪽 둥근 책등 레이어 */}
      <div
        className="
          absolute
          inset-y-0
          left-0
          right-0
          bg-white
          rounded-l-[34px]
          border-l
          border-y
          border-gray-200
          shadow-[-14px_0_28px_rgba(15,23,42,0.08)]
        "
      />

      {/* 왼쪽 접힌 종이 느낌 라인 */}
      <div
        className="
          absolute
          left-3
          top-0
          bottom-0
          w-px
          bg-gradient-to-b
          from-transparent
          via-gray-200
          to-transparent
        "
      />

      {/* 오른쪽은 IdeaPage와 한몸처럼 직선 처리 */}
      <div
        className="
          absolute
          top-0
          right-0
          bottom-0
          w-px
          bg-gray-200
        "
      />

      {/* 메뉴 실제 영역 */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          py-7
        "
      >
        {/* 프로필 */}
        <button
          onClick={() => navigate("/my")}
          className="
            w-12
            h-12
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            text-xl
            font-bold
            shadow-[0_10px_24px_rgba(37,99,235,0.28)]
            mb-12
          "
        >
          B
        </button>

        {/* 메뉴 */}
        <div className="flex flex-col items-center gap-5">
          {menus.map((menu) => {
            const active = location.pathname === menu.path;

            return (
              <button
                key={menu.label}
                onClick={() => navigate(menu.path)}
                className={`
                  group
                  relative
                  w-12
                  h-12
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    active
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-[#071642] hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {menu.icon}

                <span
                  className="
                    absolute
                    left-[58px]
                    whitespace-nowrap
                    rounded-xl
                    bg-[#071642]
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-white
                    opacity-0
                    pointer-events-none
                    group-hover:opacity-100
                    transition
                    z-50
                  "
                >
                  {menu.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default ProjectNav;