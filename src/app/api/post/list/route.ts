import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const API_URL =
      process.env.API_URL || "http://api.mindpang.com/api/quizbells";
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const type = searchParams.get("type") || "";
    const limit = searchParams.get("limit") || 5;
    const offset = searchParams.get("offset") || 0;

    const url = `${API_URL}/postList.php?page=${page}&type=${type}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("🚨 DB error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
