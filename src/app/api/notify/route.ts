import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// Firebase Cloud Messaging REST API를 직접 호출 (Edge Runtime 호환)
async function sendFCMNotification(message: any) {
  const projectId = process.env.PROJECT_ID;
  const accessToken = process.env.FCM_ACCESS_TOKEN; // 서비스 계정 Access Token
  
  if (!projectId || !accessToken) {
    throw new Error("FCM configuration missing: PROJECT_ID or FCM_ACCESS_TOKEN");
  }

  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
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
    const reqItems = await req.json();
    const { token, title, body, link, icon } = reqItems;
    
    const message = {
      token,
      notification: {
        title,
        body,
        image: icon || "https://quizbells.com/icons/android-icon-48x48.png",
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
            alert: {
              title: title,
              body: body,
            },
            sound: "default",
            badge: 1,
          },
        },
        fcm_options: {
          image: icon || "https://quizbells.com/icons/android-icon-48x48.png",
        },
      },
      data: {
        title,
        body,
        link: link || "https://quizbells.com",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        notification: {
          title,
          body,
          image: icon || "https://quizbells.com/icons/android-icon-48x48.png",
        },
      },
      webpush: {
        fcm_options: {
          link: link || "https://quizbells.com",
        },
      },
    };

    const response = await sendFCMNotification(message);
    
    return NextResponse.json({ 
      success: true, 
      messageId: response.name || response 
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("FCM Error:", errorMessage);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}
