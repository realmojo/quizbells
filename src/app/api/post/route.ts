import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

// ✅ 게시글 1개 조회 API (Supabase)
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("🚨 Supabase error:", error);
      return NextResponse.json(
        { error: "데이터 조회에 실패했습니다.", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

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
