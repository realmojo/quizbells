import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // 이메일 유효성 검사
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    // 이메일 중복 확인
    const { data: existingEmail, error: checkError } = await supabaseAdmin
      .from("quizbells_email_subscribers")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러이므로 중복이 아닌 경우
      console.error("이메일 확인 중 오류:", checkError);
    }

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "이미 구독 중인 이메일입니다." },
        { status: 409 }
      );
    }

    // 이메일 저장
    const { data, error } = await supabaseAdmin
      .from("quizbells_email_subscribers")
      .insert([
        {
          email: email.toLowerCase().trim(),
          subscribed_at: new Date().toISOString(),
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("이메일 저장 오류:", error);
      return NextResponse.json(
        { success: false, error: "이메일 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "이메일이 성공적으로 등록되었습니다.",
      data,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("이메일 구독 API 오류:", errorMessage);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

