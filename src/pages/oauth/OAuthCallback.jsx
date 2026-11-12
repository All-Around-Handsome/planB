import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLogin } from "../../contexts/LoginContext.jsx";
import { BACKEND_URL } from "../../api/config";

function OAuthCallback({ provider, label }) {
  const isCalled = useRef(false);
  const { login } = useLogin();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // React StrictMode 중복 실행 방지
    if (isCalled.current) return;
    isCalled.current = true;

    const code = new URL(window.location.href)
      .searchParams
      .get("code");

    axios
      .post(`${BACKEND_URL}/api/auth/${provider}`, { code })
      .then((response) => {
        const { accessToken, refreshToken } = response.data.data;

        login(accessToken, refreshToken);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(`${label} 로그인 실패`, error);
        setFailed(true);
      });
  }, [login, provider, label]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-5 text-center">
      {failed ? (
        <>
          <p className="text-gray-900 font-semibold">{label} 로그인에 실패했어요.</p>
          <Link
            to="/auth"
            className="h-10 px-4 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700"
          >
            다시 로그인
          </Link>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin" />
          <p className="text-sm text-gray-500">{label} 로그인 중...</p>
        </>
      )}
    </div>
  );
}

export default OAuthCallback;
