import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quizItems } from "@/utils/utils";
import { format } from "date-fns";

export const runtime = "edge";

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기
// Edge Runtime에서도 정확하게 작동하도록 UTC에 9시간을 더하는 방식 사용
const getKoreaDate = (): string => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
  return format(koreaTime, "yyyy-MM-dd");
};

const answerLabelByType: Record<string, string> = {
  toss: "🎯 토스 두근두근 1등찍기 행운퀴즈 정답",
  cashwalk: "🏃 캐시워크 돈버는퀴즈 정답",
  shinhan: "💙 신한쏠페이 쏠퀴즈, 퀴즈팡팡, 출석퀴즈 정답",
  kakaobank: "💛 카카오뱅크 AI 이모지 퀴즈 정답",
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

    // updated 컬럼이 포함되도록 확인 (이미 *로 조회하므로 포함됨)

    if (error) {
      console.error("RSS Feed Error:", error);
      return new NextResponse("Database Error", { status: 500 });
    }

    const baseUrl = "https://quizbells.com";
    const date = new Date().toUTCString();

    // 날짜 포맷팅 헬퍼 함수
    const formatDateForTitle = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}월 ${day}일`;
      } catch {
        return dateString;
      }
    };

    // pubDate를 위한 시간 포맷팅 (분/초 단위까지 정밀도 향상)
    const formatPubDate = (quiz: any): string => {
      // updated 컬럼이 있으면 사용, 없으면 createdAt, 둘 다 없으면 answerDate
      const dateTime =
        quiz.updated || quiz.createdAt || `${quiz.answerDate}T09:00:00+09:00`;
      try {
        const date = new Date(dateTime);
        return date.toUTCString();
      } catch {
        // 폴백: answerDate를 사용하되 현재 시간의 시/분/초 추가
        const now = new Date();
        const dateStr = quiz.answerDate || getKoreaDate();
        const date = new Date(
          `${dateStr}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}+09:00`,
        );
        return date.toUTCString();
      }
    };

    // 퀴즈 내용에서 정답 키워드 추출
    const extractAnswerKeywords = (quiz: any): string => {
      const keywords: string[] = [];
      if (quiz.answer) {
        keywords.push(quiz.answer);
      }
      if (
        quiz.otherAnswers &&
        Array.isArray(quiz.otherAnswers) &&
        quiz.otherAnswers.length > 0
      ) {
        keywords.push(...quiz.otherAnswers.slice(0, 3)); // 최대 3개만
      }
      return keywords.length > 0 ? keywords.join(", ") : "";
    };

    const itemsXml = quizzes
      ?.map((quiz) => {
        // Find quiz type info
        const typeInfo = quizItems.find((q) => q.type === quiz.type);
        const typeName = typeInfo?.typeKr || quiz.type;
        const typeTitle = typeInfo?.title || "";

        // 날짜 포맷팅
        const dateLabel = formatDateForTitle(quiz.answerDate);

        // 제목 강화: [실시간 업데이트] 키워드 추가
        const title = `[실시간 업데이트] ${dateLabel} ${typeName} ${typeTitle} 정답 확인${quiz.answer ? ` (${quiz.answer}${quiz.otherAnswers?.length > 0 ? ` 등` : ""})` : ""}`;

        const link =
          quiz.answerDate === getKoreaDate()
            ? `${baseUrl}/quiz/${quiz.type}/today`
            : `${baseUrl}/quiz/${quiz.type}/${quiz.answerDate}`;

        // 정답 키워드 추출
        const answerKeywords = extractAnswerKeywords(quiz);

        // 본문 내용 확장 (정답 정보와 키워드 포함)
        const contentText = `
          <![CDATA[
            <h2>${typeName} ${typeTitle} ${dateLabel} 정답</h2>
            ${quiz.question ? `<p><strong>질문:</strong> ${quiz.question}</p>` : ""}
            <p><strong>정답:</strong> ${quiz.answer || "확인 중"}</p>
            ${answerKeywords ? `<p><strong>키워드:</strong> ${answerKeywords}</p>` : ""}
            ${quiz.otherAnswers && quiz.otherAnswers.length > 0 ? `<p><strong>다른 정답:</strong> ${quiz.otherAnswers.join(", ")}</p>` : ""}
            <p>${getAnswerLabel(quiz.type, typeName)}을 확인하고 포인트를 적립하세요!</p>
            <p><a href="${link}">${link}</a></p>
          ]]>
        `;

        // Description (간단한 버전)
        const description = `
          <![CDATA[
            <p>${quiz.question || `${typeName} ${typeTitle} 퀴즈`}</p>
            <p><strong>정답: ${quiz.answer || "확인 중"}</strong></p>
            <p>${getAnswerLabel(quiz.type, typeName)}을 확인하세요.</p>
          ]]>
        `;

        // Image
        const imageUrl = typeInfo?.image
          ? `${baseUrl}${typeInfo.image}`
          : `${baseUrl}/icons/og-image.png`;

        // pubDate: updated 컬럼 사용 (분/초 단위까지 정밀도 향상)
        const pubDate = formatPubDate(quiz);

        return `
          <item>
            <title>${title}</title>
            <link>${link}</link>
            <guid>${link}</guid>
            <pubDate>${pubDate}</pubDate>
            <description>${description}</description>
            <media:content url="${imageUrl}" type="image/png" medium="image" width="600" height="600" />
            <content:encoded>${contentText}</content:encoded>
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
