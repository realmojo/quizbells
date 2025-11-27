import { NextRequest, NextResponse } from "next/server";

// ✅ 게시글 1개 조회 API
export async function GET(req: NextRequest) {
  try {
    const API_URL =
      process.env.API_URL || "https://api.mindpang.com/api/quizbells";
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const url = `${API_URL}/post.php?id=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("🚨 DB Error:", errorMessage);

    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
