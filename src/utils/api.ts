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
  params: any
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
  answerDate: string
): Promise<any | null> => {
  const res = await fetch(
    `/api/quizbells?type=${type}&answerDate=${answerDate}`,
    {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 게시글 목록 조회 (offset 기반)
export const getPostsList = async (
  offset: number = 0,
  limit: number = 5,
  type: string = ""
): Promise<any | null> => {
  const query = new URLSearchParams({
    type,
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/post/list?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// ✅ 단일 게시글 조회
export const getPost = async (id: string): Promise<any | null> => {
  if (!id) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

  const res = await fetch(`${baseUrl}/api/post?id=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
