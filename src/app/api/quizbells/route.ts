import { NextRequest, NextResponse } from "next/server";

// ✅ 퀴즈벨 정답
export async function GET(req: NextRequest) {
  try {
    const API_URL =
      process.env.API_URL || "http://api.mindpang.com/api/quizbells";
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const answerDate = searchParams.get("answerDate");

    const url = `${API_URL}/item.php?type=${type}&answerDate=${answerDate}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
