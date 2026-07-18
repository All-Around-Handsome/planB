import { X, Search, ExternalLink } from "lucide-react";

function CompetitorListPanel({ open, onClose, services = [] }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 dim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      {/* 오른쪽 패널 */}
      <aside
        className="
          absolute
          top-0
          right-0
          h-full
          w-[460px]
          bg-white
          shadow-[-12px_0_40px_rgba(15,23,42,0.16)]
          flex
          flex-col
        "
      >
        {/* Header */}
        <div className="h-20 shrink-0 border-b border-gray-200 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              유사 서비스 전체 리스트
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              AI가 탐색한 경쟁 서비스 목록입니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-100
              transition
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {services.length > 0 ? (
            <div className="flex flex-col gap-4">
              {services.map((service, index) => (
                <div
                  key={service.serviceName || index}
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-[#F8FAFF]
                    p-5
                  "
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-bold text-blue-500 mb-1">
                        SERVICE {index + 1}
                      </p>

                      <h3 className="text-lg font-bold text-gray-900">
                        {service.serviceName || `유사 서비스 ${index + 1}`}
                      </h3>
                    </div>

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white
                        border
                        border-gray-100
                        flex
                        items-center
                        justify-center
                        text-blue-500
                        shrink-0
                      "
                    >
                      <Search size={20} />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-[#3D4770] leading-6">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">
                        서비스 개요
                      </p>

                      <p>
                        {service.coreFeatures}
                      </p>

                      <p className="mt-1">
                        수익 모델: {service.revenueModel}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-gray-900 mb-1">
                        현재 프로젝트와의 유사점
                      </p>
                      <p>
                        {service.category} 분야의 서비스이며,{" "}
                        {service.targetCustomer}을 대상으로 합니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-gray-900 mb-1">
                        차별화 참고점
                      </p>
                      <p>
                        {service.differentiation}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="
                      mt-4
                      h-9
                      px-4
                      rounded-lg
                      border
                      border-blue-200
                      bg-white
                      text-blue-600
                      text-sm
                      font-bold
                      flex
                      items-center
                      gap-2
                      hover:bg-blue-50
                      transition
                    "
                  >
                    상세 보기
                    <ExternalLink size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                h-full
                min-h-[360px]
                rounded-2xl
                border
                border-gray-200
                bg-[#F8FAFF]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-8
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  bg-blue-50
                  text-blue-500
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <Search size={30} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                유사 서비스가 없습니다
              </h3>

              <p className="text-sm text-[#3D4770] leading-6">
                AI가 현재 프로젝트 아이디어를 기준으로 탐색했지만,
                표시할 유사 서비스가 없는 경우 이 문구가 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CompetitorListPanel;