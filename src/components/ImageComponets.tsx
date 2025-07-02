"use client";

import Image from "next/image";

export default function ImageComponents({
  type,
  answerDate,
}: {
  type: string;
  answerDate: string;
}) {
  return (
    <Image
      src={`/images/${type}.png`}
      alt={`${answerDate} ${type} 퀴즈 이미지`}
      width={600}
      height={600}
      priority
    />
  );
}
