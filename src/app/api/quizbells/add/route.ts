import { NextRequest, NextResponse } from "next/server";

// ✅ 퀴즈벨 정답 등록
// const query = `INSERT INTO quizbells (type, contents, answerDate) VALUES ('${type}', '${contents}', '${answerDate}')`;
export async function POST(req: NextRequest) {
  try {
    const API_URL =
      process.env.API_URL || "http://api.mindpang.com/api/quizbells";

    // Request body에서 JSON 데이터 받기
    const body = await req.json();
    const { type, answerDate, contents } = body;

    // 외부 API에 JSON body로 전송
    const url = `${API_URL}/itemAdd.php`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        contents,
        answerDate,
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
