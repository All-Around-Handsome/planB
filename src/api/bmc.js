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

// BMC 생성 결과 저장
// POST /api/bmc
export async function saveGeneratedBmc(data) {
  return request("/api/bmc", {
    method: "POST",
    body: JSON.stringify(data),
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

// 내 BMC 목록 조회
// GET /api/bmc
export async function getBmcList() {
  return request("/api/bmc", {
    method: "GET",
  });
}

// BMC 상세 조회
// GET /api/bmc/{bmcRecordId}
export async function getBmcDetail(id) {
  return request(`/api/bmc/${id}`, {
    method: "GET",
  });
}

// BMC 삭제
// DELETE /api/bmc/{bmcRecordId}
export async function deleteBmc(id) {
  return request(`/api/bmc/${id}`, {
    method: "DELETE",
  });
}

// BMC 항목 수정
// PATCH /api/bmc/items/{itemId}
export async function updateBmcItem(itemId, data) {
  return request(`/api/bmc/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}