import { ChevronRight, Gift } from "lucide-react";

export default function EventLink() {
  return (
    <div className="mb-4 w-full">
      <a
        href="/event"
        className="group relative flex w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-[2px] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="relative flex w-full items-center justify-between rounded-[14px] bg-white dark:bg-slate-900 px-6 py-5 transition-all group-hover:bg-opacity-95 dark:group-hover:bg-opacity-95">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  HOT
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  기간 한정 혜택 모음
                </p>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 dark:group-hover:from-rose-400 dark:group-hover:to-pink-400 transition-all">
                진행중인 이벤트 확인하기
              </h3>
            </div>
          </div>
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-400 transition-all group-hover:bg-rose-100 group-hover:text-rose-600 dark:group-hover:bg-rose-900/30 dark:group-hover:text-rose-400 group-hover:translate-x-1">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </a>
    </div>
  );
}
