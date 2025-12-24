import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    // Date parameter is optional now (or ignored for total stats)
    
    if (!type) {
      return NextResponse.json({ error: "Missing type param" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "No DB" }, { status: 500 });
    }

    // 날짜 구분 없이 해당 타입의 전체 통계 조회
    const { count: helpfulCount, error: error1 } = await supabaseAdmin
      .from("quizbells_feedback")
      .select("*", { count: "exact", head: true })
      .eq("quiz_type", type)
      .eq("is_helpful", true);

    const { count: notHelpfulCount, error: error2 } = await supabaseAdmin
      .from("quizbells_feedback")
      .select("*", { count: "exact", head: true })
      .eq("quiz_type", type)
      .eq("is_helpful", false);

    if (error1 || error2) {
      console.error("Feedback fetch error:", error1 || error2);
      return NextResponse.json({ helpful: 0, notHelpful: 0 });
    }

    return NextResponse.json({ 
      helpful: helpfulCount || 0, 
      notHelpful: notHelpfulCount || 0 
    });
  } catch (err) {
    console.error("Feedback API Error:", err);
    return NextResponse.json({ helpful: 0, notHelpful: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, date, isHelpful } = body;

    if (!type || !date || isHelpful === undefined) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "No DB" }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from("quizbells_feedback")
      .insert({
        quiz_type: type,
        answer_date: date,
        is_helpful: isHelpful
      });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json({ error: "DB Error", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback API Update Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
