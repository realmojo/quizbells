# Cloudflare Pages 배포 가이드

이 프로젝트를 Cloudflare Pages로 배포하는 방법입니다.

## 1. 사전 준비

1. [Cloudflare 계정](https://dash.cloudflare.com/) 생성
2. [Cloudflare Pages](https://pages.cloudflare.com/) 접속
3. GitHub/GitLab/Bitbucket 저장소 연결

## 2. Cloudflare Pages 프로젝트 생성

1. Cloudflare Dashboard → Pages → "Create a project" 클릭
2. Git 저장소 연결
3. 빌드 설정 입력:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build` 또는 `yarn build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (프로젝트 루트)

## 3. 환경 변수 설정

Cloudflare Pages Dashboard → 프로젝트 → Settings → Environment variables에서 다음 환경 변수를 설정하세요:

### 필수 환경 변수

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Base URL (프로덕션 도메인)
NEXT_PUBLIC_BASE_URL=https://quizbells.com

# 네이버 API (사용하는 경우)
NEXT_PUBLIC_NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# Firebase (사용하는 경우)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_VAPID_KEY=your-vapid-key

# 기타
NEXT_PUBLIC_STATS_PASSWORD=your-stats-password
EMAIL_API_KEY=your-email-api-key
```

### 환경별 설정

- **Production**: 프로덕션 환경 변수
- **Preview**: 프리뷰 환경 변수 (선택사항)

## 4. 빌드 설정

Cloudflare Pages는 자동으로 Next.js를 감지하지만, 필요시 수동 설정:

- **Node.js version**: 20.x (권장)
- **Build command**: `npm run build` 또는 `yarn build`
- **Build output directory**: `.next`

## 5. 커스텀 도메인 설정

1. Cloudflare Pages Dashboard → 프로젝트 → Custom domains
2. "Set up a custom domain" 클릭
3. 도메인 입력 (예: `quizbells.com`)
4. DNS 설정 안내에 따라 DNS 레코드 추가

## 6. Vercel과의 차이점

### 주의사항

1. **Edge Functions**: Cloudflare Pages는 Edge Functions를 지원하지만, Vercel의 Serverless Functions와는 다릅니다.
2. **환경 변수**: Cloudflare Pages에서는 환경 변수를 Dashboard에서 설정해야 합니다.
3. **빌드 시간**: Cloudflare Pages는 빌드 시간 제한이 있습니다 (무료 플랜: 20분).
4. **이미지 최적화**: Next.js Image 최적화는 Cloudflare Pages에서도 작동합니다.

### API Routes

- Cloudflare Pages는 Next.js API Routes를 지원합니다.
- Edge Runtime을 사용하는 경우 추가 설정이 필요할 수 있습니다.

## 7. 배포 확인

배포 후 다음을 확인하세요:

1. 홈페이지가 정상적으로 로드되는지
2. API Routes가 작동하는지 (`/api/*`)
3. 환경 변수가 제대로 설정되었는지
4. 이미지가 정상적으로 로드되는지

## 8. 트러블슈팅

### 빌드 실패

- Node.js 버전 확인 (20.x 권장)
- 환경 변수 누락 확인
- 빌드 로그 확인

### API Routes 작동 안 함

- `next.config.ts`의 `output: "standalone"` 설정 확인
- Cloudflare Pages의 Functions 설정 확인

### 환경 변수 문제

- Dashboard에서 환경 변수가 제대로 설정되었는지 확인
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
- 서버 전용 변수는 `NEXT_PUBLIC_` 접두사 없이 설정

## 9. 추가 리소스

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Pages 환경 변수](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)

