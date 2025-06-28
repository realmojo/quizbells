"use client";

import Image from "next/image";

export default function ImageComponents({
  type,
  answerDate,
}: {
  type: string;
  answerDate: string;
}) {
  if (type === "toss") {
    return (
      <Image
        src="/images/toss.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "cashwalk") {
    return (
      <Image
        src="/images/cashwalk.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "shinhan") {
    return (
      <Image
        src="/images/shinhan.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  } else if (type === "okcashbag") {
    return (
      <Image
        src="/images/okcashbag.png"
        alt={`${answerDate} ${type} 퀴즈 이미지`}
        width={600}
        height={600}
      />
    );
  }
}
