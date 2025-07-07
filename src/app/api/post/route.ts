import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

// ✅ user 정보 가져오기
export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const query = "SELECT * FROM quizbells_posts WHERE id = ?";
    const post = await queryOne(query, [id]);

    // ✅ 결과 반환
    return NextResponse.json(post);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
