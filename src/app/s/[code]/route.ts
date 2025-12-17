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
      .select("original_url")
      .eq("code", code)
      .single();

    if (error || !data || !data.original_url) {
      // Not found or error
      return NextResponse.redirect(new URL("/?error=link_not_found", req.url));
    }

    // Optional: Async click tracking (fire and forget, don't await)
    // supabaseAdmin.rpc('increment_click', { code });

    return NextResponse.redirect(new URL(data.original_url, req.url));
  } catch (err) {
    console.error("Redirect Error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
