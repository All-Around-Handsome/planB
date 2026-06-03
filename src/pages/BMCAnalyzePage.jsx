import MainLayout from "../layouts/MainLayout";
import BMCBox from "../components/BMCBox";

function BMCAnalyzePage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            BMC 분석 결과
          </h1>

          <div className="grid grid-cols-5 gap-4">

            <BMCBox
              title="고객 세그먼트"
              content="초기 창업자\n1인 창업 준비생"
            />

            <BMCBox
              title="가치 제안"
              content="AI 기반 BMC 자동 생성"
            />

            <BMCBox
              title="채널"
              content="웹 플랫폼\nSNS 마케팅"
            />

            <BMCBox
              title="고객 관계"
              content="AI 피드백 제공"
            />

            <BMCBox
              title="수익 구조"
              content="구독 모델"
            />

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default BMCAnalyzePage;