import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.API_URL || "https://api.mindpang.com/api/quizbells";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fcmToken = searchParams.get("fcmToken");

    if (!userId && !fcmToken) {
      throw new Error("no parameter");
    }

    const url = `${API_URL}/token.php?userId=${userId}&fcmToken=${fcmToken}`;
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
// ✅ PATCH 토큰 갱신 요청 처리
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      throw new Error("no parameter");
    }

    const { fcmToken, userId, joinType } = params;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";

    const url = `${API_URL}/token.php?userId=${userId}&fcmToken=${fcmToken}&joinType=${joinType}&ip=${ip}`;
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// ✅ PATCH 토큰 갱신 요청 처리
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      throw new Error("no parameter");
    }

    const { fcmToken, userId } = params;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";

    const url = `${API_URL}/token.php?userId=${userId}&fcmToken=${fcmToken}&ip=${ip}`;
    const res = await fetch(url, { method: "PATCH" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
