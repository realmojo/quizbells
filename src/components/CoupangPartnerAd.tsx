import EventCard from "./EventCard";

export default function CoupangPartnerAd() {
  const coupangItems = [
    {
      // url: "https://naver.me/GnRHw1eJ",
      // url: "https://link.coupang.com/a/dfopJs",
      url: "https://quizbells.com/s/BhlQfq",
      img: "/images/cp/cp-1.png",
      title: "퀴즈 1기분 좋은 선물! E쿠폰/기프티콘",
    },
    {
      // url: "https://naver.me/F5aYt2rN",
      // url: "https://link.coupang.com/a/dfop1G",
      url: "https://quizbells.com/s/p8kutx",
      img: "/images/cp/cp-2.png",
      title: "쿠팡트래블, 매일 만나는 여행 특가",
    },
    {
      // url: "https://naver.me/FbqX3ydL",
      // url: "https://link.coupang.com/a/dfoqgF",
      url: "https://quizbells.com/s/9bDcNr",
      img: "/images/cp/cp-3.png",
      title: "모바일 전용] 쿠팡라이브 럭키박스",
    },
    {
      // url: "https://naver.me/FIN4DZgA",
      // url: "https://link.coupang.com/a/dfoqwd",
      url: "https://quizbells.com/s/NDTAlY",
      img: "/images/cp/cp-4.png",
      title: "로켓프레시, 홈카페",
    },
    {
      // url: "https://naver.me/GFCjJ8VB",
      // url: "https://link.coupang.com/a/dfoqQb",
      url: "https://quizbells.com/s/gboyCR",
      img: "/images/cp/cp-5.png",
      title: "문구/오피스, 집순이의 취미생활",
    },
    {
      // url: "https://naver.me/FOZj6Bli",
      // url: "https://link.coupang.com/a/dfoq6U",
      url: "https://quizbells.com/s/iYBbQu",
      img: "/images/cp/cp-6.png",
      title: "로켓프레시, 식단관리",
    },
    {
      // url: "https://naver.me/xfYBqn1V",
      // url: "https://link.coupang.com/a/dforjk",
      url: "https://quizbells.com/s/vB73Xj",
      img: "/images/cp/cp-7.png",
      title: "홈인테리어, 공간별 인테리어 추천",
    },
    {
      // url: "https://naver.me/FdodmcmD",
      // url: "https://link.coupang.com/a/dforvO",
      url: "https://quizbells.com/s/IHD03q",
      img: "/images/cp/cp-8.png",
      title: "크리스마스 선물 쿠폰",
    },
    {
      // url: "https://link.coupang.com/a/dfsfZ5",
      url: "https://quizbells.com/s/RVcSE3",
      img: "/images/cp/cp-9.png",
      title: "겨울 생핌풀 쿠폰",
    },
    {
      // url: "https://link.coupang.com/a/dforYi",
      url: "https://quizbells.com/s/DIu43Y",
      img: "/images/cp/cp-10.png",
      title: "AI 디지털 가전 모음",
    },
  ];

  const randomItem =
    coupangItems[Math.floor(Math.random() * coupangItems.length)];

  return (
    <EventCard
      url={randomItem.url}
      img={randomItem.img}
      title={randomItem.title}
    />
  );
}
