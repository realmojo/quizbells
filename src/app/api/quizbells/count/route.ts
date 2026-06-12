import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


// ✅ 퀴즈 정답 참여자 수 조회 API
// 테이블: quizbells_answer_count
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { success: false, error: "type은 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer_count")
      .select("count")
      .eq("quiz_type", type)
      .maybeSingle();

    if (error) {
      console.error("🚨 Supabase query error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "조회에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 데이터가 없으면 기본값 0 반환
    const count = data?.count || 0;

    return NextResponse.json({ success: true, count });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
