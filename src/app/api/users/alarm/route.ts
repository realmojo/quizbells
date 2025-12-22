import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

// ✅ 알림 대상 사용자 조회 (Supabase)
// 테이블: quizbells_users
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
        { success: false, error: "type 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    // 알림 대상 조회
    // select * from quizbells_users where isQuizAlarm = 'Y' and (alarmSettings like '%toss%' or alarmSettings = '*')
    const { data, error } = await supabaseAdmin
      .from("quizbells_users")
      .select("*")
      .eq("isQuizAlarm", "Y")
      .or(`alarmSettings.like.%${type}%,alarmSettings.eq.*`);

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

    return NextResponse.json(data || []);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
