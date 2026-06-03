import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BMCBox from "../components/BMCBox";
import MemoBox from "../components/MemoBox";

function MyPage() {
  const [memo, setMemo] = useState("");

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            마이페이지
          </h1>

          <div className="grid grid-cols-2 gap-6">

            <BMCBox
              title="가치 제안"
              content={`
                AI 기반으로 BMC를 자동 생성하고
                분석할 수 있는 플랫폼
              `}
            />

            <MemoBox
              value={memo}
              onChange={setMemo}
              placeholder="BMC 메모를 입력하세요."
            />

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default MyPage;