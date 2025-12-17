"use client";
import { useEffect, useState } from "react";

export default function CoupangPartnerAd() {
  const coupangItems = [
    {
      // url: "https://naver.me/GnRHw1eJ",
      // url: "https://link.coupang.com/a/dfopJs",
      url: "https://quizbells.com/s/BhlQfq",
      img: "/images/cp/cp-1.png",
    },
    {
      // url: "https://naver.me/F5aYt2rN",
      // url: "https://link.coupang.com/a/dfop1G",
      url: "https://quizbells.com/s/p8kutx",
      img: "/images/cp/cp-2.png",
    },
    {
      // url: "https://naver.me/FbqX3ydL",
      // url: "https://link.coupang.com/a/dfoqgF",
      url: "https://quizbells.com/s/9bDcNr",
      img: "/images/cp/cp-3.png",
    },
    {
      // url: "https://naver.me/FIN4DZgA",
      // url: "https://link.coupang.com/a/dfoqwd",
      url: "https://quizbells.com/s/NDTAlY",
      img: "/images/cp/cp-4.png",
    },
    {
      // url: "https://naver.me/GFCjJ8VB",
      // url: "https://link.coupang.com/a/dfoqQb",
      url: "https://quizbells.com/s/gboyCR",
      img: "/images/cp/cp-5.png",
    },
    {
      // url: "https://naver.me/FOZj6Bli",
      // url: "https://link.coupang.com/a/dfoq6U",
      url: "https://quizbells.com/s/iYBbQu",
      img: "/images/cp/cp-6.png",
    },
    {
      // url: "https://naver.me/xfYBqn1V",
      // url: "https://link.coupang.com/a/dforjk",
      url: "https://quizbells.com/s/vB73Xj",
      img: "/images/cp/cp-7.png",
    },
    {
      // url: "https://naver.me/FdodmcmD",
      // url: "https://link.coupang.com/a/dforvO",
      url: "https://quizbells.com/s/IHD03q",
      img: "/images/cp/cp-8.png",
    },
    {
      // url: "https://link.coupang.com/a/dforYi",
      url: "https://quizbells.com/s/DIu43Y",
      img: "/images/cp/cp-10.png",
    },
  ];

  const [randomItem, setRandomItem] = useState<(typeof coupangItems)[0] | null>(
    null
  );

  useEffect(() => {
    setRandomItem(
      coupangItems[Math.floor(Math.random() * coupangItems.length)]
    );
  }, []);

  return (
    <div className="mb-4">
      {randomItem && (
        <a href={randomItem.url} target="_blank">
          <img src={randomItem.img} alt="event-img" className="w-full h-auto" />
        </a>
      )}
    </div>
  );
}
