import { Navigate } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";

function GuestRoute({ children }) {
  const { isLogin } = useLogin();

  // 로그인 상태라면 인증 페이지 접근 불가
  if (isLogin) {
    return <Navigate to="/idea" replace />;
  }

  // 비로그인 상태라면 인증 페이지 접근 허용
  return children;
}

export default GuestRoute;