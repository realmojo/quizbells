import { PostgrestClient } from "@supabase/postgrest-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요."
  );
}

// 이 앱은 Supabase의 PostgREST(테이블 쿼리/RPC)만 사용하며 auth·realtime·storage
// 기능은 쓰지 않는다. 무거운 @supabase/supabase-js(realtime 웹소켓 등 포함)를
// 통째로 번들하면 Edge 함수마다 ~190KB가 추가되어 Pages Functions 25MiB 한도를
// 초과하므로, 경량 @supabase/postgrest-js만 사용한다. 쿼리 API(.from().select()
// .insert().eq().order().single().rpc() 등)는 동일하다.
const REST_URL = `${supabaseUrl}/rest/v1`;

const createRestClient = (key: string) =>
  new PostgrestClient(REST_URL, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    schema: "public",
  });

// 클라이언트 사이드용 (anon 키). 현재 직접 사용처는 없으나 호환을 위해 유지.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createRestClient(supabaseAnonKey) : null;

// 서버 사이드용 (service_role 키 사용 — RLS 우회)
export const supabaseAdmin = supabaseServiceKey
  ? createRestClient(supabaseServiceKey)
  : null;
