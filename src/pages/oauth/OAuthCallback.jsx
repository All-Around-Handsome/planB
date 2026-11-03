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
    <div className="flex flex-col justify-center items-center gap-4 h-screen">
      {failed ? (
        <>
          <p className="text-gray-700">{label} 로그인에 실패했어요.</p>
          <Link to="/auth" className="font-bold text-blue-600">
            다시 로그인
          </Link>
        </>
      ) : (
        <p className="text-gray-500">{label} 로그인 중...</p>
      )}
    </div>
  );
}

export default OAuthCallback;
