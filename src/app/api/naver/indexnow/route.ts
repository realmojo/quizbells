import { quizItems } from "@/utils/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const host = "https://quizbells.com";
  const key = "b21c58144b521f5656d122efdeaa208f";
  const urlList = quizItems.map((item) => [
    `https://quizbells.com/quiz/${item.type}/today`,
  ]);

  // POST 요청 예시
  const indexNowURL = "https://searchadvisor.naver.com/indexnow";
  const response = await fetch(indexNowURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      host,
      keyLocation: `${host}/${key}.txt`,
      urlList,
    }),
  });

  if (response.ok) {
    return NextResponse.json({ message: "IndexNow request sent successfully" });
  } else {
    return NextResponse.json(
      { message: "Failed to send IndexNow request" },
      { status: response.status }
    );
  }
}
