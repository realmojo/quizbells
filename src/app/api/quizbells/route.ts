import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

// ✅ 퀴즈벨 정답 조회 (Supabase)
// 테이블: quizbells_answer
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
    const answerDate = searchParams.get("answerDate");

    if (!type || !answerDate) {
      return NextResponse.json(
        { success: false, error: "type, answerDate는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select("*")
      .eq("type", type)
      .eq("answerDate", answerDate)
      .order("id", { ascending: false })
      .limit(1)
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

    if (!data) {
      return NextResponse.json(
        { success: false, error: "데이터가 없습니다." },
        { status: 200 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
