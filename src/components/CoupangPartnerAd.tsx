export default function CoupangPartnerAd() {
  const coupangItems = [
    {
      url: "https://naver.me/GnRHw1eJ",
      img: "/images/cp/cp-1.png",
    },
    {
      url: "https://naver.me/F5aYt2rN",
      img: "/images/cp/cp-2.png",
    },
    {
      url: "https://naver.me/FbqX3ydL",
      img: "/images/cp/cp-3.png",
    },
    {
      url: "https://naver.me/FIN4DZgA",
      img: "/images/cp/cp-4.png",
    },
    {
      url: "https://naver.me/GFCjJ8VB",
      img: "/images/cp/cp-5.png",
    },
    {
      url: "https://naver.me/FOZj6Bli",
      img: "/images/cp/cp-6.png",
    },
    {
      url: "https://naver.me/xfYBqn1V",
      img: "/images/cp/cp-7.png",
    },
    {
      url: "https://naver.me/FdodmcmD",
      img: "/images/cp/cp-8.png",
    },
  ];

  const randomItem =
    coupangItems[Math.floor(Math.random() * coupangItems.length)];

  return (
    <div className="mb-4">
      <a href={randomItem.url} target="_blank">
        <img src={randomItem.img} alt="event-img" className="w-full h-auto" />
      </a>
    </div>
  );
}
