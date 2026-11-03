import { BMC_FIELDS } from "../utils/bmc";

const LAYOUT = {
  keyPartners: "col-span-2 row-span-2",
  keyActivities: "col-span-2",
  valueProposition: "col-span-2 row-span-2",
  customerRelationships: "col-span-2",
  customerSegments: "col-span-2 row-span-2",
  keyResources: "col-span-2",
  channels: "col-span-2",
  costStructure: "col-span-5",
  revenueStreams: "col-span-5",
};

// onChange를 넘기면 입력 가능한 캔버스가 된다
function BMCDisplayCanvas({ data, onChange }) {
  return (
    <div className="grid grid-cols-10 gap-3 auto-rows-[minmax(190px,auto)]">
      {BMC_FIELDS.map(({ key, label }) => (
        <div
          key={key}
          className={`
            ${LAYOUT[key]}
            min-w-0
            flex
            flex-col
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            transition
            focus-within:border-blue-500
            focus-within:ring-2
            focus-within:ring-blue-100
          `}
        >
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            {label}
          </h3>

          {onChange ? (
            <textarea
              aria-label={label}
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="flex-1 w-full min-h-[120px] resize-none outline-none text-sm text-[#3D4770] leading-6"
            />
          ) : (
            <p className="text-sm text-[#3D4770] leading-6 whitespace-pre-line break-words">
              {data[key] || "-"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default BMCDisplayCanvas;
