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
    <MainLayout footer={false}>
      <main className="flex-1 flex items-center justify-center px-5 py-16 bg-[radial-gradient(ellipse_at_top,#eef3ff_0%,#ffffff_60%)]">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              PlanB 시작하기
            </h1>
            <p className="mt-3 text-gray-500">
              아이디어를 비즈니스 모델로 정리해 보세요.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={handleKakaoLogin}
              className="relative h-12 w-full rounded-xl bg-[#FEE500] text-[15px] font-semibold text-gray-900 flex items-center justify-center hover:brightness-[0.97] transition"
            >
              <img
                src="/kakao_logo.png"
                alt=""
                className="absolute left-4 w-6 h-6 object-contain"
              />
              카카오로 계속하기
            </button>

            <button
              onClick={handleGoogleLogin}
              className="relative h-12 w-full rounded-xl bg-white border border-gray-200 text-[15px] font-semibold text-gray-900 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <img
                src="/google_logo.png"
                alt=""
                className="absolute left-4 w-5 h-5 object-contain"
              />
              Google로 계속하기
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            계속하면 PlanB의 이용약관과 개인정보처리방침에
            <br />
            동의하는 것으로 간주돼요.
          </p>
        </div>
      </main>
    </MainLayout>
  );
}

export default AuthPage;
