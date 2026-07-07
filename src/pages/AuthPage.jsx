import MainLayout from "../layouts/MainLayout";
import { ShieldCheck } from "lucide-react";

function AuthPage() {
  const handleKakaoLogin = () => {
    // 백엔드 연동 후 수정
    console.log("Kakao Login");
  };

  const handleGoogleLogin = () => {
    // 백엔드 연동 후 수정
    console.log("Google Login");
  };

  const bmcItems = [
    "Key Partners",
    "Key Activities",
    "Value Proposition",
    "Customer Relationships",
    "Customer Segments",
    "Key Resources",
    "Channels",
    "Cost Structure",
    "Revenue Streams",
  ];

  return (
    <MainLayout>
      <main className="relative overflow-hidden">

        {/* LEFT BG */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[#F4F7FF]" />

        {/* RIGHT BG */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#DCE6FF]" />

        {/* CENTER */}
        <div
          className="
            relative
            z-10
            max-w-[1440px]
            mx-auto
            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage: "url('/Background.png')",
          }}
        >
          <section className="px-16 py-24">
            <div className="grid grid-cols-[1fr_560px] items-center gap-20">
              
              {/* Left */}
              <div className="pl-10">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                  PlanB에
                  <br />
                  오신 것을 환영합니다!
                </h1>

                <p className="text-gray-600 text-lg leading-8 mb-10">
                  로그인하여 아이디어를 분석하고
                  <br />
                  비즈니스 모델을 완성해보세요.
                </p>

                <div className="flex flex-col gap-4 w-[420px]">
                  <div className="bg-white/60 border border-white rounded-2xl px-6 py-4 shadow-[0_8px_24px_rgba(59,130,246,0.10)]">
                    <p className="text-blue-500 font-bold mb-1">01. 아이디어 구조화</p>
                    <p className="text-gray-500 text-sm">
                      입력한 아이디어를 핵심 비즈니스 요소로 정리합니다.
                    </p>
                  </div>

                  <div className="bg-white/60 border border-white rounded-2xl px-6 py-4 shadow-[0_8px_24px_rgba(59,130,246,0.10)]">
                    <p className="text-blue-500 font-bold mb-1">02. BMC 자동 생성</p>
                    <p className="text-gray-500 text-sm">
                      AI를 활용해 비즈니스 모델 캔버스를 생성합니다.
                    </p>
                  </div>

                  <div className="bg-white/60 border border-white rounded-2xl px-6 py-4 shadow-[0_8px_24px_rgba(59,130,246,0.10)]">
                    <p className="text-blue-500 font-bold mb-1">03. 결과 분석</p>
                    <p className="text-gray-500 text-sm">
                      생성된 모델을 분석하고 개선 방향을 확인합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex justify-center">
                <div className="w-[560px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-14 py-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    로그인
                  </h2>

                  <p className="text-gray-500 text-lg leading-7 mb-8">
                    카카오 또는 Google 계정으로
                    <br />
                    간편하게 로그인하세요
                  </p>

                  <div className="flex flex-col gap-5">
                    {/* Kakao */}
                    <button
                      onClick={handleKakaoLogin}
                      className="
                        relative
                        w-full
                        h-14
                        rounded-xl
                        bg-[#FEE500]
                        text-gray-900
                        text-lg
                        font-bold
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        shadow-[0_4px_10px_rgba(0,0,0,0.15)]
                        hover:brightness-95
                        active:scale-95
                      "
                    >
                      <img
                        src="/kakao_logo.png"
                        alt="Kakao"
                        className="absolute left-6 w-[34px] h-[34px] object-contain"
                      />

                      카카오로 시작하기
                    </button>

                    {/* Google */}
                    <button
                      onClick={handleGoogleLogin}
                      className="
                        relative
                        w-full
                        h-14
                        rounded-xl
                        bg-white
                        border
                        border-gray-300
                        text-gray-900
                        text-lg
                        font-semibold
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        shadow-[0_4px_10px_rgba(0,0,0,0.12)]
                        hover:bg-gray-50
                        active:scale-95
                      "
                    >
                      <img
                        src="/google_logo.png"
                        alt="Google"
                        className="absolute left-6 w-[24px] h-[23px] object-contain"
                      />
                      Google로 시작하기
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="border-t border-gray-200 mt-10 pt-7">
                    <div className="flex items-start gap-3">
                      
                      <ShieldCheck
                        size={25}
                        className="text-blue-500 shrink-0 mt-[2px]"
                      />

                      <p className="text-gray-500 text-base leading-7">
                        PlanB는 안전한 소셜 로그인만 지원합니다.
                        <br />

                        회원가입 절차 없이 바로 이용하실 수 있습니다.
                      </p>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

export default AuthPage;