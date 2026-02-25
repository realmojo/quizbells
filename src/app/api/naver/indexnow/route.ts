import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const KEY = "b21c58144b521f5656d122efdeaa208f";
const HOST = "quizbells.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const urlList = [`https://${HOST}/quiz/${encodeURIComponent(type)}/today`];

  // POST 방식으로 일괄 제출 (네이버 권장)
  const response = await fetch("https://searchadvisor.naver.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  if (response.ok) {
    return NextResponse.json({
      status: "ok",
      message: "IndexNow request sent successfully",
      urlList,
    });
  } else {
    const text = await response.text();
    return NextResponse.json(
      { message: "Failed to send IndexNow request", detail: text },
      { status: response.status }
    );
  }
}
