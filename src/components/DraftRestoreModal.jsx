function DraftRestoreModal({
  open,
  onRestore,
  onNew,
}) {
  if (!open) return null;

  return (
    <div className="
      fixed
      inset-0
      bg-black/30
      flex
      items-center
      justify-center
      z-50
    ">
      <div className="
        w-[420px]
        rounded-2xl
        bg-white
        p-8
        shadow-xl
      ">
        <h2 className="text-xl font-bold mb-4">
          작성 중인 프로젝트가 있습니다
        </h2>

        <p className="text-gray-600 mb-8">
          이전에 작성하던 아이디어를 불러오시겠습니까?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onNew}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-gray-200
              font-bold
            "
          >
            새로 시작
          </button>

          <button
            onClick={onRestore}
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-bold
            "
          >
            불러오기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DraftRestoreModal;