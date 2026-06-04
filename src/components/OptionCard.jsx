function OptionCard({
  variant = "step",
  icon = null,
  title,
  description,
  selected = false,
  onClick,
}) {
  const selectedClass = selected
    ? "border-blue-500 bg-blue-50"
    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";

  if (variant === "select") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full px-6 py-5
          bg-white border rounded-xl
          flex items-center gap-4
          text-left
          transition-all duration-300
          active:scale-[0.98]
          ${selectedClass}
        `}
      >
        {icon && <div className="text-blue-500 shrink-0">{icon}</div>}

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full min-h-[140px] px-5 py-6
        bg-white border rounded-xl
        flex flex-col items-center justify-center
        text-center
        transition-all duration-300
        active:scale-[0.98]
        ${selectedClass}
      `}
    >
      {icon && <div className="mb-3 text-blue-500">{icon}</div>}

      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
}

export default OptionCard;