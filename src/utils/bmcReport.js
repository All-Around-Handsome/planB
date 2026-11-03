import jsPDF from "jspdf";
import "../assets/font/PretendardMedium.js";

import {
  BMC_FIELDS,
  TERM_LABELS,
  formatDate,
  getIdeaTitle,
  itemsToBmc,
} from "./bmc";

// 복사와 PDF가 같은 내용을 쓰도록 보고서를 구역 단위로 만든다
function buildSections(bmc) {
  const canvas = itemsToBmc(bmc.items);
  const sections = [];

  if (bmc.validityScore != null) {
    sections.push({
      title: `타당성 점수 ${bmc.validityScore}/10`,
      lines: bmc.scoreReason ? [bmc.scoreReason] : [],
    });
  }

  sections.push({
    title: "BMC",
    lines: BMC_FIELDS.map(({ key, label }) => `${label}: ${canvas[key] || "-"}`),
  });

  if (bmc.risks?.length) {
    sections.push({
      title: "리스크와 대응",
      lines: bmc.risks.map(
        (risk) => `${risk.riskContent} → ${risk.responseContent}`
      ),
    });
  }

  if (bmc.actions?.length) {
    sections.push({
      title: "실행 항목",
      lines: bmc.actions.map(
        (action) =>
          `[${TERM_LABELS[action.termType] || action.termType}] ${action.actionContent}`
      ),
    });
  }

  return sections;
}

export function buildReportText(bmc) {
  const body = buildSections(bmc)
    .map(({ title, lines }) => [title, ...lines.map((line) => `- ${line}`)].join("\n"))
    .join("\n\n");

  return `${getIdeaTitle(bmc.ideaText)} (${formatDate(bmc.createdAt)})\n\n${body}`;
}

export function downloadReportPdf(bmc) {
  const pdf = new jsPDF("p", "mm", "a4");
  pdf.setFont("PretendardMedium");

  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  let y = 18;

  const write = (text, fontSize, gap) => {
    pdf.setFontSize(fontSize);

    pdf.splitTextToSize(text, maxWidth).forEach((line) => {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 18;
      }

      pdf.text(line, margin, y);
      y += gap;
    });
  };

  const title = getIdeaTitle(bmc.ideaText);

  write(title, 16, 8);
  write(formatDate(bmc.createdAt), 10, 10);

  buildSections(bmc).forEach((section) => {
    write(section.title, 13, 8);
    section.lines.forEach((line) => write(line, 10, 6));
    y += 4;
  });

  const safeTitle = title.replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`${safeTitle}_${formatDate(bmc.createdAt)}.pdf`);
}
