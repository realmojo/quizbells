import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const params = await props.params;
    const { code } = params;

    if (!code) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!supabaseAdmin) {
      console.error("Supabase Admin not initialized");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const { data, error } = await supabaseAdmin
      .from("quizbells_short_links")
      .select("id, original_url, clicks")
      .eq("code", code)
      .single();

    if (error || !data || !data.original_url) {
      // Not found or error
      return NextResponse.redirect(new URL("/?error=link_not_found", req.url));
    }

    // Update click count asynchronously
    await supabaseAdmin
      .from("quizbells_short_links")
      .update({ clicks: (data.clicks || 0) + 1 })
      .eq("id", data.id);

    return NextResponse.redirect(new URL(data.original_url, req.url));
  } catch (err) {
    console.error("Redirect Error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
