import { NextRequest, NextResponse } from "next/server";
import { getFCMAccessToken } from "@/lib/fcm-token";

export const runtime = "edge";

// Firebase Cloud Messaging REST API를 직접 호출 (Edge Runtime 호환)
async function sendFCMNotification(message: any) {
  const projectId = process.env.PROJECT_ID;

  if (!projectId) {
    throw new Error("FCM configuration missing: PROJECT_ID");
  }

  // FCM_ACCESS_TOKEN이 환경 변수에 있으면 사용, 없으면 자동 생성
  let accessToken = process.env.FCM_ACCESS_TOKEN;

  if (!accessToken) {
    // CLIENT_EMAIL과 PRIVATE_KEY로 자동 생성
    try {
      accessToken = await getFCMAccessToken();
    } catch (error) {
      throw new Error(
        `Failed to get FCM access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FCM API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

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

    const response = await sendFCMNotification(message);

    return NextResponse.json({
      success: true,
      messageId: response.name || response,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("FCM Error:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
