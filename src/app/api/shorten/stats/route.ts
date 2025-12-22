import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase not initialized" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_short_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Stats Fetch Error:", error);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, links: data });
  } catch (err) {
    console.error("Stats API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
