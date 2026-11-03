import MainLayout from "../layouts/MainLayout";

function AuthPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}` +
      `&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}` +
      "&response_type=code";

    window.location.href = kakaoAuthUrl;
  };


  const handleGoogleLogin = () => {
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}` +
      "&response_type=code" +
      "&scope=openid email profile";

    window.location.href = googleAuthUrl;
  };

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
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  PlanB에
                  <br />
                  오신 것을 환영합니다
                </h1>
              </div>

              {/* Right */}
              <div className="flex justify-center">
                <div className="w-[560px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-14 py-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    로그인
                  </h2>

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