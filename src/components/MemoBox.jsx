function MemoBox({
  value,
  onChange,
  placeholder = "메모를 입력하세요.",
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        메모
      </h4>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full
          min-h-[90px]
          resize-none
          outline-none
          text-sm
          text-gray-700
          placeholder:text-gray-400
          disabled:bg-gray-50
          disabled:text-gray-400
        "
      />
    </div>
  );
}

export default MemoBox;