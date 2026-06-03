import { useState } from "react";
import { Search, FileText, BarChart3, Edit3, Globe, XCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import OptionCard from "../components/OptionCard";

function IdeaPage() {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaContent, setIdeaContent] = useState("");
  const [selectedStep, setSelectedStep] = useState("explore");
  const [searchOption, setSearchOption] = useState("withSearch");

  return (
    <MainLayout>
      <div className="min-h-[80vh] bg-[#F9FAFB] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            아이디어 입력
          </h1>

          <p className="text-gray-500 mb-10">
            사업 아이디어를 입력하고 BMC 생성 단계를 선택해보세요.
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              1. 아이디어 입력
            </h2>

            <div className="mb-5">
              <Input
                label="아이디어 제목"
                placeholder="예: AI 기반 BMC 자동 생성 서비스"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
              />
            </div>

            <Textarea
              label="아이디어 설명"
              placeholder="아이디어를 자세히 입력해주세요."
              value={ideaContent}
              onChange={setIdeaContent}
              rows={8}
              limit={500}
              maxLimit={750}
            />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              2. 진행 단계 선택
            </h2>

            <div className="grid grid-cols-4 gap-4">
              <OptionCard
                variant="step"
                icon={<Search size={28} />}
                title="아이디어 탐색"
                description="아이디어 방향성을 탐색합니다."
                selected={selectedStep === "explore"}
                onClick={() => setSelectedStep("explore")}
              />

              <OptionCard
                variant="step"
                icon={<FileText size={28} />}
                title="BMC 생성"
                description="입력 내용을 기반으로 BMC를 생성합니다."
                selected={selectedStep === "create"}
                onClick={() => setSelectedStep("create")}
              />

              <OptionCard
                variant="step"
                icon={<BarChart3 size={28} />}
                title="BMC 분석"
                description="생성된 BMC를 분석합니다."
                selected={selectedStep === "analyze"}
                onClick={() => setSelectedStep("analyze")}
              />

              <OptionCard
                variant="step"
                icon={<Edit3 size={28} />}
                title="BMC 편집"
                description="BMC 내용을 수정하고 보완합니다."
                selected={selectedStep === "edit"}
                onClick={() => setSelectedStep("edit")}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              3. 경쟁 서비스 탐색 설정
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <OptionCard
                variant="select"
                icon={<Globe size={28} />}
                title="경쟁 탐색 진행"
                description="유사 서비스와 시장 정보를 함께 탐색합니다."
                selected={searchOption === "withSearch"}
                onClick={() => setSearchOption("withSearch")}
              />

              <OptionCard
                variant="select"
                icon={<XCircle size={28} />}
                title="탐색 없이 BMC 생성"
                description="경쟁 탐색 없이 바로 BMC를 생성합니다."
                selected={searchOption === "withoutSearch"}
                onClick={() => setSearchOption("withoutSearch")}
              />
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default IdeaPage;