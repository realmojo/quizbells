import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { customAlphabet } from "nanoid";

export const runtime = 'edge';

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.error("Supabase Admin not initialized");
      return NextResponse.json(
        { error: "Server Configuration Error" },
        { status: 500 }
      );
    }

    // Generate unique code
    const code = nanoid();

    // Insert into DB
    const { data, error } = await supabaseAdmin
      .from("quizbells_short_links")
      .insert({
        code,
        original_url: url,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host");
    const shortUrl = `${protocol}://${host}/s/${data.code}`;

    return NextResponse.json({
      success: true,
      shortUrl,
      code: data.code,
      originalUrl: data.original_url,
    });
  } catch (err) {
    console.error("Shortener API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
