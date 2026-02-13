// ✅ 설정 조회
export const getSettings = async (userId: string): Promise<any | null> => {
  const res = await fetch(`/api/users?userId=${userId}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 설정 업데이트
export const updateSettings = async (
  userId: string,
  params: any,
): Promise<any | null> => {
  const res = await fetch(`/api/users?userId=${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 퀴즈벨 정답 조회
export const getQuizbells = async (
  type: string,
  answerDate: string,
): Promise<any | null> => {
  try {
    // 클라이언트에서는 상대 경로 사용, 서버에서는 절대 경로 사용
    const isClient = typeof window !== "undefined";
    const baseUrl = isClient
      ? ""
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
    const url = `${baseUrl}/api/quizbells?type=${type}&answerDate=${answerDate}`;

    const res = await fetch(url, {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    });

    if (!res.ok) {
      console.error(`API 호출 실패1: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    return data?.contents?.length ? data : null;
  } catch (error) {
    console.error("getQuizbells 오류:", error);
    return null;
  }
};

// ✅ 오늘 날짜의 모든 퀴즈 타입 정답 조회 (한 번에)
export const getTodayQuizbells = async (
  answerDate: string,
  isNew: boolean = false,
): Promise<Record<string, any> | Record<string, boolean>> => {
  try {
    // 클라이언트에서는 상대 경로 사용, 서버에서는 절대 경로 사용
    const isClient = typeof window !== "undefined";
    const baseUrl = isClient
      ? ""
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
    const url = `${baseUrl}/api/quizbells/today?answerDate=${answerDate}${isNew ? "&isNew=true" : ""}`;

    const res = await fetch(url, {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    });

    if (!res.ok) {
      console.error(`API 호출 실패2: ${res.status} ${res.statusText}`);
      return {};
    }

    const data = await res.json();

    return data || {};
  } catch (error) {
    console.error("getTodayQuizbells 오류:", error);
    return {};
  }
};

// ✅ 게시글 목록 조회 (offset 기반)
export const getPostsList = async (
  offset: number = 0,
  limit: number = 5,
  category: string = "",
): Promise<any | null> => {
  const query = new URLSearchParams({
    category,
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/post/list?${query.toString()}`);

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 단일 게시글 조회
export const getPost = async (id: string): Promise<any | null> => {
  if (!id) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

  const res = await fetch(`${baseUrl}/api/post?id=${id}`);

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 주간 퀴즈벨 정답 조회 (최근 7일)
export const getWeeklyQuizbells = async (
  type: string,
  baseDate?: string,
): Promise<any | null> => {
  try {
    const isClient = typeof window !== "undefined";
    const baseUrl = isClient
      ? ""
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
    const url = `${baseUrl}/api/quizbells/weekly?type=${type}${baseDate ? `&baseDate=${baseDate}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`API 호출 실패3: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data?.success ? data : null;
  } catch (error) {
    console.error("getWeeklyQuizbells 오류:", error);
    return null;
  }
};

// ✅ 월간 퀴즈벨 정답 조회 (이번 달)
export const getMonthlyQuizbells = async (
  type: string,
  baseDate?: string,
): Promise<any | null> => {
  try {
    const isClient = typeof window !== "undefined";
    const baseUrl = isClient
      ? ""
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
    const url = `${baseUrl}/api/quizbells/monthly?type=${type}${baseDate ? `&baseDate=${baseDate}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`API 호출 실패4: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    return data?.success ? data : null;
  } catch (error) {
    console.error("getMonthlyQuizbells 오류:", error);
    return null;
  }
};
