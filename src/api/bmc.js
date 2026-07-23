const BACKEND_URL = "http://localhost:8080";


// 공통 API 요청
async function request(url, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BACKEND_URL}${url}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }
  );


  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = "/auth";
    return null;
  }


  const result = await response.json();


  if (!response.ok) {
    throw new Error(
      result.error?.message || "API 요청 실패"
    );
  }


  return result;
}


// 사용 횟수 조회
// GET /api/bmc/limit
export async function getBmcLimit() {
  return request("/api/bmc/limit", {
    method: "GET",
  });
}

// 생성 횟수 차감
export async function checkGeneration() {
  return request("/api/bmc/check-generation", {
    method: "POST",
  });
}


// 분석 횟수 차감
export async function checkAnalysis() {
  return request("/api/bmc/check-analysis", {
    method: "POST",
  });
}

// BMC 상세 조회
// GET /api/bmc/{bmcRecordId}
export async function getBmcDetail(id) {
  return request(`/api/bmc/${id}`, {
    method: "GET",
  });
}


// BMC 분석 결과 저장
// POST /api/bmc/analysis
export async function saveBmcAnalysis(data) {
  return request("/api/bmc/analysis", {
    method: "POST",
    body: JSON.stringify(data),
  });
}