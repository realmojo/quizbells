import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const url = `https://quizbells.com/quiz/${type}/today`;
  const key = "b21c58144b521f5656d122efdeaa208f";

  // GET 요청 예시
  const indexNowURL = `https://searchadvisor.naver.com/indexnow?url=${url}&key=${key}`;
  const response = await fetch(indexNowURL, {
    method: "GET",
  });

  if (response.ok) {
    return NextResponse.json({
      status: "ok",
      message: "IndexNow request sent successfully",
    });
  } else {
    return NextResponse.json(
      { message: "Failed to send IndexNow request" },
      { status: response.status }
    );
  }
}
