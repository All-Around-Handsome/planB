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

const PT_TO_MM = 0.3528;
const COLORS = {
  border: [229, 231, 235],
  label: [107, 114, 128],
  text: [55, 65, 81],
  title: [17, 24, 39],
  accent: [37, 99, 235],
  accentSoft: [239, 244, 255],
};

// 캔버스 표준 배치: 위쪽 5열(가운데가 가치 제안), 아래쪽 비용 구조 | 수익 구조
// [열, 행, 열 폭, 행 높이] — 위쪽은 2행, 아래쪽은 1행
const CANVAS_CELLS = {
  keyPartners: [0, 0, 1, 2],
  keyActivities: [1, 0, 1, 1],
  keyResources: [1, 1, 1, 1],
  valueProposition: [2, 0, 1, 2],
  customerRelationships: [3, 0, 1, 1],
  channels: [3, 1, 1, 1],
  customerSegments: [4, 0, 1, 2],
  costStructure: [0, 2, 2.5, 1],
  revenueStreams: [2.5, 2, 2.5, 1],
};

// 칸 안에 들어갈 때까지 글자 크기를 줄이고, 그래도 넘치면 말줄임한다
function fitText(pdf, text, width, height) {
  const paragraphs = (text || "-").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (let size = 9; size >= 5.5; size -= 0.5) {
    pdf.setFontSize(size);
    const lineHeight = size * PT_TO_MM * 1.45;
    const lines = paragraphs.flatMap((paragraph) => pdf.splitTextToSize(paragraph, width));

    if (lines.length * lineHeight <= height || size === 5.5) {
      const maxLines = Math.max(1, Math.floor(height / lineHeight));

      if (lines.length > maxLines) {
        lines.length = maxLines;
        lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -1)}…`;
      }

      return { lines, size, lineHeight };
    }
  }

  return { lines: [], size: 5.5, lineHeight: 3 };
}

function drawCanvasPage(pdf, bmc, title) {
  const canvas = itemsToBmc(bmc.items);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const gap = 2;
  const top = 24;

  pdf.setTextColor(...COLORS.title);
  pdf.setFontSize(15);
  pdf.text(title, margin, 15);
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.label);
  pdf.text(`비즈니스 모델 캔버스 · ${formatDate(bmc.createdAt)}`, pageWidth - margin, 15, { align: "right" });

  const width = pageWidth - margin * 2;
  const height = pageHeight - top - margin;
  const colWidth = width / 5;
  const upperRowHeight = (height * 0.7) / 2;
  const lowerRowHeight = height * 0.3;

  BMC_FIELDS.forEach(({ key, label }) => {
    const [col, row, colSpan, rowSpan] = CANVAS_CELLS[key];
    const x = margin + col * colWidth + gap / 2;
    const y = top + (row < 2 ? row * upperRowHeight : upperRowHeight * 2) + gap / 2;
    const w = colSpan * colWidth - gap;
    const h = (row < 2 ? rowSpan * upperRowHeight : lowerRowHeight) - gap;
    const highlight = key === "valueProposition";

    pdf.setDrawColor(...(highlight ? COLORS.accent : COLORS.border));
    pdf.setFillColor(...(highlight ? COLORS.accentSoft : [255, 255, 255]));
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, y, w, h, 2, 2, "FD");

    const padding = 3.5;
    pdf.setFontSize(8);
    pdf.setTextColor(...(highlight ? COLORS.accent : COLORS.label));
    pdf.text(label, x + padding, y + padding + 2.5);

    const textTop = y + padding + 8;
    const { lines, size, lineHeight } = fitText(pdf, canvas[key], w - padding * 2, h - (textTop - y) - padding);

    pdf.setFontSize(size);
    pdf.setTextColor(...COLORS.text);
    lines.forEach((line, index) => {
      pdf.text(line, x + padding, textTop + index * lineHeight);
    });
  });
}

export function downloadReportPdf(bmc) {
  const title = getIdeaTitle(bmc.ideaText);

  // 1쪽: 가로 A4 한 장에 캔버스를 그린다
  const pdf = new jsPDF("l", "mm", "a4");
  pdf.setFont("PretendardMedium");
  drawCanvasPage(pdf, bmc, title);

  // 2쪽부터: 분석 결과(점수, 리스크, 실행 항목)를 글로 정리한다
  const sections = buildSections(bmc).filter((section) => section.title !== "BMC");

  if (sections.length > 0) {
    pdf.addPage("a4", "p");

    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = 18;

    const write = (text, fontSize, lineGap, color = COLORS.text) => {
      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);

      pdf.splitTextToSize(text, maxWidth).forEach((line) => {
        if (y > pageHeight - 20) {
          pdf.addPage("a4", "p");
          y = 18;
        }

        pdf.text(line, margin, y);
        y += lineGap;
      });
    };

    write(`${title} · 분석 결과`, 15, 10, COLORS.title);

    sections.forEach((section) => {
      write(section.title, 12, 7, COLORS.title);
      section.lines.forEach((line) => write(`• ${line}`, 9.5, 5.5));
      y += 5;
    });
  }

  const safeTitle = title.replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`${safeTitle}_${formatDate(bmc.createdAt)}.pdf`);
}
