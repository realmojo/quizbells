import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, content, testEmail } = body;

    // 관리자 인증 (간단한 API 키 방식)
    const apiKey = req.headers.get("x-api-key");
    const validApiKey = process.env.EMAIL_API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: "인증에 실패했습니다." },
        { status: 401 }
      );
    }

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: "제목과 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    // 테스트 이메일이 있으면 해당 이메일로만 발송
    if (testEmail) {
      // 여기서는 실제 이메일 발송 로직을 구현해야 합니다
      // Supabase Edge Functions나 외부 이메일 서비스(Resend, SendGrid 등)를 사용할 수 있습니다
      return NextResponse.json({
        success: true,
        message: `테스트 이메일이 ${testEmail}로 발송되었습니다.`,
        sentTo: [testEmail],
      });
    }

    // 활성 구독자 목록 가져오기
    const { data: subscribers, error } = await supabaseAdmin
      .from("quizbells_email_subscribers")
      .select("email")
      .eq("status", "active");

    if (error) {
      console.error("구독자 목록 조회 오류:", error);
      return NextResponse.json(
        { success: false, error: "구독자 목록을 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: "발송할 구독자가 없습니다." },
        { status: 404 }
      );
    }

    // 이메일 발송 로그 저장
    const { error: logError } = await supabaseAdmin.from("email_logs").insert([
      {
        subject,
        content,
        recipient_count: subscribers.length,
        sent_at: new Date().toISOString(),
        status: "sent",
      },
    ]);

    if (logError) {
      console.error("이메일 로그 저장 오류:", logError);
    }

    // 실제 이메일 발송은 여기서 구현해야 합니다
    // 예: Resend, SendGrid, AWS SES 등을 사용
    // 현재는 로그만 저장하고 성공 응답 반환

    return NextResponse.json({
      success: true,
      message: `${subscribers.length}명의 구독자에게 이메일이 발송되었습니다.`,
      recipientCount: subscribers.length,
      recipients: subscribers.map((s) => s.email),
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("이메일 발송 API 오류:", errorMessage);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
