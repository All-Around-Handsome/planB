// true: Mock 데이터 사용 (AI 서버 없이 화면 테스트)
// false: 실제 AI API 연동 데이터 사용
const USE_MOCK = false;


// Mock 응답 데이터
// AI 서버 응답(Response) 형식과 동일하게 구성
const mockResponse = {
  competitors: [
    {
      serviceName: "Spherecast",
      category:
        "AI, E-commerce, Inventory Management, Automation",
      targetCustomer:
        "이커머스 운영 기업 및 온라인 판매자",
      revenueModel:
        "SaaS 구독 기반",
      coreFeatures:
        "AI 기반 재고 예측 및 자동화",
      differentiation:
        "온라인 판매 데이터 기반 AI 재고관리 솔루션으로, 사용자 아이디어는 소상공인을 대상으로 쉬운 UI와 저비용 구조를 차별점으로 가질 수 있습니다.",
    },
    {
      serviceName: "Zoho Inventory",
      category:
        "Inventory Management",
      targetCustomer:
        "중소기업",
      revenueModel:
        "월 구독",
      coreFeatures:
        "재고 관리, 주문 관리",
      differentiation:
        "기업 중심 기능이 많아 소규모 사업자가 사용하기 어렵고, 간편한 사용성이 차별화 요소가 될 수 있습니다.",
    },
    {
      serviceName: "Odoo Inventory",
      category:
        "ERP",
      targetCustomer:
        "기업",
      revenueModel:
        "오픈소스 + 유료",
      coreFeatures:
        "ERP 통합 재고관리",
      differentiation:
        "복잡한 ERP 전체가 아닌 재고관리 기능에 집중한 서비스 방향으로 차별화 가능합니다.",
    },
  ],
};


export async function searchCompetitors(idea) {

  // Mock 모드
  // AI 서버가 없어도 동일한 응답 구조로 프론트 화면 테스트 가능
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return mockResponse;
  }


  // 실제 AI 서버 연동
  // POST /api/ai/competitors
  // 사용자가 입력한 아이디어를 기반으로 경쟁 서비스 분석 결과 반환
  const response = await fetch(
    "http://localhost:8081/api/ai/competitors",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    }
  );


  if (!response.ok) {
    throw new Error("경쟁사 분석 실패");
  }


  return response.json();
}