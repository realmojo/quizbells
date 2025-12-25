"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calculator, TrendingUp, Coins } from "lucide-react";

const copyVariants = [
  {
    icon: Calculator,
    title: "오늘 3,200원, 1년 모으면?",
    desc: "티끌 모아 태산이라는 말, 숫자로 확인해보세요.",
    action: "내 수익 계산하기",
    bgGradient: "from-violet-500 to-purple-600",
    iconColor: "text-violet-100",
  },
  {
    icon: TrendingUp,
    title: "이 돈을 S&P500에 넣었다면?",
    desc: "단순 저축 vs 투자의 차이, 놀라운 결과!",
    action: "투자 시뮬레이션",
    bgGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-100",
  },
  {
    icon: Coins,
    title: "숨어있는 내 포인트 가치",
    desc: "지금 버는 소액, 10초 만에 가치 평가하기",
    action: "가치 확인하기",
    bgGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-100",
  },
];

export default function SynergyCard() {
  const [variant, setVariant] = useState(copyVariants[0]);

  useEffect(() => {
    // 랜덤하게 3가지 중 하나 선택 (A/B 테스트 시뮬레이션)
    const randomIdx = Math.floor(Math.random() * copyVariants.length);
    setVariant(copyVariants[randomIdx]);
  }, []);

  const Icon = variant.icon;

  return (
    <a
      // href="/quiz/curiosity/today"
      href="https://pflow.app/calculator/fomo"
      target="_blank"
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${variant.bgGradient}`}
      />

      {/* Decorative Circles */}

      <div className="relative p-5 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`p-1.5 rounded-lg bg-white/20 backdrop-blur-sm ${variant.iconColor}`}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Premium Check
            </span>
          </div>

          <h3 className="text-lg font-bold text-white leading-tight mb-1">
            {variant.title}
          </h3>
          <p className="text-xs text-white/80 font-medium">{variant.desc}</p>
        </div>

        <div className="flex flex-col items-center justify-center pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-2 group-hover:bottom-3">
            GO
          </span>
        </div>
      </div>
    </a>
  );
}
