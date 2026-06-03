import { ArrowRight } from "lucide-react";

function Button({ children = "시작하기", onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        group
        inline-flex items-center justify-center gap-4
        min-w-[200px] h-14 px-8
        rounded-full
        bg-white
        border border-blue-500
        text-blue-500
        font-semibold text-lg
        shadow-[0_8px_24px_rgba(59,130,246,0.18)]
        transition-all duration-300
        hover:bg-blue-50 hover:shadow-[0_10px_30px_rgba(59,130,246,0.28)]
        active:scale-95
        disabled:border-gray-300 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed
      "
    >
      <span
        className="
          flex items-center justify-center
          w-8 h-8 rounded-full
          bg-blue-500 text-white
          transition-all duration-300
          group-hover:bg-blue-600
          group-disabled:bg-gray-300
        "
      >
        <ArrowRight size={20} strokeWidth={2.5} />
      </span>

      <span>{children}</span>
    </button>
  );
}

export default Button;