import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

// ✅ 퀴즈벨 정답
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const answerDate = searchParams.get("answerDate");

    const query =
      "SELECT * FROM quizbells WHERE type = ? AND answerDate = ? ORDER BY id DESC LIMIT 1";
    const item = await queryOne<any>(query, [type, answerDate]);

    // ✅ 결과 반환
    return NextResponse.json(item);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
