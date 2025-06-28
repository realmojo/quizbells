"use client";

import Image from "next/image";

export default function ImageComponents({
  type,
  answerDate,
}: {
  type: string;
  answerDate: string;
}) {
  if (type === "cashwalk") {
    return (
      <Image
        src="/images/cashwalk.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "kakaobank") {
    return (
      <Image
        src="/images/kakaobank.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "kakaopay") {
    return (
      <Image
        src="/images/kakaopay.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "kbstar") {
    return (
      <Image
        src="/images/kbstar.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "toss") {
    return (
      <Image
        src="/images/toss.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  }
}
