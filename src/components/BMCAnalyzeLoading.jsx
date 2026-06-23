import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  BarChart3,
  Loader2,
} from "lucide-react";

function BMCAnalyzeLoading({
  title = "BMC를 분석하는 중입니다",
  desc = "생성된 비즈니스 모델 캔버스를 기준으로 강점, 보완점, 개선 방향을 분석하고 있습니다.",
  duration = 3000,
  onComplete,
}) {
  const [progress, setProgress] = useState(0);

  const remainingTime = useMemo(() => {
    const remain = Math.ceil(((100 - progress) / 100) * (duration / 1000));
    return remain < 0 ? 0 : remain;
  }, [progress, duration]);

  useEffect(() => {
    const intervalTime = 50;
    const increaseAmount = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increaseAmount, 100);

        if (next >= 100) {
          clearInterval(timer);

          setTimeout(() => {
            onComplete?.();
          }, 400);
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  const roundedProgress = Math.floor(progress);

  const steps = [
    "BMC 핵심 요소 확인",
    "강점 분석",
    "보완점 분석",
    "개선 방향 정리",
  ];

  return (
    <div className="w-full h-full min-h-[560px] flex items-center justify-center">
      <div className="w-full max-w-[620px] bg-white border border-blue-100 rounded-[28px] px-10 py-10 shadow-[0_16px_40px_rgba(37,99,235,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-7">
            {roundedProgress >= 100 ? (
              <CheckCircle2 size={46} className="text-blue-600" />
            ) : (
              <>
                <BarChart3 size={42} className="text-blue-600" />

                <Loader2
                  size={24}
                  className="absolute -right-1 -bottom-1 text-blue-500 animate-spin"
                />
              </>
            )}
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {roundedProgress >= 100 ? "BMC 분석이 완료되었습니다" : title}
          </h3>

          <p className="text-[#3D4770] text-base leading-7 mb-8">
            {roundedProgress >= 100
              ? "잠시 후 분석 결과가 표시됩니다."
              : desc}
          </p>

          <div className="w-full mb-5">
            <div className="flex items-end justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">
                진행률
              </span>

              <span className="text-3xl font-bold text-blue-600">
                {roundedProgress}%
              </span>
            </div>

            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-200"
                style={{ width: `${roundedProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Clock3 size={17} />

            {roundedProgress >= 100 ? (
              <span>분석 결과 화면을 준비하고 있습니다.</span>
            ) : (
              <span>예상 남은 시간 약 {remainingTime}초</span>
            )}
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            {steps.map((step, index) => {
              const stepProgress = (index + 1) * 25;
              const done = roundedProgress >= stepProgress;
              const active =
                roundedProgress >= index * 25 &&
                roundedProgress < stepProgress;

              return (
                <div
                  key={step}
                  className={`
                    h-[58px]
                    rounded-2xl
                    border
                    flex
                    items-center
                    gap-3
                    px-4
                    text-left
                    transition
                    ${
                      done
                        ? "border-blue-100 bg-blue-50"
                        : active
                        ? "border-blue-300 bg-white"
                        : "border-gray-200 bg-white"
                    }
                  `}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center shrink-0
                      ${
                        done
                          ? "bg-blue-600 text-white"
                          : active
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {done ? (
                      <CheckCircle2 size={16} />
                    ) : active ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>

                  <span
                    className={`
                      text-sm font-semibold
                      ${done || active ? "text-gray-900" : "text-gray-400"}
                    `}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BMCAnalyzeLoading;