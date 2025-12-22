import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quizItems } from "@/utils/utils";

export const runtime = 'edge';

import moment from "moment-timezone";

const getKoreaDate = () => {
  return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
};

const answerLabelByType: Record<string, string> = {
  toss: "🎯 토스 행운퀴즈 정답",
  cashwalk: "🏃 캐시워크 돈버는퀴즈 정답",
  shinhan: "💙 신한쏠페이 쏠퀴즈, 퀴즈팡팡, 출석퀴즈 정답",
  kakaobank: "💛 카카오뱅크 OX 정답",
  kakaopay: "💛 카카오페이 퀴즈타임 정답",
  bitbunny: "🐰 비트버니 퀴즈 정답",
  okcashbag: "🧡 오케이캐시백 오퀴즈 정답",
  cashdoc: "💰 캐시닥 용돈퀴즈 정답",
  kbstar: "💛 KB스타/KBPAY 도전미션 스타퀴즈, 퀴즈 정답",
  "3o3": "3o3 퀴즈 정답",
  doctornow: "닥터나우 퀴즈 정답",
  mydoctor: "나만의닥터 건강퀴즈 정답",
  hpoint: "💎 H포인트 퀴즈 정답",
  skstoa: "SK 스토아 퀴즈타임 정답",
  hanabank: "🍀 하나은행 퀴즈하나 정답",
  auction: "옥션 매일퀴즈 정답",
  nh: "농협 디깅퀴즈 정답",
  kbank: "케이뱅크 미션퀴즈 정답",
  climate: "🌏 기후행동 기회소득 퀴즈 정답",
};

const getAnswerLabel = (type?: string, typeName?: string) => {
  if (!type) return `정답`;
  return answerLabelByType[type] || `${typeName || type} 정답`;
};

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return new NextResponse("Supabase Not Configured", { status: 500 });
    }

    const { data: quizzes, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select("*")
      .order("answerDate", { ascending: false })
      .order("id", { ascending: false })
      .limit(30);

    if (error) {
      console.error("RSS Feed Error:", error);
      return new NextResponse("Database Error", { status: 500 });
    }

    const baseUrl = "https://quizbells.com";
    const date = new Date().toUTCString();

    const itemsXml = quizzes
      ?.map((quiz) => {
        // Find quiz type info
        const typeInfo = quizItems.find((q) => q.type === quiz.type);
        const typeName = typeInfo?.typeKr || quiz.type;
        const typeTitle = typeInfo?.title || "";

        // Construct Title & URL
        // Title: [Date] [Type] [Title] Answer
        // e.g. 2024-12-15 Toss Fortune Quiz Answer
        const title = `${quiz.answerDate} ${typeName} ${typeTitle} 정답`;
        const link =
          quiz.answerDate === getKoreaDate()
            ? `${baseUrl}/quiz/${quiz.type}/today`
            : `${baseUrl}/quiz/${quiz.type}/${quiz.answerDate}`;

        // Description
        const description = `
          <![CDATA[
            <p>${quiz.question || "오늘의 퀴즈"}</p>
            <p><strong>${getAnswerLabel(quiz.type, typeName)}을 확인하세요.</strong></p>
          ]]>
        `;

        // Image
        // Use the static image for the quiz type if available
        const imageUrl = typeInfo?.image
          ? `${baseUrl}${typeInfo.image}`
          : `${baseUrl}/icons/og-image.png`;

        return `
          <item>
            <title>${title}</title>
            <link>${link}</link>
            <guid>${link}</guid>
            <pubDate>${new Date(quiz.createdAt || quiz.answerDate).toUTCString()}</pubDate>
            <description>${description}</description>
            <media:content url="${imageUrl}" type="image/png" medium="image" width="600" height="600" />
            <content:encoded>${description}</content:encoded>
          </item>
        `;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>퀴즈벨 - 오늘의 앱테크 퀴즈 정답</title>
          <link>${baseUrl}</link>
          <description>매일 업데이트되는 앱테크 퀴즈 정답 모음! 신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱의 퀴즈 정답을 실시간으로 확인하세요.</description>
          <language>ko-KR</language>
          <lastBuildDate>${date}</lastBuildDate>
          <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
          ${itemsXml}
        </channel>
      </rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "text/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err) {
    console.error("RSS Generation Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
