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
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">PlanB</h2>

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
                  w-[360px]
                  max-h-[500px]
                  overflow-y-auto
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  p-5
                  z-50
                "
              >
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  {openPolicy === "terms"
                    ? "이용약관"
                    : "개인정보처리방침"}
                </h4>

                {openPolicy === "terms" ? (
                  <div className="text-sm text-gray-500 leading-7 space-y-4">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제1조 (목적)
                      </p>
                      <p>
                        본 약관은 PlanB가 제공하는 AI 기반 비즈니스 모델
                        설계 및 분석 서비스의 이용에 관한 기본적인 사항을
                        규정합니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제2조 (서비스 이용)
                      </p>
                      <p>
                        사용자는 회원가입 및 로그인 후 아이디어 입력, BMC
                        생성, BMC 분석 등의 서비스를 이용할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제3조 (AI 생성 결과)
                      </p>
                      <p>
                        서비스에서 제공하는 AI 생성 결과는 사용자의 의사
                        결정을 돕기 위한 참고 자료입니다. AI가 생성한
                        내용의 정확성이나 사업적 성공을 보장하지 않으며,
                        최종적인 판단과 책임은 사용자에게 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제4조 (사용자의 의무)
                      </p>
                      <p>
                        사용자는 타인의 권리를 침해하거나 법령 및 공공질서에
                        위반되는 내용을 입력해서는 안 되며, 서비스의 정상적인
                        운영을 방해해서는 안 됩니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제5조 (지적재산권)
                      </p>
                      <p>
                        서비스의 디자인, 프로그램 및 기타 콘텐츠에 대한
                        권리는 별도의 표시가 없는 한 PlanB에 귀속됩니다.
                        사용자가 입력한 아이디어 및 콘텐츠에 대한 권리는
                        원칙적으로 사용자에게 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제6조 (서비스 이용 제한)
                      </p>
                      <p>
                        서비스의 안정적인 운영을 위해 필요한 경우 서비스
                        이용을 일시적으로 제한하거나 중단할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제7조 (면책)
                      </p>
                      <p>
                        AI 생성 및 분석 결과를 바탕으로 사용자가 내린
                        사업적·재정적 판단에 대해 PlanB가 직접적인 책임을
                        부담하지 않습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제8조 (약관의 변경)
                      </p>
                      <p>
                        서비스 운영에 필요한 경우 본 약관의 내용을 변경할 수
                        있으며, 변경된 내용은 서비스 내 공지를 통해
                        안내합니다.
                      </p>
                    </div>

                    <p className="pt-2 text-xs text-gray-400">
                      시행일: 2026년 8월 8일
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 leading-7 space-y-4">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제1조 (개인정보의 수집)
                      </p>
                      <p>
                        PlanB는 서비스 제공을 위해 필요한 범위에서 회원
                        식별 정보, 이메일 주소, 사용자가 입력한 아이디어 및
                        BMC 데이터, 서비스 이용 기록 등을 수집할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제2조 (개인정보의 이용 목적)
                      </p>
                      <p>
                        수집한 개인정보는 회원 식별 및 로그인, BMC 생성 및
                        분석, 프로젝트 관리, 서비스 이용량 관리 및 서비스
                        개선을 위해 이용됩니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제3조 (개인정보의 보관 및 이용)
                      </p>
                      <p>
                        개인정보는 서비스 제공에 필요한 기간 동안 보관하며,
                        이용 목적이 달성되거나 보관이 필요하지 않게 된 경우
                        관련 절차에 따라 파기합니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제4조 (개인정보의 제3자 제공)
                      </p>
                      <p>
                        PlanB는 원칙적으로 사용자의 개인정보를 외부에
                        제공하지 않습니다. 다만 법령에 따른 요청이 있거나
                        사용자의 별도 동의가 있는 경우에는 예외로 할 수
                        있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제5조 (외부 서비스 이용)
                      </p>
                      <p>
                        서비스는 로그인 및 AI 기능 제공을 위해 Google, Kakao
                        등의 외부 서비스 또는 AI 관련 서비스를 이용할 수
                        있습니다. 외부 서비스 이용 과정에서 개인정보가
                        처리되는 경우 해당 서비스의 개인정보처리방침이
                        적용될 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제6조 (개인정보의 보호)
                      </p>
                      <p>
                        PlanB는 개인정보의 안전한 관리를 위해 접근 권한 관리
                        및 보안 조치 등을 적용하고 개인정보가 안전하게
                        관리될 수 있도록 노력합니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제7조 (이용자의 권리)
                      </p>
                      <p>
                        사용자는 자신의 개인정보에 대해 열람, 수정, 삭제
                        등을 요청할 수 있으며, 회원 탈퇴 등을 통해 개인정보의
                        삭제를 요청할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        제8조 (문의)
                      </p>
                      <p>
                        개인정보와 관련된 문의사항은 아래 이메일을 통해
                        문의할 수 있습니다.
                      </p>
                      <p className="mt-1 text-gray-600">
                        이메일: planb@example.com
                      </p>
                    </div>

                    <p className="pt-2 text-xs text-gray-400">
                      시행일: 2026년 8월 8일
                    </p>
                  </div>
                )}
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