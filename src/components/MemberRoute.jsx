import { Navigate } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";

function MemberRoute({ children }) {
  const { isLogin } = useLogin();

  if (!isLogin) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default MemberRoute;