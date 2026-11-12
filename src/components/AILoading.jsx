function AILoading({ title, description = "AI가 작업 중이에요. 30초~1분 정도 걸려요." }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center" role="status">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default AILoading;
