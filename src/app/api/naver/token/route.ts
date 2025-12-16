import { NextResponse } from "next/server";

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

    console.log("Token Data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Token Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
