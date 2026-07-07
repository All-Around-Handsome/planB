function BMCBox({
  title,
  content,
  height = "min-h-[220px]",
}) {
  return (
    <div
      className={`
        bg-white
        border border-gray-200
        rounded-2xl
        p-5
        ${height}
      `}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="text-sm text-gray-600 leading-7 whitespace-pre-line">
        {content || "내용이 없습니다."}
      </div>
    </div>
  );
}

export default BMCBox;