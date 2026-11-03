import {
  Edit3,
  LayoutTemplate,
  Search,
  BarChart3,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { id: "idea", icon: Edit3, title: "아이디어", path: "/idea" },
  { id: "explore", icon: Search, title: "경쟁 탐색", path: "/explore" },
  { id: "create", icon: LayoutTemplate, title: "BMC 생성", path: "/bmc/create" },
  { id: "analyze", icon: BarChart3, title: "BMC 분석", path: "/bmc/analyze" },
  { id: "result", icon: FileText, title: "결과", path: "/bmc/result" },
];

function Sidebar({ activeStep = "idea" }) {
  const navigate = useNavigate();

  return (
    <aside className="w-[200px] shrink-0 bg-[#F6F9FF] border-r border-gray-200 px-4 py-8">
      <nav className="flex flex-col gap-2">
        {STEPS.map(({ id, icon: Icon, title, path }) => {
          const active = activeStep === id;

          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              aria-current={active ? "step" : undefined}
              className={`
                h-12
                px-4
                rounded-xl
                flex
                items-center
                gap-3
                text-sm
                font-bold
                transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-[#3D4770] hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              <Icon size={18} />
              {title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
