// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const type = searchParams.get("type") || null;
    const limit = 10;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, type, title, author, regdated, views
      FROM quizbells_posts
    `;
    const values: any[] = [];

    if (type) {
      sql += ` WHERE type = ?`;
      values.push(type);
    }

    sql += ` ORDER BY regdated DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const rows: any = await queryList(sql, values);
    const posts = Array.isArray(rows) ? rows : rows[0]; // 안전하게 배열화

    return NextResponse.json({
      page,
      type: type || "all",
      posts,
    });
  } catch (err) {
    console.error("🚨 DB error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
