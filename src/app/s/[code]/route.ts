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

    // 클릭 수 업데이트 (비동기 처리, 사용자 응답 대기 안 함)
    // DB에 'increment_link_clicks' RPC 함수가 있다면 일별 통계까지 같이 처리됨
    // 없다면 에러가 날 수 있으므로 예외처리 혹은 기존 방식 fallback

    (async () => {
      try {
        const { error: rpcError } = await supabaseAdmin.rpc(
          "increment_link_clicks",
          {
            p_link_id: data.id,
          }
        );

        if (rpcError) {
          // RPC 함수가 없거나 실패한 경우, 기존 방식(총 클릭 수만 증가)으로 fallback
          console.warn(
            "RPC failed, falling back to simple update:",
            rpcError.message
          );
          await supabaseAdmin
            .from("quizbells_short_links")
            .update({ clicks: (data.clicks || 0) + 1 })
            .eq("id", data.id);
        }
      } catch (e) {
        console.error("Click update failed:", e);
      }
    })();

    return NextResponse.redirect(new URL(data.original_url, req.url));
  } catch (err) {
    console.error("Redirect Error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
