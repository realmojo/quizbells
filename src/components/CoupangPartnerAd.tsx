export default function CoupangPartnerAd() {
  const coupangItems = [
    {
      // url: "https://naver.me/GnRHw1eJ",
      url: "https://link.coupang.com/a/dfopJs",
      img: "/images/cp/cp-1.png",
    },
    {
      // url: "https://naver.me/F5aYt2rN",
      url: "https://link.coupang.com/a/dfop1G",
      img: "/images/cp/cp-2.png",
    },
    {
      // url: "https://naver.me/FbqX3ydL",
      url: "https://link.coupang.com/a/dfoqgF",
      img: "/images/cp/cp-3.png",
    },
    {
      // url: "https://naver.me/FIN4DZgA",
      url: "https://link.coupang.com/a/dfoqwd",
      img: "/images/cp/cp-4.png",
    },
    {
      // url: "https://naver.me/GFCjJ8VB",
      url: "https://link.coupang.com/a/dfoqQb",
      img: "/images/cp/cp-5.png",
    },
    {
      // url: "https://naver.me/FOZj6Bli",
      url: "https://link.coupang.com/a/dfoq6U",
      img: "/images/cp/cp-6.png",
    },
    {
      // url: "https://naver.me/xfYBqn1V",
      url: "https://link.coupang.com/a/dforjk",
      img: "/images/cp/cp-7.png",
    },
    {
      // url: "https://naver.me/FdodmcmD",
      url: "https://link.coupang.com/a/dforvO",
      img: "/images/cp/cp-8.png",
    },
    {
      url: "https://link.coupang.com/a/dforYi",
      img: "/images/cp/cp-10.png",
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
