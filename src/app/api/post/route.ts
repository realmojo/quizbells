import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

// ✅ 게시글 1개 조회 API
export async function GET(req: NextRequest) {
  try {
    // ✅ Next.js 전용 searchParams 사용
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    // ✅ DB에서 게시글 1개 조회
    const query = "SELECT * FROM quizbells_posts WHERE id = ?";
    const post = await queryOne(query, [id]);

    // ✅ 게시글이 없을 경우
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ 성공 응답
    return NextResponse.json(post);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("🚨 DB Error:", errorMessage);

    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
