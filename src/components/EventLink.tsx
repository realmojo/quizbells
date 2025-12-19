import { Gift } from "lucide-react";

export default function EventLink() {
  return (
    <a href="/event" target="_self" className="block">
      <div className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-sm border-2 border-pink-300 dark:border-pink-700 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center group-hover:bg-pink-600 dark:group-hover:bg-pink-500 transition-colors">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-1">
                진행중인 이벤트 확인하기
              </div>
              <div className="text-sm text-pink-600 dark:text-pink-400">
                기간 한정 혜택 모음 →
              </div>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-pink-700 dark:text-pink-300 group-hover:text-pink-800 dark:group-hover:text-pink-200 transition-colors">
            →
          </div>
        </div>
      </div>
    </a>
  );
}
