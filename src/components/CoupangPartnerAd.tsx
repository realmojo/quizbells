export default function CoupangPartnerAd() {
  const coupangItems = [
    {
      url: "https://naver.me/GnRHwk2A",
      img: "/images/cp/cp-1.png",
    },
    {
      url: "https://naver.me/5AgSbDrS",
      img: "/images/cp/cp-3.png",
    },
    {
      url: "https://naver.me/xDCwyLrt",
      img: "/images/cp/cp-4.png",
    },
    {
      url: "https://naver.me/FgT9hVPC",
      img: "/images/cp/cp-5.png",
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
