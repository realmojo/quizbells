import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Supabase 쿼리 빌더 시작
    let query = supabaseAdmin
      .from("quizbells_posts")
      .select("*", { count: "exact" })
      .order("date", { ascending: false });

    // category 필터링
    if (category) {
      query = query.eq("category", category);
    }

    // 페이지네이션 적용
    const from = offset;
    const to = offset + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("🚨 Supabase error:", error);
      return NextResponse.json(
        { error: "데이터 조회에 실패했습니다.", details: error.message },
        { status: 500 }
      );
    }

    // 응답 형식 맞추기 (기존 API와 동일한 형식)
    return NextResponse.json({
      posts: data || [],
      total: count || 0,
    });
  } catch (err) {
    console.error("🚨 DB error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
