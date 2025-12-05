import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ✅ user 정보 가져오기
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_users")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 레코드를 찾을 수 없음
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
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

    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const params = await req.json();
    const { isQuizAlarm, alarmSettings } = params;

    // 업데이트할 데이터 준비
    const updateData: any = {};

    if (isQuizAlarm !== undefined) {
      updateData.isQuizAlarm = isQuizAlarm;
    }

    if (alarmSettings !== undefined) {
      updateData.alarmSettings = alarmSettings;
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_users")
      .update(updateData)
      .eq("userId", userId)
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
