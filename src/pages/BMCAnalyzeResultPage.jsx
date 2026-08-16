import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ProjectNav from "../components/ProjectNav.jsx";
import BMCDisplayCanvas from "../components/BMCDisplayCanvas";

import "../assets/font/PretendardMedium.js";

function BMCAnalyzeResultPage() {
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState("");

  const [project, setProject] = useState({
    ideaTitle: "",
    ideaContent: "",
    totalScore: 82,
    summary:
      "현재 비즈니스 모델은 고객 문제와 가치 제안이 비교적 명확하며, 초기 시장 진입 가능성이 있습니다. 다만 수익 구조와 고객 관계 전략을 조금 더 구체화할 필요가 있습니다.",
  });

  const createdAt = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const scoreItems = [
    {
      title: "시장 적합성",
      score: 86,
      desc: "고객 문제와 제공 가치가 비교적 잘 연결되어 있습니다.",
    },
    {
      title: "수익 가능성",
      score: 78,
      desc: "수익 흐름은 존재하지만 구체적인 가격 전략 보완이 필요합니다.",
    },
    {
      title: "실행 가능성",
      score: 84,
      desc: "초기 MVP 수준에서 구현 가능한 구조로 보입니다.",
    },
  ];

  const keyResults = [
    {
      icon: <CheckCircle2 size={30} strokeWidth={1.8} />,
      title: "강점",
      desc: "고객 문제와 가치 제안이 명확하게 연결되어 있어 서비스 방향성이 분명합니다.",
    },
    {
      icon: <Target size={30} strokeWidth={1.8} />,
      title: "보완점",
      desc: "고객 세그먼트와 수익 구조를 더 구체적으로 정의하면 사업성이 높아질 수 있습니다.",
    },
    {
      icon: <Lightbulb size={30} strokeWidth={1.8} />,
      title: "개선 방향",
      desc: "초기 타깃 고객을 좁히고 핵심 기능 중심의 MVP 전략을 먼저 수립하는 것이 좋습니다.",
    },
  ];

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

  const bmcData = {
    valueProposition:
      bmcCanvasItems.find((item) => item.title === "가치 제안")?.content || "",

    customerSegments:
      bmcCanvasItems.find((item) => item.title === "고객 세그먼트")?.content || "",

    revenueStreams:
      bmcCanvasItems.find((item) => item.title === "수익 구조")?.content || "",

    costStructure:
      bmcCanvasItems.find((item) => item.title === "비용 구조")?.content || "",

    keyPartners:
      bmcCanvasItems.find((item) => item.title === "핵심 파트너")?.content || "",

    keyActivities:
      bmcCanvasItems.find((item) => item.title === "핵심 활동")?.content || "",

    keyResources:
      bmcCanvasItems.find((item) => item.title === "핵심 자원")?.content || "",

    channels:
      bmcCanvasItems.find((item) => item.title === "채널")?.content || "",

    customerRelationships:
      bmcCanvasItems.find((item) => item.title === "고객 관계")?.content || "",
  };

  const actionItems = [
    "초기 타깃 고객을 더 구체적으로 정의합니다.",
    "수익 구조를 구독형, 건당 결제형, 프리미엄 모델 중 하나로 구체화합니다.",
    "MVP에서 반드시 필요한 핵심 기능을 우선순위 기준으로 정리합니다.",
  ];

  const reportSections = [
    {
      title: "1. 비즈니스 모델 요약",
      desc: "아이디어의 핵심 가치, 고객 대상, 수익 구조를 기반으로 전체 사업 모델을 요약합니다.",
    },
    {
      title: "2. BMC 요소별 분석",
      desc: "가치 제안, 고객 세그먼트, 채널, 수익 구조 등 9가지 요소별 분석 결과가 포함됩니다.",
    },
    {
      title: "3. 경쟁 서비스 기반 인사이트",
      desc: "유사 서비스와 비교했을 때의 차별점과 시장 기회 요약이 포함됩니다.",
    },
    {
      title: "4. 개선 제안",
      desc: "사업 모델을 보완하기 위한 구체적인 실행 방향과 우선순위가 정리됩니다.",
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
[PlanB BMC 전체 분석 결과]

아이디어명: ${project.ideaTitle}
생성일: ${createdAt}

1. 최종 분석 결과
종합 점수: ${project.totalScore}/100
요약: ${project.summary}

2. 세부 평가
${scoreItems
  .map((item) => `- ${item.title}: ${item.score}점\n  ${item.desc}`)
  .join("\n")}

3. 핵심 분석 요약
${keyResults.map((item) => `- ${item.title}: ${item.desc}`).join("\n")}

4. BMC 캔버스
${bmcCanvasItems.map((item) => `- ${item.title}: ${item.content}`).join("\n")}

5. 액션 아이템
${actionItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`.trim();

    try {
      await navigator.clipboard.writeText(copyText);
      showToast("BMC 전체 분석 결과가 클립보드에 복사되었습니다.");
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
      pdf.text("PlanB BMC Analysis Report", margin, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setFont("PretendardMedium");
      pdf.text(`Idea: ${project.ideaTitle}`, margin, y);
      y += 7;
      pdf.text(`Created At: ${createdAt}`, margin, y);
      y += 12;

      // 1. Final Result
      addTitle("1. Final Analysis Result");
      addText(`Total Score: ${project.totalScore}/100`);
      addText(`Summary: ${project.summary}`);

      // 2. Scores
      addTitle("2. Detail Scores");

      scoreItems.forEach((item) => {
        addSubTitle(`${item.title} - ${item.score} points`);
        addText(item.desc);
      });

      // 3. Key Results
      addTitle("3. Key Analysis Summary");

      keyResults.forEach((item) => {
        addSubTitle(item.title);
        addText(item.desc);
      });

      // 4. BMC Canvas
      addTitle("4. BMC Canvas");

      bmcCanvasItems.forEach((item, index) => {
        addSubTitle(`${index + 1}. ${item.title}`);
        addText(item.content);
      });

      // 5. Action Items
      addTitle("5. Action Items");

      actionItems.forEach((item, index) => {
        addText(`${index + 1}. ${item}`);
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
    navigate("/bmc/analyze");
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
                          PlanB BMC 분석 보고서
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900">
                          {project.ideaTitle || "아이디어 제목 입력"}
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

                {/* 1. 최종 분석 결과 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    1. 최종 분석 결과
                  </h2>

                  <div className="grid grid-cols-[330px_1fr] gap-6">
                    {/* Score Card */}
                    <div
                      className="
                        rounded-2xl
                        border-2
                        border-blue-500
                        bg-white
                        p-7
                        shadow-sm
                      "
                    >
                      <div className="flex items-center gap-2 text-blue-600 font-bold mb-5">
                        <Sparkles size={20} />
                        AI 종합 평가
                      </div>

                      <div className="flex items-end gap-2 mb-5">
                        <span className="text-6xl font-extrabold text-gray-900">
                          {project.totalScore}
                        </span>
                        <span className="text-2xl font-bold text-gray-400 mb-2">
                          / 100
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-5">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${project.totalScore}%` }}
                        />
                      </div>

                      <p className="text-sm text-[#3D4770] leading-6">
                        현재 BMC는 사업화 가능성이 높은 편이며, 일부 요소를 보완하면 더 완성도 있는 모델로 발전할 수 있습니다.
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="rounded-2xl border border-gray-200 bg-[#F8FAFF] p-7">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={22} className="text-blue-500" />
                        <h3 className="text-xl font-bold text-gray-900">
                          결과 요약
                        </h3>
                      </div>

                      <p className="text-base font-medium text-[#071642] leading-8 whitespace-pre-line mb-6">
                        {project.summary}
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        {scoreItems.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-xl bg-white border border-gray-100 p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-bold text-gray-900">
                                {item.title}
                              </h4>

                              <span className="text-blue-600 font-extrabold">
                                {item.score}
                              </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-3">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>

                            <p className="text-xs text-[#3D4770] leading-5">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. 핵심 분석 요약 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    2. 핵심 분석 요약
                  </h2>

                  <div className="grid grid-cols-3 gap-5">
                    {keyResults.map((item) => (
                      <div
                        key={item.title}
                        className="
                          min-h-[165px]
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-6
                          shadow-sm
                        "
                      >
                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-blue-50
                            text-blue-500
                            flex
                            items-center
                            justify-center
                            mb-5
                          "
                        >
                          {item.icon}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>

                        <p className="text-sm text-[#3D4770] leading-6">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. BMC 캔버스 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    3. BMC 캔버스
                  </h2>

                  <BMCDisplayCanvas data={bmcData} />
                </section>

                {/* 4. 결과 보고서 구성 */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    4. 결과 보고서 구성
                  </h2>

                  <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="h-12 bg-[#F8FAFF] border-b border-gray-200 flex items-center px-6 gap-2">
                      <ShieldCheck size={20} className="text-blue-500" />

                      <span className="font-bold text-gray-900">
                        다운로드되는 보고서에 포함될 내용
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-0">
                      {reportSections.map((section, index) => (
                        <div
                          key={section.title}
                          className={`
                            p-6
                            ${index % 2 === 0 ? "border-r border-gray-100" : ""}
                            ${index < 2 ? "border-b border-gray-100" : ""}
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="
                                w-9
                                h-9
                                rounded-full
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                text-sm
                                font-extrabold
                                shrink-0
                              "
                            >
                              {index + 1}
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-gray-900 mb-2">
                                {section.title}
                              </h3>

                              <p className="text-sm text-[#3D4770] leading-6">
                                {section.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 5. 액션 아이템 */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    5. 액션 아이템
                  </h2>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <Sparkles size={20} className="text-blue-500" />

                      <h3 className="text-base font-bold text-gray-900">
                        다음 단계에서 실행할 항목
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      {actionItems.map((item, index) => (
                        <div
                          key={item}
                          className="
                            flex
                            items-start
                            gap-4
                            rounded-xl
                            bg-[#F8FAFF]
                            border
                            border-gray-100
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              w-8
                              h-8
                              rounded-full
                              bg-blue-600
                              text-white
                              flex
                              items-center
                              justify-center
                              text-sm
                              font-bold
                              shrink-0
                            "
                          >
                            {index + 1}
                          </div>

                          <p className="text-sm text-[#3D4770] leading-6 font-medium">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
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
                  분석으로 돌아가기
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

export default BMCAnalyzeResultPage;