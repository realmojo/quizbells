import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const type = searchParams.get("type") || null;
    const limit = searchParams.get("limit") || 5;
    const offset = searchParams.get("offset") || 0;

    const values: any[] = [];

    // 게시글 목록 조회
    let sql = `
      SELECT id, type, title, author, regdated, views
      FROM quizbells_posts
    `;
    if (type) {
      sql += ` WHERE type = ?`;
      values.push(type);
    }
    sql += ` ORDER BY regdated DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const rows: any = await queryList(sql, values);
    const posts = Array.isArray(rows) ? rows : rows[0];

    // 전체 게시글 수 계산
    let countSql = `SELECT COUNT(*) as total FROM quizbells_posts`;
    const countValues: any[] = [];
    if (type) {
      countSql += ` WHERE type = ?`;
      countValues.push(type);
    }
    const countResult: any = await queryList(countSql, countValues);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      page,
      type: type || "all",
      total, // ← 전체 게시글 수 포함
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
