import axios from "axios";

const AI_API_URL = "http://localhost:8081/api/ai/bmc";


// BMC 생성
export const generateBmc = async (data) => {
  const response = await axios.post(
    `${AI_API_URL}/generate`,
    data
  );

  return response.data;
};


// BMC 분석
export const analyzeBmc = async (data) => {
  const response = await axios.post(
    `${AI_API_URL}/analyze`,
    data
  );

  return response.data;
};