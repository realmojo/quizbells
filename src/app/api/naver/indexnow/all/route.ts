import { quizItems } from "@/utils/utils";
import { supabaseAdmin } from "@/lib/supabase";
import { tips } from "@/app/tips/tipsData";
import { NextResponse } from "next/server";

export const runtime = "edge";

const HOST = "quizbells.com";
const KEY = "b21c58144b521f5656d122efdeaa208f";
const BASE_URL = `https://${HOST}`;

export async function GET() {
  const urlList: string[] = [];

  // 1. 정적 페이지
  const staticPages = [
    "",
    "/about",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
    "/posts",
    "/tips",
  ];
  for (const page of staticPages) {
    urlList.push(`${BASE_URL}${page}`);
  }

  // 2. 퀴즈 today 페이지 (전체 타입)
  for (const item of quizItems) {
    urlList.push(`${BASE_URL}/quiz/${item.type}/today`);
  }

  // 3. Posts (DB에서 조회)
  if (supabaseAdmin) {
    try {
      const { data: posts } = await supabaseAdmin
        .from("quizbells_posts")
        .select("id")
        .order("date", { ascending: false });

      if (posts) {
        for (const post of posts) {
          urlList.push(`${BASE_URL}/posts/${post.id}`);
        }
      }
    } catch (e) {
      console.error("Posts 조회 오류:", e);
    }
  }

  // 4. Tips (정적 데이터)
  for (const tip of tips) {
    urlList.push(`${BASE_URL}/tips/${tip.id}`);
  }

  // IndexNow는 한 번에 최대 10,000개 URL 제출 가능
  // 10,000개 초과 시 배치 분할
  const batchSize = 10000;
  const results: { batch: number; status: string; count: number }[] = [];

  for (let i = 0; i < urlList.length; i += batchSize) {
    const batch = urlList.slice(i, i + batchSize);

    const response = await fetch(
      "https://searchadvisor.naver.com/indexnow",
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: KEY,
          keyLocation: `${BASE_URL}/${KEY}.txt`,
          urlList: batch,
        }),
      }
    );

    results.push({
      batch: Math.floor(i / batchSize) + 1,
      status: response.ok ? "ok" : `error (${response.status})`,
      count: batch.length,
    });
  }

  const totalCount = urlList.length;
  const allOk = results.every((r) => r.status === "ok");

  return NextResponse.json({
    status: allOk ? "ok" : "partial_error",
    message: allOk
      ? `${totalCount}개 URL IndexNow 제출 완료`
      : "일부 배치 제출 실패",
    totalUrls: totalCount,
    results,
    urlList,
  });
}
