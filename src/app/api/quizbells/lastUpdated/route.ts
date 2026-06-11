import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


// ✅ 퀴즈벨 정답 수정 (Supabase)
// 테이블: quizbells_answer
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    // 현재 시간을 한국 시간(UTC+9)으로 변환하여 YYYY-MM-DD HH:mm:ss.microseconds 형식으로 생성
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9

    const year = koreaTime.getFullYear();
    const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreaTime.getDate()).padStart(2, "0");
    const hours = String(koreaTime.getHours()).padStart(2, "0");
    const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
    const seconds = String(koreaTime.getSeconds()).padStart(2, "0");
    const milliseconds = String(koreaTime.getMilliseconds()).padStart(3, "0");
    // 마이크로초는 밀리초를 6자리로 확장 (예: 576 -> 576000)
    const microseconds = milliseconds.padEnd(6, "0");

    const updated = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;

    const answerDate = `${year}-${month}-${day}`;

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .update({ updated })
      .eq("answerDate", answerDate)
      .select();

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

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
