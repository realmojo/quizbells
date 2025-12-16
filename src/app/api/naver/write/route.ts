import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessToken, clubId, menuId, subject, content } =
      await request.json();

    if (!accessToken || !clubId || !menuId || !subject || !content) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 네이버 카페 글쓰기 API URL
    // 이미지 첨부가 필요하면 multipart/form-data 처리가 필요하지만, 여기서는 텍스트/HTML 글쓰기만 구현합니다.
    const apiURL = `https://openapi.naver.com/v1/cafe/${clubId}/menu/${menuId}/articles`;

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      // 네이버 API는 x-www-form-urlencoded 또는 multipart/form-data를 요구할 수 있음.
      // v1 API 문서를 기준으로 form-urlencoded 전송
      body: new URLSearchParams({
        subject: subject,
        content: content,
      }).toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Naver Write Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
