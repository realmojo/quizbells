import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


// ✅ 퀴즈벨 정답 등록 (Supabase)
// 테이블: quizbells_answer
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { type, answerDate, contents } = body;

    if (!type || !answerDate || !contents) {
      return NextResponse.json(
        { success: false, error: "type, answerDate, contents는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .insert([
        {
          type,
          answerDate,
          contents,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("🚨 Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "저장에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
