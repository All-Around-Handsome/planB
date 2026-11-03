// BMC 9개 항목: 화면 데이터 키 <-> 서버 itemType
export const BMC_FIELDS = [
  { key: "keyPartners", itemType: "KEY_PARTNERS", label: "핵심 파트너" },
  { key: "keyActivities", itemType: "KEY_ACTIVITIES", label: "핵심 활동" },
  { key: "valueProposition", itemType: "VALUE_PROPOSITION", label: "가치 제안" },
  { key: "customerRelationships", itemType: "CUSTOMER_RELATIONSHIPS", label: "고객 관계" },
  { key: "customerSegments", itemType: "CUSTOMER_SEGMENT", label: "고객 세그먼트" },
  { key: "keyResources", itemType: "KEY_RESOURCES", label: "핵심 자원" },
  { key: "channels", itemType: "CHANNELS", label: "채널" },
  { key: "costStructure", itemType: "COST_STRUCTURE", label: "비용 구조" },
  { key: "revenueStreams", itemType: "REVENUE_STREAM", label: "수익 구조" },
];

export const EMPTY_BMC = Object.fromEntries(
  BMC_FIELDS.map(({ key }) => [key, ""])
);

export const STAGE_CODES = {
  idea: "IDEA",
  validate: "VALIDATION",
  launch: "LAUNCH",
  growth: "GROWTH",
};

export const STAGE_LABELS = {
  idea: "아이디어",
  validate: "검증",
  launch: "초기런칭",
  growth: "성장",
};

export const TERM_LABELS = {
  SHORT: "단기",
  MID: "중기",
  LONG: "장기",
};

export function bmcToItems(bmc) {
  return BMC_FIELDS.map(({ key, itemType }) => ({
    itemType,
    content: bmc[key],
  }));
}

export function itemsToBmc(items = []) {
  return Object.fromEntries(
    BMC_FIELDS.map(({ key, itemType }) => [
      key,
      items.find((item) => item.itemType === itemType)?.content || "",
    ])
  );
}

// ideaText는 첫 줄을 제목으로 쓴다
export function buildIdeaText(title, content) {
  return [title, content]
    .map((text) => text?.trim())
    .filter(Boolean)
    .join("\n");
}

export function getIdeaTitle(ideaText) {
  return ideaText?.split(/\r?\n/)[0]?.trim() || "제목 없음";
}

export function formatDate(date) {
  return date ? date.split("T")[0].replaceAll("-", ".") : "";
}
