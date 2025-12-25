/**
 * 퀴즈 방문 기록 관리 유틸리티
 * 로컬스토리지를 사용하여 사용자가 자주 보는 퀴즈를 추적
 */

const VISIT_HISTORY_KEY = "quizbells_visit_history";

export interface VisitRecord {
  type: string;
  count: number;
  lastVisit: string; // ISO date string
}

export interface VisitHistory {
  [type: string]: VisitRecord;
}

/**
 * 방문 기록 저장
 */
export function recordVisit(type: string): void {
  if (typeof window === "undefined") return;

  try {
    const history = getVisitHistory();
    const now = new Date().toISOString();

    if (history[type]) {
      // 기존 기록이 있으면 카운트 증가 및 마지막 방문 시간 업데이트
      history[type] = {
        type,
        count: history[type].count + 1,
        lastVisit: now,
      };
    } else {
      // 새로운 기록 생성
      history[type] = {
        type,
        count: 1,
        lastVisit: now,
      };
    }

    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("방문 기록 저장 실패:", error);
  }
}

/**
 * 방문 기록 조회
 */
export function getVisitHistory(): VisitHistory {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(VISIT_HISTORY_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as VisitHistory;
  } catch (error) {
    console.error("방문 기록 조회 실패:", error);
    return {};
  }
}

/**
 * 특정 타입의 방문 기록 조회
 */
export function getVisitRecord(type: string): VisitRecord | null {
  const history = getVisitHistory();
  return history[type] || null;
}

/**
 * 방문 기록 초기화
 */
export function clearVisitHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(VISIT_HISTORY_KEY);
  } catch (error) {
    console.error("방문 기록 초기화 실패:", error);
  }
}

/**
 * 퀴즈 목록을 방문 기록 기반으로 정렬
 * 자주 방문한 퀴즈를 앞으로, 방문 기록이 없는 퀴즈는 뒤로
 */
export function sortQuizzesByVisitHistory<T extends { type: string }>(
  quizzes: T[]
): T[] {
  const history = getVisitHistory();

  return [...quizzes].sort((a, b) => {
    const recordA = history[a.type];
    const recordB = history[b.type];

    // 둘 다 방문 기록이 없는 경우 원래 순서 유지
    if (!recordA && !recordB) return 0;

    // A만 방문 기록이 있으면 A를 앞으로
    if (recordA && !recordB) return -1;

    // B만 방문 기록이 있으면 B를 앞으로
    if (!recordA && recordB) return 1;

    // 둘 다 방문 기록이 있는 경우
    if (recordA && recordB) {
      // 1순위: 방문 횟수 (많을수록 앞으로)
      if (recordA.count !== recordB.count) {
        return recordB.count - recordA.count;
      }

      // 2순위: 최근 방문 시간 (최근일수록 앞으로)
      const dateA = new Date(recordA.lastVisit).getTime();
      const dateB = new Date(recordB.lastVisit).getTime();
      return dateB - dateA;
    }

    return 0;
  });
}
