// true: Mock 데이터 사용 (AI 서버 없이 화면 테스트)
// false: 실제 AI API 연동 데이터 사용
const USE_MOCK = false;


// Mock 응답 데이터
// AI 서버 응답(Response) 형식과 동일하게 구성
const mockGenerateResponse = {
  valueProposition: "AI 기반 재고관리 SaaS로 소상공인의 재고 문제를 해결합니다.",
  customerSegments: "소상공인 및 온라인 판매자",
  revenueStreams: "월 구독 기반 SaaS 모델",
  costStructure: "AI 서버 비용 및 서비스 운영 비용",
  keyPartners: "이커머스 플랫폼 및 데이터 제공 업체",
  keyActivities: "AI 재고 예측 모델 개발 및 서비스 운영",
  keyResources: "AI 모델, 재고 데이터, 클라우드 인프라",
  channels: "온라인 마케팅 및 플랫폼 연동",
  customerRelationships: "온라인 지원 및 자동화 서비스 관리",
};


const mockAnalyzeResponse = {
  viabilityScore: 8,
  scoreRationale: "시장 문제 해결 가능성과 확장성을 고려한 분석 결과입니다.",
  risks: [
    {
      risk: "초기 고객 확보 어려움",
      mitigation: "무료 체험과 고객 인터뷰 진행",
    },
    {
      risk: "경쟁 서비스와 차별화 부족",
      mitigation: "핵심 기능 차별화 전략 수립",
    },
    {
      risk: "초기 운영 비용 부담",
      mitigation: "MVP 개발 후 단계적 확장",
    },
  ],
  actionItems: [
    {
      term: "단기",
      action: "잠재 고객 인터뷰 진행",
    },
  ],
};


// BMC 생성
export async function generateBmc(data) {

  // Mock 모드
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return mockGenerateResponse;
  }


  // 실제 AI 서버 연동
  // POST /api/ai/bmc/generate
  const response = await fetch(
    "http://localhost:8081/api/ai/bmc/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );


  if (!response.ok) {
    throw new Error("BMC 생성 실패");
  }


  return response.json();
}



// BMC 분석
export async function analyzeBmc(data) {

  // Mock 모드
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return mockAnalyzeResponse;
  }


  // 실제 AI 서버 연동
  // POST /api/ai/bmc/analyze
  const response = await fetch(
    "http://localhost:8081/api/ai/bmc/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );


  if (!response.ok) {
    throw new Error("BMC 분석 실패");
  }


  return response.json();
}