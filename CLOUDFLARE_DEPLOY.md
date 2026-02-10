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
   - **Framework preset**: Next.js (자동 감지됨)
   - **Build command**: `npm run build` 또는 `yarn build`
   - **Build output directory**: `.next` ⚠️ **중요**: `.next` 디렉토리로 설정해야 합니다
   - **Root directory**: `/` (프로젝트 루트)

   **⚠️ 주의사항:**
   - Next.js 16에서 API Routes를 사용하는 경우, Cloudflare Pages가 자동으로 Edge Functions로 변환합니다
   - 빌드 출력 디렉토리는 반드시 `.next`로 설정해야 합니다
   - 빌드 후 `.next` 디렉토리의 내용이 Cloudflare Pages에 배포됩니다

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

# Firebase Cloud Messaging (FCM) REST API
PROJECT_ID=your-firebase-project-id
FCM_ACCESS_TOKEN=your-google-oauth-access-token
# 참고: Access Token은 만료되므로, 서비스 계정 키로 JWT를 생성하여 주기적으로 갱신해야 합니다

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
- **Build output directory**: `.next` ⚠️ **중요**: `.next` 디렉토리로 설정해야 합니다
  - Next.js는 빌드 후 `.next` 디렉토리에 출력을 생성합니다
  - Cloudflare Pages는 이 디렉토리의 내용을 배포합니다

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

## 8. Worker 크기 제한 문제

### 문제: Worker exceeded the size limit of 3 MiB

Cloudflare Pages 무료 플랜은 Worker 크기 제한이 3MB입니다. Next.js 앱이 크면 이 제한을 초과할 수 있습니다.

### 해결 방법

1. **Cloudflare Pages 유료 플랜으로 업그레이드** (권장)
   - 유료 플랜은 Worker 크기 제한이 10MB입니다
   - 가장 간단하고 빠른 해결책입니다
   - [Cloudflare Pages 플랜](https://dash.cloudflare.com/workers/plans)

2. **코드 최적화**
   - 불필요한 의존성 제거 (예: moment-timezone → date-fns)
   - 동적 import 사용 (클라이언트 컴포넌트로 분리)
   - 코드 스플리팅

3. **기능 분리**
   - 일부 기능을 별도 서비스로 분리
   - 큰 컴포넌트를 클라이언트 사이드로 이동

## 9. 트러블슈팅

### 화면이 로딩되지 않는 경우 (404 에러)

1. **빌드 출력 디렉토리 확인** (가장 흔한 원인)
   - Cloudflare Pages Dashboard → 프로젝트 → Settings → Builds & deployments
   - **Build output directory**를 `.next`로 설정
   - ⚠️ 이전에 비워두었거나 다른 값으로 설정했다면 `.next`로 변경하세요

2. **브라우저 콘솔 확인**
   - 개발자 도구(F12) → Console 탭에서 에러 메시지 확인
   - Network 탭에서 실패한 요청 확인

3. **환경 변수 확인**
   - Dashboard → Settings → Environment variables
   - 필수 환경 변수가 모두 설정되었는지 확인
   - 특히 `NEXT_PUBLIC_` 접두사가 있는 변수들이 제대로 설정되었는지 확인

4. **빌드 로그 확인**
   - Dashboard → Deployments → 최신 배포 → Build logs
   - 빌드 중 에러가 있는지 확인

5. **캐시 문제**
   - 브라우저 캐시 삭제 (Ctrl+Shift+Delete 또는 Cmd+Shift+Delete)
   - Cloudflare Pages의 캐시 삭제 (Dashboard → 프로젝트 → Settings → Clear cache)

6. **SSL/TLS 설정 확인**
   - Cloudflare Dashboard → SSL/TLS
   - 암호화 모드를 "전체" 또는 "전체(엄격)"으로 설정

### 빌드 실패

- Node.js 버전 확인 (20.x 권장)
- 환경 변수 누락 확인
- 빌드 로그 확인

### API Routes 작동 안 함

- Cloudflare Pages는 Next.js API Routes를 자동으로 지원합니다
- API Routes가 작동하지 않으면 빌드 로그에서 에러 확인
- Edge Runtime을 사용하는 경우 추가 설정이 필요할 수 있습니다

### 환경 변수 문제

- Dashboard에서 환경 변수가 제대로 설정되었는지 확인
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
- 서버 전용 변수는 `NEXT_PUBLIC_` 접두사 없이 설정
- 환경 변수 변경 후 재배포 필요

## 9. 추가 리소스

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Pages 환경 변수](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
