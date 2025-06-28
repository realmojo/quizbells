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
