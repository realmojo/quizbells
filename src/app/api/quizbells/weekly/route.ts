import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { format, subDays } from "date-fns";


// 한국 시간 기준 날짜 가져오기
const getKoreaDate = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return koreaTime;
};

// ✅ 주간 퀴즈벨 정답 조회 (최근 7일)
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const baseDate = searchParams.get("baseDate"); // 선택적: 기준 날짜 (기본값: 오늘)

    if (!type) {
      return NextResponse.json(
        { success: false, error: "type은 필수입니다." },
        { status: 400 }
      );
    }

    // 기준 날짜 설정 (기본값: 오늘)
    const today = baseDate ? new Date(baseDate) : getKoreaDate();
    const startDate = subDays(today, 6); // 7일 전

    // 날짜 범위 생성
    const startDateStr = format(startDate, "yyyy-MM-dd");
    const endDateStr = format(today, "yyyy-MM-dd");

    // Supabase에서 날짜 범위로 조회
    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select("*")
      .eq("type", type)
      .gte("answerDate", startDateStr)
      .lte("answerDate", endDateStr)
      .order("answerDate", { ascending: false });

    if (error) {
      console.error("🚨 Supabase query error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "조회에 실패했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "주간 데이터가 없습니다.",
      });
    }

    // 응답 데이터 구조화
    return NextResponse.json({
      success: true,
      data: data.map((item) => ({
        id: item.id,
        type: item.type,
        answerDate: item.answerDate,
        contents: item.contents,
        created: item.created,
        updated: item.updated,
      })),
      count: data.length,
      dateRange: {
        start: startDateStr,
        end: endDateStr,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
