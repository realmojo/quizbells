// 서버 컴포넌트 전용: Supabase 직접 조회
//
// Cloudflare Workers에서는 Worker가 자기 자신의 도메인(quizbells.com)으로 보내는
// fetch(self-fetch)가 실패하므로, 서버 측에서는 /api/* 를 거치지 않고 DB를 직접 조회한다.
// 클라이언트 컴포넌트는 기존처럼 utils/api.ts의 상대 경로 fetch를 사용하면 된다.
// 반환 형태는 기존 API 응답과 동일하게 유지한다.

import { supabaseAdmin } from "@/lib/supabase";
import { format, subDays, startOfMonth } from "date-fns";

// 한국 시간(KST, UTC+9) 기준 현재 날짜
const getKoreaDate = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcTime + 9 * 60 * 60 * 1000);
};

// ✅ 퀴즈 정답 조회 (utils/api.ts getQuizbells와 동일한 반환 형태)
export const getQuizbellsFromDb = async (
  type: string,
  answerDate: string,
): Promise<any | null> => {
  try {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select("*")
      .eq("type", type)
      .eq("answerDate", answerDate)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("getQuizbellsFromDb 오류:", error.message);
      return null;
    }

    return data?.contents?.length ? data : null;
  } catch (error) {
    console.error("getQuizbellsFromDb 오류:", error);
    return null;
  }
};

// 주간/월간 공통: 날짜 범위 조회 후 API와 동일한 형태로 매핑
const getQuizbellsRangeFromDb = async (
  type: string,
  startDateStr: string,
  endDateStr: string,
): Promise<any | null> => {
  try {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer")
      .select("*")
      .eq("type", type)
      .gte("answerDate", startDateStr)
      .lte("answerDate", endDateStr)
      .order("answerDate", { ascending: false });

    if (error) {
      console.error("getQuizbellsRangeFromDb 오류:", error.message);
      return null;
    }

    return {
      success: true,
      data: (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        answerDate: item.answerDate,
        contents: item.contents,
        created: item.created,
        updated: item.updated,
      })),
      count: data?.length || 0,
      dateRange: { start: startDateStr, end: endDateStr },
    };
  } catch (error) {
    console.error("getQuizbellsRangeFromDb 오류:", error);
    return null;
  }
};

// ✅ 주간(최근 7일) 정답 조회
export const getWeeklyQuizbellsFromDb = async (
  type: string,
  baseDate?: string,
): Promise<any | null> => {
  const today = baseDate ? new Date(baseDate) : getKoreaDate();
  return getQuizbellsRangeFromDb(
    type,
    format(subDays(today, 6), "yyyy-MM-dd"),
    format(today, "yyyy-MM-dd"),
  );
};

// ✅ 월간(이번 달) 정답 조회
export const getMonthlyQuizbellsFromDb = async (
  type: string,
  baseDate?: string,
): Promise<any | null> => {
  const today = baseDate ? new Date(baseDate) : getKoreaDate();
  return getQuizbellsRangeFromDb(
    type,
    format(startOfMonth(today), "yyyy-MM-dd"),
    format(today, "yyyy-MM-dd"),
  );
};

// ✅ 참여자 수 조회 (quizbells_answer_count)
export const getParticipantCountFromDb = async (
  type: string,
): Promise<number | null> => {
  try {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from("quizbells_answer_count")
      .select("count")
      .eq("quiz_type", type)
      .maybeSingle();

    if (error) {
      console.error("getParticipantCountFromDb 오류:", error.message);
      return null;
    }

    return data?.count ?? null;
  } catch (error) {
    console.error("getParticipantCountFromDb 오류:", error);
    return null;
  }
};
