import { useEffect, useRef } from "react";
import axios from "axios";
import { useLogin } from "../../contexts/LoginContext.jsx";

function GoogleCallback() {
  const isCalled = useRef(false);
  const { login } = useLogin();

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
      .post("http://localhost:8080/api/auth/google", {
        code: code,
      })
      .then((response) => {
        const { accessToken, refreshToken } = response.data.data;

        // 로그인 상태 저장
        login(accessToken, refreshToken);

        // 메인 이동
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("구글 로그인 실패", error);
      });

  }, [login]);

  return (
    <div className="flex justify-center items-center h-screen">
      Google 로그인 처리중...
    </div>
  );
}

export default GoogleCallback;