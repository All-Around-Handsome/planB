import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import {
  ArrowRight,
  Copy,
  Download,
  RotateCcw,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import ProjectNav from "../components/ProjectNav";

import "../assets/font/PretendardMedium.js";

function BMCResultPage() {
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState("");

  /**
   * 지금은 프론트 디자인용 임시 결과 데이터
   * 나중에는 백엔드에서 현재 projectId 기준으로 받아오면 됨
   */
  const project = {
    ideaTitle: "아이디어 페이지에서 입력한 제목이 표시됩니다",
    ideaContent:
      "아이디어 페이지에서 입력한 아이디어 내용이 이 영역에 표시됩니다.",
  };

  const createdAt = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const bmcCanvasItems = [
    {
      title: "가치 제안",
      content: "고객의 문제를 해결할 수 있는 핵심 가치를 제공합니다.",
    },
    {
      title: "고객 세그먼트",
      content: "초기 사용 가능성이 높은 고객군을 중심으로 설정합니다.",
    },
    {
      title: "수익 구조",
      content: "서비스 이용료 또는 프리미엄 기능 기반 수익 모델을 고려합니다.",
    },
    {
      title: "비용 구조",
      content: "개발, 운영, 마케팅 비용이 주요 비용 요소입니다.",
    },
    {
      title: "핵심 파트너",
      content: "데이터 제공사, 플랫폼, 마케팅 채널 등이 포함될 수 있습니다.",
    },
    {
      title: "핵심 활동",
      content: "서비스 개발, 고객 검증, 시장 분석이 핵심 활동입니다.",
    },
    {
      title: "핵심 자원",
      content: "AI 분석 기술, 사용자 데이터, 서비스 운영 인력이 필요합니다.",
    },
    {
      title: "채널",
      content: "웹 서비스, SNS, 검색 광고 등을 통해 고객에게 접근합니다.",
    },
    {
      title: "고객 관계",
      content: "초기 고객 피드백을 기반으로 지속적인 관계를 형성합니다.",
    },
  ];

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2200);
  };

  const handleCopyResult = async () => {
    const copyText = `
    [PlanB AI 생성 BMC]

    아이디어명: ${project.ideaTitle}

    BMC 캔버스

    ${bmcCanvasItems
    .map((item) => `- ${item.title}: ${item.content}`)
    .join("\n")}
    `.trim();

    try {
      await navigator.clipboard.writeText(copyText);
      showToast("BMC가 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error(error);
      showToast("복사 중 오류가 발생했습니다.");
    }
  };

  const handleDownload = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("PretendardMedium");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 14;
      const lineHeight = 7;
      const maxWidth = pageWidth - margin * 2;

      let y = 18;

      const addPageIfNeeded = () => {
        if (y > pageHeight - 20) {
          pdf.addPage();
          y = 18;
        }
      };

      const addTitle = (text) => {
        addPageIfNeeded();

        pdf.setFontSize(15);
        pdf.setFont("PretendardMedium");
        pdf.text(text, margin, y);

        y += 10;
      };

      const addSubTitle = (text) => {
        addPageIfNeeded();

        pdf.setFontSize(12);
        pdf.setFont("PretendardMedium");
        pdf.text(text, margin, y);

        y += 8;
      };

      const addText = (text) => {
        pdf.setFontSize(10);
        pdf.setFont("PretendardMedium");

        const lines = pdf.splitTextToSize(text, maxWidth);

        lines.forEach((line) => {
          addPageIfNeeded();
          pdf.text(line, margin, y);
          y += lineHeight;
        });

        y += 2;
      };

      // PDF Header
      pdf.setFontSize(16);
      pdf.setFont("PretendardMedium");
      pdf.text("PlanB AI Generated BMC", margin, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setFont("PretendardMedium");
      pdf.text(`Idea: ${project.ideaTitle}`, margin, y);
      y += 7;
      pdf.text(`Created At: ${createdAt}`, margin, y);
      y += 12;

      // 1. BMC Canvas
      addTitle("1. BMC Canvas");

      bmcCanvasItems.forEach((item, index) => {
        addSubTitle(`${index + 1}. ${item.title}`);
        addText(item.content);
      });

      const safeTitle = project.ideaTitle
        ? project.ideaTitle.replace(/[\\/:*?"<>|]/g, "")
        : "BMC_Analysis_Report";

      pdf.save(`${safeTitle}_${createdAt.replace(/\./g, "-")}.pdf`);

      showToast("PDF 보고서가 다운로드되었습니다.");
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      showToast("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const handlePrev = () => {
    navigate("/bmc/idea");
  };

  const handleMyPage = () => {
    navigate("/my");
  };

  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex">
          <Sidebar activeStep="result" />

          <ProjectNav />

          <main className="flex-1 flex flex-col self-stretch">
            {/* 상단 헤더 */}
            <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-12">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.ideaTitle || "아이디어 제목 입력"}
              </h1>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyResult}
                  className="
                    h-10
                    px-5
                    rounded-xl
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
                    active:scale-[0.98]
                    transition
                  "
                >
                  <Copy size={17} />
                  결과 복사
                </button>

                <button
                  onClick={handleDownload}
                  className="
                    h-10
                    px-5
                    rounded-xl
                    bg-blue-600
                    text-white
                    text-sm
                    font-bold
                    flex
                    items-center
                    gap-2
                    hover:bg-blue-700
                    active:scale-[0.98]
                    transition
                  "
                >
                  <Download size={17} />
                  PDF 다운로드
                </button>
              </div>
            </header>

            {/* 콘텐츠 */}
            <div className="flex-1 px-12 pt-8 pb-8">
              <div id="bmc-result-report" className="max-w-[1120px] bg-white">
                {/* 보고서 메타 정보 */}
                <section className="mb-8">
                  <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-blue-600 mb-2">
                          PlanB AI 생성 BMC
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900">
                          {project.ideaTitle}
                        </h2>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">생성일</p>
                        <p className="text-base font-bold text-gray-900">
                          {createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 1. BMC 캔버스 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    1. BMC 캔버스
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    {bmcCanvasItems.map((item, index) => (
                      <div
                        key={item.title}
                        className="
                          min-h-[135px]
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                        "
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="
                              w-7
                              h-7
                              rounded-full
                              bg-blue-50
                              text-blue-600
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-extrabold
                            "
                          >
                            {index + 1}
                          </div>

                          <h3 className="text-base font-bold text-gray-900">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-sm text-[#3D4770] leading-6">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* 하단 버튼 */}
            <footer className="h-[77px] shrink-0 border-t border-gray-200 flex items-center justify-end px-12 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="
                    h-11
                    px-6
                    rounded-xl
                    border
                    border-blue-200
                    text-blue-600
                    font-bold
                    flex
                    items-center
                    gap-2
                    hover:bg-blue-50
                    active:scale-[0.98]
                    transition
                  "
                >
                  <RotateCcw size={18} />
                  아이디어 수정하기
                </button>

                <button
                  onClick={handleMyPage}
                  className="
                    h-11
                    px-7
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-bold
                    flex
                    items-center
                    gap-2
                    hover:bg-blue-700
                    active:scale-[0.98]
                    transition
                  "
                >
                  마이페이지 이동
                  <ArrowRight size={18} />
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          className="
            fixed
            bottom-8
            left-1/2
            -translate-x-1/2
            z-[9999]
            rounded-full
            bg-[#071642]
            text-white
            px-6
            py-3
            text-sm
            font-bold
            shadow-[0_12px_32px_rgba(15,23,42,0.24)]
            animate-[toastUp_0.25s_ease]
          "
        >
          {toastMessage}
        </div>
      )}

      <style>
        {`
          @keyframes toastUp {
            from {
              opacity: 0;
              transform: translate(-50%, 12px);
            }

            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

export default BMCResultPage;