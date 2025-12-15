import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quizItems } from "@/utils/utils";

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
        const link = `${baseUrl}/quiz/${quiz.type}/${quiz.answerDate}`;
        
        // Description
        const description = `
          <![CDATA[
            <p>${quiz.question || "오늘의 퀴즈"}</p>
            <p><strong>정답: ${quiz.answer}</strong></p>
            ${quiz.otherAnswers && quiz.otherAnswers.length > 0 
              ? `<p>다른 정답: ${quiz.otherAnswers.join(", ")}</p>` 
              : ""}
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
