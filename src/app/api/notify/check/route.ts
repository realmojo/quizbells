import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// firebase-admin은 Node.js 전용이므로 Edge Runtime을 사용할 수 없습니다
// export const runtime = 'edge'; // 제거 - Node.js Runtime 사용

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const res = await req.json();
    const { token } = res;
    const message = {
      token,
      data: {
        check: "validity",
        silent: "true",
      },
    };
    const response = await messaging.send(message);
    return NextResponse.json({ success: true, messageId: response });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
