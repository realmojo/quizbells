import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

// ✅ 퀴즈벨 정답 수정 (Supabase)
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
    const { id, contents, updated } = body;

    if (!id || !contents || !updated) {
      return NextResponse.json(
        { success: false, error: "id, contents, updated는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .update({ contents, updated })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("🚨 Supabase update error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "업데이트에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "해당 ID의 정답을 찾을 수 없습니다." },
        { status: 404 }
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
