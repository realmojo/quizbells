import { NextResponse } from "next/server";
import { saveNaverTokens } from "@/lib/naver-cafe";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { code, state } = await request.json();

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "환경 변수(CLIENT_ID, CLIENT_SECRET)가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`;

    const response = await fetch(tokenUrl);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(data, { status: 400 });
    }

    // 무인 자동 발행을 위해 refresh_token을 Supabase에 저장(부트스트랩).
    // 최초 1회 관리자가 네이버 로그인하면 이후 cron이 토큰을 자동 갱신해 사용한다.
    if (data.refresh_token) {
      try {
        await saveNaverTokens(data);
      } catch (e) {
        console.error("refresh_token 저장 실패:", e);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Token Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
