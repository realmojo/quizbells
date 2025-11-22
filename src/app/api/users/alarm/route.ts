import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.API_URL || "http://api.mindpang.com/api/quizbells";

// ✅ user 정보 가져오기
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing type parameter" },
        { status: 400 }
      );
    }

    const url = `${API_URL}/alarmUsers.php?type=${type}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
