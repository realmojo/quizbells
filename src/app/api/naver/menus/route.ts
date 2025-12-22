import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get("clubId");

  if (!clubId) {
    return NextResponse.json({ error: "clubId is required" }, { status: 400 });
  }

  try {
    const apiURL = `https://apis.naver.com/cafe-web/cafe-cafemain-api/v1.0/cafes/${clubId}/menus`;

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "x-cafe-product": "pc",
        // 필요하다면 User-Agent 등을 추가할 수 있음
      },
    });

    if (!response.ok) {
      console.error(`Naver API Error: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch menus" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
