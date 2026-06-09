import { supabaseAdmin } from "@/lib/supabase";

// 네이버 카페 자동 발행에 필요한 OAuth 토큰 관리 + 글쓰기 공통 로직.
// access_token은 약 1시간, refresh_token은 약 1년 유효하며 갱신 시 회전될 수 있다.
// refresh_token은 Supabase(naver_oauth_tokens)에 보관한다.

const TOKEN_ROW_ID = "default";
// access_token 만료 60초 전이면 미리 갱신
const EXPIRY_BUFFER_MS = 60 * 1000;

export interface NaverTokenResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: string | number;
  error?: string;
  error_description?: string;
}

interface StoredToken {
  access_token: string | null;
  refresh_token: string;
  expires_at: string | null;
}

/**
 * OAuth 응답을 Supabase에 저장(upsert)한다. refresh_token이 응답에 없으면
 * 기존 값을 유지한다(네이버는 갱신 시 refresh_token을 생략할 수 있음).
 */
export async function saveNaverTokens(
  data: NaverTokenResponse,
  fallbackRefreshToken?: string,
): Promise<void> {
  if (!supabaseAdmin) throw new Error("Supabase 설정이 완료되지 않았습니다.");

  const refreshToken = data.refresh_token || fallbackRefreshToken;
  if (!refreshToken) {
    throw new Error("refresh_token이 없어 토큰을 저장할 수 없습니다.");
  }

  const expiresInSec = data.expires_in ? Number(data.expires_in) : 3600;
  const expiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();

  await supabaseAdmin.from("naver_oauth_tokens").upsert(
    {
      id: TOKEN_ROW_ID,
      access_token: data.access_token ?? null,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("NAVER_CLIENT_ID/NAVER_CLIENT_SECRET가 설정되지 않았습니다.");
  }

  const url =
    `https://nid.naver.com/oauth2.0/token?grant_type=refresh_token` +
    `&client_id=${clientId}&client_secret=${clientSecret}` +
    `&refresh_token=${encodeURIComponent(refreshToken)}`;

  const res = await fetch(url);
  const data: NaverTokenResponse = await res.json();

  if (!data.access_token) {
    throw new Error(
      `access_token 갱신 실패: ${data.error_description || data.error || "unknown"}`,
    );
  }

  // 회전된 refresh_token이 오면 갱신, 없으면 기존 값 유지
  await saveNaverTokens(data, refreshToken);
  return data.access_token;
}

/**
 * 유효한 access_token을 반환한다. 저장된 토큰이 만료됐으면 refresh_token으로
 * 자동 갱신한다. 저장된 토큰이 없으면 null(최초 1회 수동 로그인 필요).
 */
export async function getValidNaverAccessToken(): Promise<string | null> {
  if (!supabaseAdmin) throw new Error("Supabase 설정이 완료되지 않았습니다.");

  const { data, error } = await supabaseAdmin
    .from("naver_oauth_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("id", TOKEN_ROW_ID)
    .maybeSingle<StoredToken>();

  if (error) throw new Error(`토큰 조회 실패: ${error.message}`);
  if (!data?.refresh_token) return null;

  const expiresAtMs = data.expires_at ? Date.parse(data.expires_at) : 0;
  const stillValid =
    data.access_token && expiresAtMs - EXPIRY_BUFFER_MS > Date.now();

  if (stillValid) return data.access_token;
  return refreshAccessToken(data.refresh_token);
}

/**
 * 네이버 카페에 글을 작성한다. 성공 시 articleId를 반환한다.
 */
export async function postCafeArticle(params: {
  accessToken: string;
  clubId: string;
  menuId: string;
  subject: string;
  content: string;
}): Promise<{ articleId?: string; raw: any }> {
  const { accessToken, clubId, menuId, subject, content } = params;
  const apiURL = `https://openapi.naver.com/v1/cafe/${clubId}/menu/${menuId}/articles`;

  const htmlContent = content.replace(/\n/g, "<br>");
  const formData = new FormData();
  formData.append("subject", encodeURI(subject));
  formData.append("content", encodeURI(htmlContent));

  const res = await fetch(apiURL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  const raw = await res.json();
  if (!res.ok) {
    throw new Error(
      `카페 글쓰기 실패(${res.status}): ${JSON.stringify(raw?.message ?? raw)}`,
    );
  }

  // 네이버 응답: { message: { result: { articleId, ... } } }
  const articleId =
    raw?.message?.result?.articleId != null
      ? String(raw.message.result.articleId)
      : undefined;
  return { articleId, raw };
}

export interface QuizAnswerItem {
  question?: string;
  answer?: string;
  otherAnswers?: string[];
}

/**
 * 퀴즈 정답 contents로 카페 글 제목/본문을 생성한다.
 * naver-cafe 수동 발행 페이지와 동일한 포맷을 유지한다.
 */
export function buildQuizCafeContent(args: {
  quizName: string;
  quizType: string;
  dateLabel: string;
  contents: QuizAnswerItem[];
}): { subject: string; content: string } {
  const { quizName, quizType, dateLabel, contents } = args;

  let body = `안녕하세요~ ${dateLabel} ${quizName} 정답 공유합니다! ^^\n\n`;

  const seen: string[] = [];
  for (const q of contents) {
    if (!q.answer || seen.includes(q.answer)) continue;
    seen.push(q.answer);
    body += `Q. ${q.question || "퀴즈 내용"}\n`;
    body += `정답: ${q.answer}\n`;
    if (q.otherAnswers && q.otherAnswers.length > 0) {
      body += `(또 다른 정답: ${q.otherAnswers.join(", ")})\n`;
    }
    body += `\n`;
  }

  body += `모두 포인트 적립하시고 좋은 하루 되세요~\n`;
  body += `https://quizbells.com/quiz/${quizType}/today (퀴즈벨 앱테크 정답 알림)`;

  return {
    subject: `${quizName} 정답 [${dateLabel}]`,
    content: body,
  };
}
