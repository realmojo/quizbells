-- 네이버 카페 자동 발행 기능용 스키마
-- (Supabase 원격 프로젝트에는 마이그레이션 naver_cafe_auto_publish 로 이미 적용됨)

-- 네이버 OAuth 토큰 저장 (단일 행, 무인 발행을 위한 refresh token 보관)
create table if not exists naver_oauth_tokens (
  id text primary key default 'default',
  access_token text,
  refresh_token text not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 자동 발행 로그 (퀴즈 타입/날짜별 1회만 발행하도록 중복 방지)
create table if not exists naver_cafe_publish_log (
  id uuid primary key default gen_random_uuid(),
  club_id text not null,
  menu_id text not null,
  quiz_type text not null,
  answer_date text not null,
  article_id text,
  article_url text,
  status text not null default 'ok',
  created_at timestamptz not null default now()
);

create unique index if not exists naver_cafe_publish_log_unique
  on naver_cafe_publish_log (club_id, menu_id, quiz_type, answer_date);

-- 두 테이블 모두 서버(service_role)에서만 접근. RLS 활성화 + 정책 없음 =
-- anon/authenticated 차단, service_role는 RLS를 우회하므로 정상 동작.
alter table naver_oauth_tokens enable row level security;
alter table naver_cafe_publish_log enable row level security;
