# API 문서 - api.mindpang.com

이 문서는 `https://api.mindpang.com/api/quizbells`를 사용하는 모든 API 엔드포인트를 정리합니다.

## 기본 URL

```
https://api.mindpang.com/api/quizbells
```

환경 변수 `API_URL`이 설정되어 있으면 해당 값을 사용하며, 없으면 기본값으로 위 URL을 사용합니다.

---

## 1. 퀴즈 정답 조회

**Next.js Route:** `/api/quizbells`  
**외부 API:** `GET /item.php`

### 요청
```
GET /api/quizbells?type={type}&answerDate={answerDate}
```

### 파라미터
- `type` (required): 퀴즈 타입 (예: `toss`, `cashwalk`, `shinhan` 등)
- `answerDate` (required): 날짜 (예: `2025-01-15`)

### 예시
```bash
GET /api/quizbells?type=shinhan&answerDate=2025-01-15
```

### 응답
```json
{
  "id": 123,
  "type": "shinhan",
  "contents": "[{\"question\":\"...\",\"answer\":\"O\"}]",
  "answerDate": "2025-01-15"
}
```

---

## 2. 퀴즈 정답 등록

**Next.js Route:** `/api/quizbells/add`  
**외부 API:** `POST /itemAdd.php`

### 요청
```
POST /api/quizbells/add
Content-Type: application/json
```

### Body
```json
{
  "type": "shinhan",
  "answerDate": "2025-01-15",
  "contents": "[{\"type\":\"신한쏠페이\",\"question\":\"질문\",\"answer\":\"O\"}]"
}
```

### 예시
```bash
curl -X POST https://quizbells.com/api/quizbells/add \
  -H "Content-Type: application/json" \
  -d '{
    "type": "shinhan",
    "answerDate": "2025-01-15",
    "contents": "[{\"type\":\"신한쏠페이\",\"question\":\"질문\",\"answer\":\"O\"}]"
  }'
```

### 응답
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 3. 퀴즈 정답 수정

**Next.js Route:** `/api/quizbells/update`  
**외부 API:** `POST /itemUpdate.php`

### 요청
```
POST /api/quizbells/update
Content-Type: application/json
```

### Body
```json
{
  "id": 123,
  "contents": "[{\"type\":\"신한쏠페이\",\"question\":\"수정된 질문\",\"answer\":\"X\"}]"
}
```

### 예시
```bash
curl -X POST https://quizbells.com/api/quizbells/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "contents": "[{\"type\":\"신한쏠페이\",\"question\":\"수정된 질문\",\"answer\":\"X\"}]"
  }'
```

### 응답
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 4. 사용자 정보 조회

**Next.js Route:** `/api/users`  
**외부 API:** `GET /user.php`

### 요청
```
GET /api/users?userId={userId}
```

### 파라미터
- `userId` (required): 사용자 ID

### 예시
```bash
GET /api/users?userId=abc123
```

### 응답
```json
{
  "userId": "abc123",
  "isQuizAlarm": true,
  "alarmSettings": { ... }
}
```

---

## 5. 사용자 설정 업데이트

**Next.js Route:** `/api/users`  
**외부 API:** `PATCH /user.php`

### 요청
```
PATCH /api/users?userId={userId}
Content-Type: application/json
```

### Body
```json
{
  "isQuizAlarm": true,
  "alarmSettings": {
    "toss": true,
    "cashwalk": false
  }
}
```

### 예시
```bash
curl -X PATCH https://quizbells.com/api/users?userId=abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "isQuizAlarm": true,
    "alarmSettings": {"toss": true}
  }'
```

### 응답
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 6. FCM 토큰 등록

**Next.js Route:** `/api/token`  
**외부 API:** `POST /token.php`

### 요청
```
POST /api/token
Content-Type: application/json
```

### Body
```json
{
  "userId": "abc123",
  "fcmToken": "fcm_token_here",
  "joinType": "web",
  "ip": "192.168.1.1"
}
```

### 파라미터
- `userId` (required): 사용자 ID
- `fcmToken` (required): FCM 토큰
- `joinType` (optional): 가입 타입 (`web`, `ios`, `android`)
- `ip` (optional): IP 주소 (자동 감지)

### 예시
```bash
curl -X POST https://quizbells.com/api/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123",
    "fcmToken": "fcm_token_here",
    "joinType": "web"
  }'
```

### 응답
```json
{
  "success": true,
  "data": "ok"
}
```

---

## 7. FCM 토큰 갱신

**Next.js Route:** `/api/token`  
**외부 API:** `PATCH /token.php`

### 요청
```
PATCH /api/token
Content-Type: application/json
```

### Body
```json
{
  "userId": "abc123",
  "fcmToken": "new_fcm_token_here",
  "ip": "192.168.1.1"
}
```

### 예시
```bash
curl -X PATCH https://quizbells.com/api/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123",
    "fcmToken": "new_fcm_token_here"
  }'
```

### 응답
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 8. FCM 토큰 삭제

**Next.js Route:** `/api/token`  
**외부 API:** `DELETE /token.php`

### 요청
```
DELETE /api/token?userId={userId}&fcmToken={fcmToken}
```

### 파라미터
- `userId` (optional): 사용자 ID
- `fcmToken` (optional): FCM 토큰
- 최소 하나는 필수

### 예시
```bash
DELETE /api/token?userId=abc123&fcmToken=fcm_token_here
```

### 응답
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 9. 알림 대상 사용자 조회

**Next.js Route:** `/api/users/alarm`  
**외부 API:** `GET /alarmUsers.php`

### 요청
```
GET /api/users/alarm?type={type}
```

### 파라미터
- `type` (required): 퀴즈 타입 (예: `toss`, `cashwalk`, `shinhan` 등)

### 예시
```bash
GET /api/users/alarm?type=shinhan
```

### 응답
```json
[
  {
    "userId": "abc123",
    "fcmToken": "fcm_token_here",
    "isQuizAlarm": true
  },
  ...
]
```

---

## 10. 게시글 단일 조회

**Next.js Route:** `/api/post`  
**외부 API:** `GET /post.php`

### 요청
```
GET /api/post?id={id}
```

### 파라미터
- `id` (required): 게시글 ID

### 예시
```bash
GET /api/post?id=123
```

### 응답
```json
{
  "id": 123,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "regdated": "2025-01-15 10:00:00"
}
```

---

## 11. 게시글 목록 조회

**Next.js Route:** `/api/post/list`  
**외부 API:** `GET /postList.php`

### 요청
```
GET /api/post/list?page={page}&type={type}&limit={limit}&offset={offset}
```

### 파라미터
- `page` (optional, default: 1): 페이지 번호
- `type` (optional, default: ""): 게시글 타입
- `limit` (optional, default: 5): 페이지당 항목 수
- `offset` (optional, default: 0): 오프셋

### 예시
```bash
GET /api/post/list?page=1&type=tips&limit=10&offset=0
```

### 응답
```json
[
  {
    "id": 123,
    "title": "게시글 제목",
    "content": "게시글 내용",
    "regdated": "2025-01-15 10:00:00"
  },
  ...
]
```

---

## 12. 사이트맵 데이터 조회

**Next.js Route:** `/sitemap-post.xml`  
**외부 API:** `GET /sitemap.php`

### 요청
```
GET /sitemap-post.xml
```

### 예시
```bash
GET /sitemap-post.xml
```

### 응답
```json
[
  {
    "id": 123,
    "regdated": "2025-01-15 10:00:00"
  },
  ...
]
```

---

## 요약 테이블

| Next.js Route | HTTP Method | 외부 API | 설명 |
|--------------|-------------|----------|------|
| `/api/quizbells` | GET | `GET /item.php` | 퀴즈 정답 조회 |
| `/api/quizbells/add` | POST | `POST /itemAdd.php` | 퀴즈 정답 등록 |
| `/api/quizbells/update` | POST | `POST /itemUpdate.php` | 퀴즈 정답 수정 |
| `/api/users` | GET | `GET /user.php` | 사용자 정보 조회 |
| `/api/users` | PATCH | `PATCH /user.php` | 사용자 설정 업데이트 |
| `/api/token` | POST | `POST /token.php` | FCM 토큰 등록 |
| `/api/token` | PATCH | `PATCH /token.php` | FCM 토큰 갱신 |
| `/api/token` | DELETE | `DELETE /token.php` | FCM 토큰 삭제 |
| `/api/users/alarm` | GET | `GET /alarmUsers.php` | 알림 대상 사용자 조회 |
| `/api/post` | GET | `GET /post.php` | 게시글 단일 조회 |
| `/api/post/list` | GET | `GET /postList.php` | 게시글 목록 조회 |
| `/sitemap-post.xml` | GET | `GET /sitemap.php` | 사이트맵 데이터 조회 |

---

## 환경 변수

프로젝트 루트의 `.env.local` 파일에 다음을 설정할 수 있습니다:

```env
API_URL=https://api.mindpang.com/api/quizbells
```

설정하지 않으면 기본값으로 `https://api.mindpang.com/api/quizbells`를 사용합니다.

---

## 에러 처리

모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

HTTP 상태 코드:
- `200`: 성공
- `400`: 잘못된 요청 (필수 파라미터 누락 등)
- `500`: 서버 오류

