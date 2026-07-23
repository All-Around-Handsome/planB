// src/components/bmc/BMCDisplayCanvas.jsx

function BMCDisplayCanvas({ data }) {
  return (
    <>
      {/* 상단 5열 영역 */}
      <div className="grid grid-cols-5 gap-4 h-[430px]">
        {/* 핵심 파트너 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            핵심 파트너
          </h3>

          <p className="text-sm text-[#3D4770] leading-6">
            {data.keyPartners}
          </p>
        </div>

        {/* 핵심 활동 + 핵심 자원 */}
        <div className="grid grid-rows-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              핵심 활동
            </h3>

            <p className="text-sm text-[#3D4770] leading-6">
              {data.keyActivities}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              핵심 자원
            </h3>

            <p className="text-sm text-[#3D4770] leading-6">
              {data.keyResources}
            </p>
          </div>
        </div>

        {/* 가치 제안 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            가치 제안
          </h3>

          <p className="text-sm text-[#3D4770] leading-6">
            {data.valueProposition}
          </p>
        </div>

        {/* 고객 관계 + 채널 */}
        <div className="grid grid-rows-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              고객 관계
            </h3>

            <p className="text-sm text-[#3D4770] leading-6">
              {data.customerRelationships}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              채널
            </h3>

            <p className="text-sm text-[#3D4770] leading-6">
              {data.channels}
            </p>
          </div>
        </div>

        {/* 고객 세그먼트 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            고객 세그먼트
          </h3>

          <p className="text-sm text-[#3D4770] leading-6">
            {data.customerSegments}
          </p>
        </div>
      </div>

      {/* 비용 구조 / 수익 구조 */}
      <div className="grid grid-cols-2 gap-4 mt-4 h-[150px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            비용 구조
          </h3>

          <p className="text-sm text-[#3D4770] leading-6">
            {data.costStructure}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            수익 구조
          </h3>

          <p className="text-sm text-[#3D4770] leading-6">
            {data.revenueStreams}
          </p>
        </div>
      </div>
    </>
  );
}

export default BMCDisplayCanvas;