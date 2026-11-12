import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Logo from "./Logo";

const CONTACT_EMAIL = "planb@example.com";

const POLICIES = {
  terms: {
    title: "이용약관",
    sections: [
      ["제1조 (목적)", "본 약관은 PlanB가 제공하는 AI 기반 비즈니스 모델 설계 및 분석 서비스의 이용에 관한 기본적인 사항을 규정합니다."],
      ["제2조 (서비스 이용)", "사용자는 회원가입 및 로그인 후 아이디어 입력, BMC 생성, BMC 분석 등의 서비스를 이용할 수 있습니다."],
      ["제3조 (AI 생성 결과)", "서비스에서 제공하는 AI 생성 결과는 사용자의 의사 결정을 돕기 위한 참고 자료입니다. AI가 생성한 내용의 정확성이나 사업적 성공을 보장하지 않으며, 최종적인 판단과 책임은 사용자에게 있습니다."],
      ["제4조 (사용자의 의무)", "사용자는 타인의 권리를 침해하거나 법령 및 공공질서에 위반되는 내용을 입력해서는 안 되며, 서비스의 정상적인 운영을 방해해서는 안 됩니다."],
      ["제5조 (지적재산권)", "서비스의 디자인, 프로그램 및 기타 콘텐츠에 대한 권리는 별도의 표시가 없는 한 PlanB에 귀속됩니다. 사용자가 입력한 아이디어 및 콘텐츠에 대한 권리는 원칙적으로 사용자에게 있습니다."],
      ["제6조 (서비스 이용 제한)", "서비스의 안정적인 운영을 위해 필요한 경우 서비스 이용을 일시적으로 제한하거나 중단할 수 있습니다."],
      ["제7조 (면책)", "AI 생성 및 분석 결과를 바탕으로 사용자가 내린 사업적·재정적 판단에 대해 PlanB가 직접적인 책임을 부담하지 않습니다."],
      ["제8조 (약관의 변경)", "서비스 운영에 필요한 경우 본 약관의 내용을 변경할 수 있으며, 변경된 내용은 서비스 내 공지를 통해 안내합니다."],
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    sections: [
      ["제1조 (개인정보의 수집)", "PlanB는 서비스 제공을 위해 필요한 범위에서 회원 식별 정보, 이메일 주소, 사용자가 입력한 아이디어 및 BMC 데이터, 서비스 이용 기록 등을 수집할 수 있습니다."],
      ["제2조 (개인정보의 이용 목적)", "수집한 개인정보는 회원 식별 및 로그인, BMC 생성 및 분석, 프로젝트 관리, 서비스 이용량 관리 및 서비스 개선을 위해 이용됩니다."],
      ["제3조 (개인정보의 보관 및 이용)", "개인정보는 서비스 제공에 필요한 기간 동안 보관하며, 이용 목적이 달성되거나 보관이 필요하지 않게 된 경우 관련 절차에 따라 파기합니다."],
      ["제4조 (개인정보의 제3자 제공)", "PlanB는 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다. 다만 법령에 따른 요청이 있거나 사용자의 별도 동의가 있는 경우에는 예외로 할 수 있습니다."],
      ["제5조 (외부 서비스 이용)", "서비스는 로그인 및 AI 기능 제공을 위해 Google, Kakao 등의 외부 서비스 또는 AI 관련 서비스를 이용할 수 있습니다. 외부 서비스 이용 과정에서 개인정보가 처리되는 경우 해당 서비스의 개인정보처리방침이 적용될 수 있습니다."],
      ["제6조 (개인정보의 보호)", "PlanB는 개인정보의 안전한 관리를 위해 접근 권한 관리 및 보안 조치 등을 적용하고 개인정보가 안전하게 관리될 수 있도록 노력합니다."],
      ["제7조 (이용자의 권리)", "사용자는 자신의 개인정보에 대해 열람, 수정, 삭제 등을 요청할 수 있으며, 회원 탈퇴 등을 통해 개인정보의 삭제를 요청할 수 있습니다."],
      ["제8조 (문의)", `개인정보와 관련된 문의사항은 이메일(${CONTACT_EMAIL})로 문의할 수 있습니다.`],
    ],
  },
};

function PolicyModal({ policy, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={policy.title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl animate-fade-up"
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">{policy.title}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5 text-sm leading-7 text-gray-600">
          {policy.sections.map(([title, body]) => (
            <section key={title}>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p>{body}</p>
            </section>
          ))}
          <p className="text-xs text-gray-400">시행일: 2026년 8월 8일</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const [openPolicy, setOpenPolicy] = useState(null);

  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo className="scale-90 origin-left" />
          <p className="text-sm text-gray-400">AI와 함께 만드는 비즈니스 모델 캔버스</p>
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-500">
          <button onClick={() => setOpenPolicy("terms")} className="hover:text-gray-900">
            이용약관
          </button>
          <button onClick={() => setOpenPolicy("privacy")} className="hover:text-gray-900">
            개인정보처리방침
          </button>
          <span className="text-gray-300">© 2026 PlanB</span>
        </div>
      </div>

      {openPolicy && (
        <PolicyModal
          policy={POLICIES[openPolicy]}
          onClose={() => setOpenPolicy(null)}
        />
      )}
    </footer>
  );
}

export default Footer;
