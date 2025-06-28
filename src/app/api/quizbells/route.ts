import { NextRequest, NextResponse } from "next/server";
import { queryList, queryOne } from "@/lib/db";

// ✅ 퀴즈벨 정답
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const answerDate = searchParams.get("answerDate");

    let query = "";
    let items = undefined;
    if (type) {
      query =
        "SELECT * FROM quizbells WHERE type = ? AND answerDate = ? ORDER BY id DESC LIMIT 1";
      items = await queryOne<any>(query, [type, answerDate]);
    } else if (answerDate) {
      query =
        "SELECT type, answerDate FROM quizbells WHERE answerDate = ? GROUP BY type ORDER BY id DESC";
      items = await queryList<any>(query, [answerDate]);
    }

    // ✅ 결과 반환
    return NextResponse.json(items);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
