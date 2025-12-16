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

    // 네이버 공식 문서/예제에 따라 직접 인코딩 후 쿼리 스트링 생성
    // URLSearchParams는 내부적으로 인코딩을 수행하지만, 네이버 API 호환성을 위해 직접 처리
    const encodedSubject = encodeURIComponent(subject);
    const encodedContent = encodeURIComponent(content);
    const bodyString = `subject=${encodedSubject}&content=${encodedContent}`;

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyString,
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
