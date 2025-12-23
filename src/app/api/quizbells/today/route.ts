import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quizItems } from "@/utils/utils";

export const runtime = 'edge';

// ✅ 오늘 날짜의 모든 퀴즈 타입 정답 조회 (한 번에)
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const answerDate = searchParams.get("answerDate");
    const isNew = searchParams.get("isNew") === "true";

    if (!answerDate) {
      return NextResponse.json(
        { success: false, error: "answerDate는 필수입니다." },
        { status: 400 }
      );
    }

    // 모든 퀴즈 타입 목록 가져오기
    const types = quizItems.map((item) => item.type);

    // isNew=true일 때는 type만 조회 (가벼운 쿼리)
    const selectFields = isNew ? "type" : "*";

    // 한 번의 쿼리로 모든 타입의 오늘 날짜 데이터 조회
    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select(selectFields)
      .eq("answerDate", answerDate)
      .in("type", types)
      .order("id", { ascending: false });

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

    // isNew=true일 때는 정답 존재 여부만 반환
    if (isNew) {
      const result: Record<string, boolean> = {};
      types.forEach((type) => {
        result[type] = false;
      });
      
      if (data && data.length > 0) {
        // 각 타입별로 데이터가 있는지 확인
        const typeSet = new Set<string>();
        data.forEach((item) => {
          typeSet.add(item.type);
        });
        
        typeSet.forEach((type) => {
          result[type] = true;
        });
      }

      return NextResponse.json(result);
    }

    // isNew=false일 때는 전체 데이터 반환
    const result: Record<string, any> = {};
    
    if (data && data.length > 0) {
      // 각 타입별로 가장 최신 데이터만 선택
      const typeMap = new Map<string, any>();
      data.forEach((item) => {
        const existing = typeMap.get(item.type);
        if (!existing || item.id > existing.id) {
          typeMap.set(item.type, item);
        }
      });
      
      typeMap.forEach((value, key) => {
        result[key] = value;
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

