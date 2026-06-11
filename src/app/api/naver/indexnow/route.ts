import { NextRequest, NextResponse } from "next/server";


const KEY = "b21c58144b521f5656d122efdeaa208f";
const HOST = "quizbells.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const urlList = [`https://${HOST}/quiz/${encodeURIComponent(type)}/today`];

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  });

  const headers = { "Content-Type": "application/json; charset=utf-8" };

  // Naver와 Bing(IndexNow)에 병렬로 전송. 각각 독립적으로 처리.
  const [naverResult, bingResult] = await Promise.allSettled([
    fetch("https://searchadvisor.naver.com/indexnow", {
      method: "POST",
      headers,
      body: payload,
    }),
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers,
      body: payload,
    }),
  ]);

  const naverOk = naverResult.status === "fulfilled" && naverResult.value.ok;
  const bingOk = bingResult.status === "fulfilled" && bingResult.value.ok;

  if (naverOk) {
    return NextResponse.json({
      status: "ok",
      message: "IndexNow request sent successfully",
      urlList,
      naver: "ok",
      bing: bingOk ? "ok" : "failed",
    });
  } else {
    const naverDetail =
      naverResult.status === "fulfilled"
        ? await naverResult.value.text()
        : naverResult.reason?.message || "Network error";
    return NextResponse.json(
      {
        message: "Failed to send IndexNow request",
        detail: naverDetail,
        bing: bingOk ? "ok" : "failed",
      },
      {
        status:
          naverResult.status === "fulfilled" ? naverResult.value.status : 500,
      }
    );
  }
}
