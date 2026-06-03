function Textarea({
  label,
  placeholder = "내용을 입력하세요",
  value,
  onChange,
  disabled = false,
  rows = 6,
  limit = 500,
  maxLimit = 750,
}) {
  const isOverLimit = value.length > limit;

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > maxLimit) {
      onChange(inputValue.slice(0, maxLimit));
      return;
    }

    onChange(inputValue);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className="
            w-full
            px-4 py-4
            rounded-2xl
            bg-white
            border border-gray-300
            text-gray-800
            text-base
            resize-none
            outline-none
            transition-all duration-300
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-4 focus:ring-blue-100
            disabled:bg-gray-100
            disabled:text-gray-400
            disabled:cursor-not-allowed
          "
        />

        <p
          className={`absolute bottom-4 right-4 text-sm ${
            isOverLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {value.length} / {limit}
        </p>
      </div>

      {isOverLimit && (
        <p className="text-sm text-red-500">
          아이디어 탐색은 {limit}자 이하일 때 가능합니다.
        </p>
      )}
    </div>
  );
}

export default Textarea;