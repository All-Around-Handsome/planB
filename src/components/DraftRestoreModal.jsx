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
        <h2 className="text-xl font-bold mb-8">
          작성하던 아이디어를 불러올까요?
        </h2>

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