import axios from "axios";

import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useLogin } from "../contexts/LoginContext.jsx";
import { getProfile } from "../api/bmc";
import { BACKEND_URL } from "../api/config";
import Logo from "./Logo";

const LINKS = [
  { to: "/idea", label: "새 아이디어" },
  { to: "/bmc/analyze", label: "BMC 분석" },
  { to: "/my", label: "내 BMC" },
];

function Navbar() {
  const { isLogin, logout } = useLogin();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isLogin) {
      return;
    }

    const fetchProfile = async () => {
      try {
        const result = await getProfile();

        if (result?.success) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      }
    };

    fetchProfile();
  }, [isLogin]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      // 토큰이 만료됐어도 화면에서는 로그아웃한다
      if (error.response?.status !== 401) {
        console.error("로그아웃 실패", error);
      }
    }

    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl h-16 mx-auto px-5 md:px-8 flex items-center justify-between gap-6">
        <Link to="/" aria-label="PlanB 홈">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isLogin ? (
            <Link
              to="/auth"
              className="h-9 px-4 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              로그인
            </Link>
          ) : (
            <>
              <Link to="/my" className="flex items-center gap-2.5">
                {profile?.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm flex items-center justify-center font-semibold">
                    {profile?.name?.charAt(0) || "U"}
                  </span>
                )}

                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {profile?.name || "사용자"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="로그아웃"
                title="로그아웃"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
