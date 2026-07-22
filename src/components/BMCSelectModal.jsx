import { Sparkles, Lightbulb } from "lucide-react";

function BMCSelectModal({
  open,
  onClose,
  onAI,
  onWrite,
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          w-[520px]
          rounded-3xl
          bg-white
          p-8
          shadow-xl
        "
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          BMC 작성 방식 선택
        </h2>

        <div className="grid grid-cols-2 gap-5">

          {/* AI 생성 */}
          <button
            onClick={onAI}
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              text-left
              hover:border-blue-500
              hover:bg-blue-50/30
              transition
              active:scale-[0.98]
            "
          >
            <Sparkles
              className="text-blue-600 mb-4"
              size={28}
            />

            <h3 className="font-bold text-gray-900 mb-2">
              AI 기반 BMC 생성
            </h3>

            <p className="text-sm text-[#3D4770] leading-5">
              아이디어를 기반으로
              AI가 BMC를 자동 작성합니다.
            </p>
          </button>


          {/* 직접 작성 */}
          <button
            onClick={onWrite}
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              text-left
              hover:border-blue-500
              hover:bg-blue-50/30
              transition
              active:scale-[0.98]
            "
          >
            <Lightbulb
              className="text-blue-600 mb-4"
              size={28}
            />

            <h3 className="font-bold text-gray-900 mb-2">
              BMC 직접 작성
            </h3>

            <p className="text-sm text-[#3D4770] leading-5">
              직접 BMC Canvas를 작성하고
              AI 분석을 진행합니다.
            </p>
          </button>

        </div>


        {/* 취소 */}
        <button
          onClick={onClose}
          className="
            mt-6
            w-full
            h-11
            rounded-xl
            border
            border-gray-200
            text-gray-600
            font-bold
            hover:bg-gray-200
            hover:border-gray-300
            transition
            active:scale-[0.98]
          "
        >
          취소
        </button>

      </div>
    </div>
  );
}

export default BMCSelectModal;