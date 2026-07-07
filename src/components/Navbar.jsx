import { Link } from "react-router-dom";

function Navbar() {
  const isLogin = false;

  return (
    <nav className="w-full min-w-[1440px] h-20 bg-white border-b border-gray-200">
      <div className="max-w-[1440px] h-full mx-auto px-10 flex items-center justify-between">
        {/* Left */}
        <Link to="/" className="flex items-center">
          <img
            src="/Logo.png"
            alt="PlanB Logo"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Center */}
        <div className="flex items-center gap-12 text-gray-600 text-lg font-medium">
          <Link to="/">Home</Link>
          <Link to="/idea">아이디어 입력</Link>
          <Link to="/bmc/analyze">BMC 분석</Link>
          <Link to="/my">마이페이지</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {!isLogin ? (
            <Link
              to="/auth"
              className="text-gray-700 text-lg font-medium hover:text-blue-500 transition"
            >
              로그인
            </Link>
          ) : (
            <>
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                B
              </div>

              <span className="text-gray-700 text-lg">가이드님</span>

              <div className="w-px h-5 bg-gray-300" />

              <button className="text-gray-500 hover:text-red-500 transition">
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;