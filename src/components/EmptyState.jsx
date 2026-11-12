// 내용이 없거나 시작 전인 영역에 쓰는 안내 상자
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="min-h-[280px] rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-center px-8 py-12">
      {Icon && (
        <span className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center">
          <Icon size={20} />
        </span>
      )}
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        {description && <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="mt-1 flex flex-col items-center gap-3">{action}</div>}
    </div>
  );
}

export default EmptyState;
