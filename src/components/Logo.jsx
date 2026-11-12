// 워드마크: 검은 사각형 안의 B + PlanB
function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[15px] font-bold leading-none">
        B
      </span>
      <span className="text-[17px] font-bold tracking-tight text-gray-900">
        PlanB
      </span>
    </span>
  );
}

export default Logo;
