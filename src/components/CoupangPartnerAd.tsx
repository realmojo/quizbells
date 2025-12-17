export default function CoupangPartnerAd() {
  const coupangUrl = "https://naver.me/I5yLGpKn";
  const img = "/images/cp/cp-1-1220.png";

  return (
    <div className="mb-4">
      <a href={coupangUrl} target="_blank">
        <img src={img} alt="event-img" className="w-full h-auto" />
      </a>
    </div>
  );
}
