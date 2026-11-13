import { BMC_FIELDS } from "../utils/bmc";
import BMCText from "./BMCText";

// BMC 표준 배치 (넓은 화면 10칸 기준)
const LAYOUT = {
  keyPartners: "lg:col-span-2 lg:row-span-2",
  keyActivities: "lg:col-span-2",
  valueProposition: "lg:col-span-2 lg:row-span-2",
  customerRelationships: "lg:col-span-2",
  customerSegments: "lg:col-span-2 lg:row-span-2",
  keyResources: "lg:col-span-2",
  channels: "lg:col-span-2",
  costStructure: "lg:col-span-5",
  revenueStreams: "lg:col-span-5",
};

const HINTS = {
  keyPartners: "함께할 파트너나 공급자는 누구인가요?",
  keyActivities: "가치를 만들기 위해 꼭 해야 하는 일은?",
  valueProposition: "고객의 어떤 문제를 어떻게 해결하나요?",
  customerRelationships: "고객과 어떤 관계를 맺나요?",
  customerSegments: "누구를 위한 서비스인가요?",
  keyResources: "꼭 필요한 자원은 무엇인가요?",
  channels: "고객에게 어떻게 닿나요?",
  costStructure: "주요 비용은 어디서 생기나요?",
  revenueStreams: "어떻게 돈을 버나요?",
};

const REQUIRED = ["valueProposition", "customerSegments"];

// onChange를 넘기면 입력 가능한 캔버스가 된다
function BMCDisplayCanvas({ data, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-2 lg:auto-rows-[minmax(170px,auto)]">
      {BMC_FIELDS.map(({ key, label }) => {
        const highlight = key === "valueProposition";

        return (
          <div
            key={key}
            className={`${LAYOUT[key]} min-w-0 flex flex-col rounded-xl border p-4 transition ${
              highlight ? "border-accent/30 bg-accent-soft/50" : "border-gray-200 bg-white"
            } ${onChange ? "focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100" : ""}`}
          >
            <h3 className={`text-[13px] font-semibold mb-2 flex items-center gap-1 ${highlight ? "text-accent" : "text-gray-500"}`}>
              {label}
              {onChange && REQUIRED.includes(key) && <span className="text-red-400">*</span>}
            </h3>

            {onChange ? (
              <textarea
                aria-label={label}
                value={data[key]}
                placeholder={HINTS[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="flex-1 w-full min-h-[110px] bg-transparent resize-none outline-none text-sm text-gray-800 leading-6 placeholder:text-gray-300"
              />
            ) : (
              <BMCText text={data[key]} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BMCDisplayCanvas;
