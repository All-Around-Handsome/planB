import { useEffect, useRef } from "react";
import axios from "axios";

function KakaoCallback() {
  const isCalled = useRef(false);

  useEffect(() => {
    // React StrictMode 중복 실행 방지
    if (isCalled.current) return;
    isCalled.current = true;

    const code = new URL(window.location.href)
      .searchParams
      .get("code");

    if (!code) {
      console.error("인가 코드 없음");
      return;
    }

    axios
      .post("http://localhost:8080/api/auth/kakao", {
        code: code,
      })
      .then((response) => {
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem(
          "accessToken",
          accessToken
        );

        localStorage.setItem(
          "refreshToken",
          refreshToken
        );

        // 로그인 완료 후 이동
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("카카오 로그인 실패", error);
      });

  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      카카오 로그인 처리중...
    </div>
  );
}

export default KakaoCallback;