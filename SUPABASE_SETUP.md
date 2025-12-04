# Supabase 이메일 구독 시스템 설정 가이드

이 가이드는 Supabase를 사용하여 이메일 구독 시스템을 설정하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정 생성
2. 새 프로젝트 생성
3. 프로젝트 설정에서 다음 정보 확인:
   - Project URL (예: `https://xxxxx.supabase.co`)
   - Anon/Public Key
   - Service Role Key (서버 사이드에서만 사용)

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor** 열기
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. 또는 다음 SQL을 직접 실행:

```sql
-- 이메일 구독자 테이블
CREATE TABLE IF NOT EXISTS quizbells_email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이메일 발송 로그 테이블
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quizbells_email_subscribers_email ON quizbells_email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_quizbells_email_subscribers_status ON quizbells_email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
```

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 추가합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 이메일 발송 API 키 (선택사항, 이메일 발송 기능 사용 시)
EMAIL_API_KEY=your-secure-api-key-here
```

### 환경 변수 위치:
- **NEXT_PUBLIC_SUPABASE_URL**: Supabase 프로젝트 URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase Anon/Public Key (클라이언트에서 사용)
- **SUPABASE_SERVICE_ROLE_KEY**: Supabase Service Role Key (서버에서만 사용, 절대 클라이언트에 노출 금지)
- **EMAIL_API_KEY**: 이메일 발송 API를 보호하기 위한 키 (선택사항)

## 4. 기능 설명

### 이메일 구독 (`/api/email/subscribe`)
- 사용자가 이메일을 입력하여 구독
- 중복 이메일 체크
- 이메일 유효성 검사
- Supabase에 저장

### 이메일 발송 (`/api/email/send`)
- 관리자가 구독자들에게 이메일 발송
- API 키로 인증 필요
- 발송 로그 저장

**사용 예시:**
```bash
curl -X POST https://your-domain.com/api/email/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secure-api-key" \
  -d '{
    "subject": "새로운 퀴즈 정답이 나왔어요!",
    "content": "<h1>오늘의 퀴즈 정답</h1><p>내용...</p>"
  }'
```

## 5. 이메일 발송 서비스 연동 (선택사항)

실제 이메일을 발송하려면 다음 서비스 중 하나를 연동해야 합니다:

### 옵션 1: Resend
```bash
npm install resend
```

### 옵션 2: SendGrid
```bash
npm install @sendgrid/mail
```

### 옵션 3: AWS SES
```bash
npm install @aws-sdk/client-ses
```

### 옵션 4: Supabase Edge Functions
Supabase Edge Functions를 사용하여 이메일 발송 로직을 구현할 수 있습니다.

## 6. UI 컴포넌트

`EmailSubscribe` 컴포넌트가 Footer에 자동으로 추가되어 있습니다. 필요에 따라 다른 페이지에도 추가할 수 있습니다:

```tsx
import EmailSubscribe from "@/components/EmailSubscribe";

<EmailSubscribe
  title="커스텀 제목"
  description="커스텀 설명"
  placeholder="이메일 입력"
  buttonText="구독하기"
/>
```

## 7. 보안 고려사항

1. **Service Role Key**: 절대 클라이언트 코드에 노출하지 마세요
2. **API Key**: 이메일 발송 API는 반드시 API 키로 보호하세요
3. **Rate Limiting**: 이메일 구독 API에 Rate Limiting을 추가하는 것을 권장합니다
4. **이메일 검증**: 실제 이메일 발송 전에 이메일 인증을 추가하는 것을 권장합니다

## 8. 문제 해결

### "Supabase 설정이 완료되지 않았습니다" 오류
- 환경 변수가 올바르게 설정되었는지 확인
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- Next.js 서버를 재시작

### "이미 구독 중인 이메일입니다" 오류
- 정상 동작입니다. 중복 구독을 방지하는 기능입니다.

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성화되어 있는지 확인
- 네트워크 연결 확인
- Supabase 대시보드에서 프로젝트 상태 확인

