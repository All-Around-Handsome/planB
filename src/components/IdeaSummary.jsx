import { useState } from "react";

// 입력한 아이디어를 접어서 보여 준다 (길면 더보기)
function IdeaSummary({ text, label = "내 아이디어" }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 140;

  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 mb-1.5">{label}</p>
      <p className={`text-[15px] leading-7 text-gray-700 whitespace-pre-line ${!open && long ? "line-clamp-2" : ""}`}>
        {text}
      </p>
      {long && (
        <button onClick={() => setOpen(!open)} className="mt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
          {open ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
}

export default IdeaSummary;
