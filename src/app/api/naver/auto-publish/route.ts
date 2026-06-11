import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quizItems } from "@/utils/utils";
import {
  buildQuizCafeContent,
  getValidNaverAccessToken,
  postCafeArticle,
  type QuizAnswerItem,
} from "@/lib/naver-cafe";


// 자동 발행 대상 카페/게시판 (본인 소유 카페: 재테크플로우 / menuId 48)
const DEFAULT_CLUB_ID = "31632186";
const DEFAULT_MENU_ID = "48";
// 스팸/도배로 보이지 않도록 한 번 실행에서 발행하는 글 수 제한.
// 멱등하므로 남은 타입은 다음 실행(시간당 cron)에서 이어서 발행된다.
const DEFAULT_LIMIT = 5;
const DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 한국 시간 기준 오늘 날짜(YYYY-MM-DD)와 라벨(M월 D일)
function getKstDate(): { date: string; label: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const y = get("year");
  const m = get("month");
  const d = get("day");
  return { date: `${y}-${m}-${d}`, label: `${Number(m)}월 ${Number(d)}일` };
}

export async function GET(req: NextRequest) {
  // 1) 시크릿 검증 (?secret= 또는 Authorization: Bearer)
  const { searchParams } = new URL(req.url);
  const expected = process.env.CRON_SECRET;
  const provided =
    searchParams.get("secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase 설정이 완료되지 않았습니다." },
      { status: 500 },
    );
  }

  const clubId = searchParams.get("clubId") || DEFAULT_CLUB_ID;
  const menuId = searchParams.get("menuId") || DEFAULT_MENU_ID;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
  const { date, label } = getKstDate();

  // 2) 유효한 access token 확보 (없으면 최초 수동 로그인 필요)
  let accessToken: string | null;
  try {
    accessToken = await getValidNaverAccessToken();
  } catch (e) {
    return NextResponse.json(
      { error: "토큰 확보 실패", detail: String(e) },
      { status: 500 },
    );
  }
  if (!accessToken) {
    return NextResponse.json(
      {
        error: "저장된 네이버 토큰이 없습니다. /naver-cafe 에서 1회 로그인 후 다시 시도하세요.",
      },
      { status: 412 },
    );
  }

  // 3) 오늘 발행 대상 정답 조회 (모든 타입 한 번에)
  const types = quizItems.map((q) => q.type);
  const { data: answers, error: ansErr } = await supabaseAdmin
    .from("quizbells_answer")
    .select("type, contents")
    .eq("answerDate", date)
    .in("type", types)
    .order("id", { ascending: false });

  if (ansErr) {
    return NextResponse.json(
      { error: "정답 조회 실패", detail: ansErr.message },
      { status: 500 },
    );
  }

  // 4) 오늘 이미 발행한 타입 목록 (중복 방지)
  const { data: logs } = await supabaseAdmin
    .from("naver_cafe_publish_log")
    .select("quiz_type")
    .eq("club_id", clubId)
    .eq("menu_id", menuId)
    .eq("answer_date", date);
  const publishedTypes = new Set((logs ?? []).map((l: any) => l.quiz_type));

  // 타입별 최신 contents만 사용 (id desc 정렬이므로 첫 등장이 최신)
  const latestByType = new Map<string, QuizAnswerItem[]>();
  for (const row of (answers ?? []) as any[]) {
    if (!latestByType.has(row.type) && Array.isArray(row.contents)) {
      latestByType.set(row.type, row.contents);
    }
  }

  const results: Array<{
    type: string;
    status: "published" | "skipped" | "error";
    detail?: string;
  }> = [];
  let publishedCount = 0;

  // 5) 타입별 발행
  for (const item of quizItems) {
    if (publishedCount >= limit) break;

    const contents = latestByType.get(item.type);
    if (!contents || contents.length === 0) continue; // 오늘 정답 없음
    if (publishedTypes.has(item.type)) {
      results.push({ type: item.type, status: "skipped", detail: "이미 발행됨" });
      continue;
    }

    const quizName = `${item.typeKr} ${item.title}`;
    const { subject, content } = buildQuizCafeContent({
      quizName,
      quizType: item.type,
      dateLabel: label,
      contents,
    });

    try {
      const { articleId } = await postCafeArticle({
        accessToken,
        clubId,
        menuId,
        subject,
        content,
      });

      await supabaseAdmin.from("naver_cafe_publish_log").insert({
        club_id: clubId,
        menu_id: menuId,
        quiz_type: item.type,
        answer_date: date,
        article_id: articleId ?? null,
        article_url: articleId
          ? `https://cafe.naver.com/ca-fe/cafes/${clubId}/articles/${articleId}`
          : null,
        status: "ok",
      });

      publishedCount++;
      results.push({ type: item.type, status: "published" });
      if (publishedCount < limit) await sleep(DELAY_MS);
    } catch (e) {
      results.push({ type: item.type, status: "error", detail: String(e) });
    }
  }

  return NextResponse.json({
    status: "ok",
    date,
    clubId,
    menuId,
    publishedCount,
    results,
  });
}
