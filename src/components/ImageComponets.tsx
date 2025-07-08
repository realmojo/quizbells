"use client";

import Image from "next/image";

export default function ImageComponents({
  type,
  answerDate,
  width = 600,
  height = 600,
}: {
  type: string;
  answerDate?: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      src={`/images/${type}.png`}
      alt={`${answerDate ? answerDate : ""} ${type} 퀴즈 이미지`}
      width={width}
      height={height}
      priority
    />
  );
}
