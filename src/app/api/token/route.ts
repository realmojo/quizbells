import { NextRequest, NextResponse } from "next/server";
import { insertOne, updateOne } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fcmToken = searchParams.get("fcmToken");
    if (!userId && !fcmToken) {
      throw new Error("no parameter");
    }

    const query = "DELETE FROM quizbells_users WHERE userId= ? AND fcmToken= ?";
    await insertOne(query, [userId, fcmToken]);

    return NextResponse.json({ success: true, data: "ok" });
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

    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";

    const { fcmToken, userId, joinType } = params;

    const query =
      "INSERT INTO quizbells_users (userId, fcmToken, joinType, regdated, ip) VALUES (?, ?, ?, NOW(), ?)";
    await insertOne(query, [userId, fcmToken, joinType, ip]);

    return NextResponse.json({ success: true, data: "ok" });
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

    const query =
      "UPDATE quizbells_users SET fcmToken= ?, lastUpdated= NOW(), ip= ? WHERE userId= ?";
    await updateOne(query, [fcmToken, ip, userId]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
