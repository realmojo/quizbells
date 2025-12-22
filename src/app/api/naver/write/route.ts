import { NextResponse } from "next/server";

export const runtime = 'edge';

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

    // FormData 사용 (multipart/form-data)
    // 인코딩 이슈 없이 한글을 가장 안전하게 보내는 방법
    const formData = new FormData();
    // 네이버 카페 API는 HTML을 지원하므로 줄바꿈(\n)을 <br>로 변환해야 함
    const htmlContent = content.replace(/\n/g, "<br>");

    formData.append("subject", encodeURI(subject));
    formData.append("content", encodeURI(htmlContent));

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type 헤더는 제거 (fetch가 boundary 포함하여 자동 설정)
      },
      body: formData,
    });
    //   https://quizbells.com/naver-cafe?code=jAFdXMunqSnJUlrjnc&state=sm0q06z6ca
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
