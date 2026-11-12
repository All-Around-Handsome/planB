function Textarea({
  label,
  placeholder = "내용을 입력하세요",
  value,
  onChange,
  disabled = false,
  rows = 12,
  limit = 1000,
  maxLimit = 1500,
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
        <label className="text-sm font-semibold text-gray-900">{label}</label>
      )}

      <div className="relative rounded-2xl border border-gray-200 bg-white transition focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className="block w-full px-5 pt-4 pb-10 rounded-2xl bg-transparent text-[16px] leading-7 text-gray-900 resize-none outline-none placeholder:text-gray-400 disabled:text-gray-400"
        />

        <p
          className={`absolute bottom-3 right-4 text-xs tabular-nums ${
            isOverLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {value.length.toLocaleString()} / {limit.toLocaleString()}
        </p>
      </div>

      {isOverLimit && (
        <p className="text-sm text-red-500">
          아이디어 탐색은 {limit.toLocaleString()}자 이하일 때 가능해요.
        </p>
      )}
    </div>
  );
}

export default Textarea;
