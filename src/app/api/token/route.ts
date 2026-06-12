import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


// 한국 시간(KST, UTC+9)으로 현재 날짜/시간 가져오기
// Edge Runtime에서도 정확하게 작동하도록 UTC에 9시간을 더하는 방식 사용
const getKoreaTimeISOString = (): string => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTime = new Date(utcTime + (9 * 60 * 60 * 1000)); // UTC+9
  
  // ISO 문자열로 변환 (한국시간 기준)
  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ✅ 토큰 삭제
export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fcmToken = searchParams.get("fcmToken");

    if (!userId && !fcmToken) {
      return NextResponse.json(
        { success: false, error: "userId 또는 fcmToken이 필요합니다." },
        { status: 400 }
      );
    }

    // userId 또는 fcmToken으로 삭제
    let query = supabaseAdmin.from("quizbells_users").delete();
    if (userId) {
      query = query.eq("userId", userId);
    }
    if (fcmToken) {
      query = query.eq("fcmToken", fcmToken);
    }

    const { error } = await query;

    if (error) {
      console.error("🚨 Supabase delete error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "삭제에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// ✅ 토큰 등록 (새 사용자 또는 기존 사용자 업데이트)
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      return NextResponse.json(
        { success: false, error: "fcmToken과 userId가 필요합니다." },
        { status: 400 }
      );
    }

    const { fcmToken, userId, joinType } = params;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";

    // upsert: userId가 있으면 업데이트, 없으면 생성
    const { error } = await supabaseAdmin
      .from("quizbells_users")
      .upsert(
        {
          userId,
          fcmToken,
          joinType: joinType || null,
          ip,
          regdated: getKoreaTimeISOString(),
        },
        {
          onConflict: "userId",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("🚨 Supabase upsert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "저장에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// ✅ 토큰 갱신 (기존 사용자 업데이트)
export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      return NextResponse.json(
        { success: false, error: "fcmToken과 userId가 필요합니다." },
        { status: 400 }
      );
    }

    const { fcmToken, userId } = params;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";

    // userId로 업데이트
    const { data, error } = await supabaseAdmin
      .from("quizbells_users")
      .update({
        fcmToken,
        ip,
        lastUpdated: getKoreaTimeISOString(),
      })
      .eq("userId", userId)
      .select()
      .single();

    if (error) {
      console.error("🚨 Supabase update error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "갱신에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
