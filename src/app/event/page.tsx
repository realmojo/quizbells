import EventCard from "@/components/EventCard";
import CoupangPartnerAd from "@/components/CoupangPartnerAd";
import { Gift, TrendingUp, Wallet, Star } from "lucide-react";

export default function EventPage() {
  const eventList = [
    {
      id: 1,
      title: "기분 좋은 선물! E쿠폰/기프티콘",
      url: "https://quizbells.com/s/wRJZUK",
      image: "/images/cp/cp-event-1.png",
    },
    {
      id: 2,
      title: "펜션/풀빌라 와우회원 할인",
      url: "https://quizbells.com/s/eSYxCs",
      image: "/images/cp/cp-event-2.png",
    },
    {
      id: 3,
      title: "모바일 전용] 쿠팡라이브 럭키박스",
      url: "https://quizbells.com/s/fysE1I",
      image: "/images/cp/cp-event-3.png",
    },
  ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-4">
            <Gift className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400">
            진행중인 이벤트
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            놓치면 후회하는 특별한 혜택들을 확인해보세요!
          </p>
        </div>

        {/* Featured Ad Event - 2 Columns Grid */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              추천 이벤트
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {eventList.map((event) => (
              <EventCard
                key={event.id}
                url={event.url}
                img={event.image}
              />
            ))}
          </div>

          <p className="text-xs text-center text-slate-400 mt-4">
            * 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </section>

        {/* Other Benefits */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center gap-2 mb-4 px-1">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              혜택 모아보기
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Wallet className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full mb-3">
                준비중
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                곧 새로운 이벤트가 찾아옵니다!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                다양한 앱테크 혜택과 경품 이벤트를 준비하고 있습니다.
                <br />
                알림 설정을 켜두시면 가장 빠르게 소식을 받아보실 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
