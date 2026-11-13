const BULLET = /^\s*(?:[•·\-*]|\d+[.)])\s+/;

// BMC 블록 내용: "• " 로 시작하는 줄은 점 목록으로, 나머지는 문단으로 보여 준다
// 버튼 안에서도 쓰이므로 span 만 쓴다
function BMCText({ text, empty = "비어 있음" }) {
  const lines = (text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return <span className="text-sm text-gray-300">{empty}</span>;
  }

  return (
    <span className="flex flex-col gap-1.5 text-sm leading-6 text-gray-700 break-words">
      {lines.map((line, index) =>
        BULLET.test(line) ? (
          <span key={index} className="flex gap-2">
            <span aria-hidden="true" className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />
            <span>{line.replace(BULLET, "")}</span>
          </span>
        ) : (
          <span key={index}>{line}</span>
        )
      )}
    </span>
  );
}

export default BMCText;
