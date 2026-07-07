function Input({
  label,
  placeholder = "내용을 입력하세요",
  value,
  onChange,
  disabled = false,
  type = "text",
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full
          h-12
          px-4
          rounded-xl
          bg-white
          border border-gray-300
          text-gray-800
          text-base
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
    </div>
  );
}

export default Input;