import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [openPolicy, setOpenPolicy] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpenPolicy(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer className="w-full min-w-[1440px] bg-[#F9FAFB] border-t border-gray-200 mt-auto">
      <div className="max-w-[1440px] mx-auto px-10 py-10">
        <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-14">
          {/* Brand */}
          <div>
            <Link to="/">
              <img
                src="/Logo.png"
                alt="PlanB Logo"
                className="
                  h-10 w-auto object-contain mb-6
                  cursor-pointer
                  transition
                  hover:opacity-80
                "
              />
            </Link>

            <p className="text-gray-500 text-sm leading-7 mb-6">
              AI 기반으로 비즈니스 모델을
              <br />
              쉽게 설계하고 분석할 수 있는 플랫폼
            </p>

            <p className="text-gray-400 text-xs">
              © 2026 PlanB. All rights reserved.
            </p>
          </div>

          {/* Service */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">서비스</h3>

            <div className="flex flex-col gap-4 text-sm">
              <Link
                to="/idea"
                className="text-gray-500 hover:text-blue-500 transition"
              >
                아이디어 입력
              </Link>

              <Link
                to="/bmc/analyze"
                className="text-gray-500 hover:text-blue-500 transition"
              >
                BMC 분석
              </Link>

              <Link
                to="/my"
                className="text-gray-500 hover:text-blue-500 transition"
              >
                마이페이지
              </Link>
            </div>
          </div>

          {/* Policy */}
          <div className="relative">
            <h3 className="text-gray-900 font-semibold mb-6">정책</h3>

            <div className="flex flex-col gap-4 text-gray-500 text-sm">
              <button
                onClick={() =>
                  setOpenPolicy(openPolicy === "terms" ? null : "terms")
                }
                className="text-left hover:text-blue-500 transition"
              >
                이용약관
              </button>

              <button
                onClick={() =>
                  setOpenPolicy(openPolicy === "privacy" ? null : "privacy")
                }
                className="text-left hover:text-blue-500 transition"
              >
                개인정보처리방침
              </button>
            </div>

            {openPolicy && (
              <div
                ref={popupRef}
                className="
                  absolute bottom-20 left-0
                  w-[320px]
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  p-5
                  z-50
                "
              >
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  {openPolicy === "terms" ? "이용약관" : "개인정보처리방침"}
                </h4>

                <p className="text-sm text-gray-500 leading-7">
                  추후 정책 페이지 또는 모달 형태로
                  상세 내용이 추가될 예정입니다.
                </p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">연락처</h3>

            <p className="text-gray-500 text-sm leading-7">
              이메일: planb@example.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;