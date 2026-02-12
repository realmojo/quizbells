---
name: Write Post
description: "SEO 최적화된 블로그 글을 작성하여 quizbells_posts 테이블에 삽입합니다. E-E-A-T 원칙과 구글 SEO 가이드라인을 준수합니다."
---

# Write Post — SEO 최적화 블로그 글 작성기

사용자가 요청한 주제로 구글 SEO에 최적화된 블로그 글을 작성하고, Supabase `quizbells_posts` 테이블에 삽입합니다.

## 작성 원칙: Google E-E-A-T

모든 글은 아래 4가지 원칙을 반드시 충족해야 합니다.

### Experience (경험)
- 직접 겪어본 후기, 실제 사용 사례 등 **구체적인 수치와 경험 데이터**를 포함
- "실제로 3개월간 사용해본 결과...", "직접 테스트해보니..." 같은 경험적 서술
- 스크린샷 설명, 단계별 가이드 등 **실사용자 관점**의 정보

### Expertise (전문성)
- 해당 분야에 대한 **깊이 있는 지식**을 바탕으로 정확한 정보 제공
- 단순 나열이 아닌 **왜 그런지, 어떤 원리인지** 설명
- 전문 용어를 사용하되 쉽게 풀어서 설명

### Authoritativeness (권위성)
- 공신력 있는 출처 인용 (금융감독원, 국세청, 은행 공식사이트 등)
- 통계 수치 포함 시 출처 명시
- 관련 법규나 제도를 정확히 참조

### Trustworthiness (신뢰성)
- 정보가 **정확하고 최신** 상태여야 함
- 과장하지 않고 현실적인 수치 제공
- 장점뿐 아니라 **단점과 주의사항**도 반드시 포함

---

## 글 구조 규격

### HTML 구조 (필수 준수)

```
<p>도입부: 독자의 문제에 공감 + 이 글을 읽으면 얻는 이점 명시 (두괄식, 핵심 답변 먼저)</p>

<h2>섹션1 제목</h2>
<center><ins class="adsbygoogle" style="display: block;" data-ad-client="ca-pub-9130836798889522" data-ad-slot="7459422657" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></center>
<p>본문 (3~4줄 이내 짧은 문단)</p>
<p>본문 (능동태, 명확한 문장)</p>

<h2>섹션2 제목</h2>
<center>광고 블록</center>
<p>본문...</p>
<ul><li>항목1</li><li>항목2</li><li>항목3</li></ul>

<h2>섹션3 제목</h2>
<center>광고 블록</center>
<p>본문...</p>
<table class="app-table" style="width: 100%;"><tr><th>비교항목</th><th>A</th><th>B</th></tr><tr><td>항목1</td><td>값</td><td>값</td></tr></table>

... (총 5~7개 h2 섹션)

<h2>마무리: 핵심 요약과 다음 행동 유도</h2>
<p>핵심 내용 요약 + 퀴즈벨 활용 CTA</p>
```

### 필수 요소 체크리스트

- [ ] **최소 4000자** 이상 (공백 포함)
- [ ] **h2 섹션 5~7개** (소제목만 읽어도 전체 흐름 파악 가능)
- [ ] **광고 블록**: 매 h2 직후 삽입
- [ ] **비교 테이블**: 최소 1개 (3열 이상, `class="app-table"`)
- [ ] **불렛 리스트**: 최소 2개 (`<ul><li>`)
- [ ] **외부 링크**: 권위 있는 출처 1~2개 (`<a href="..." target="_blank">`)
- [ ] **내부 링크**: 퀴즈벨 관련 페이지 연결 1개 이상
- [ ] **구체적 수치**: 금액, %, 기간 등 숫자 데이터 포함

### 문체 규칙

1. **두괄식**: 결론/핵심을 먼저, 설명은 후에
2. **짧은 문단**: 한 문단 3~4줄 이내 (모바일 가독성)
3. **능동태**: "권장됩니다" → "권장합니다"
4. **용어 통일**: 같은 개념은 하나의 용어로 일관되게
5. **쉬운 문체**: 중학생도 이해할 수 있는 명료한 설명
6. **한국어**: 모든 콘텐츠는 한국어로 작성

---

## 데이터 형식

`quizbells_posts` 테이블 스키마:

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | text (PK) | 게시글 ID (숫자 문자열: "11", "12"...) |
| title | text NOT NULL | 글 제목 (50자 내외, 핵심 키워드 포함) |
| description | text | 요약 설명 (150~200자, meta description 용도) |
| keywords | text[] | SEO 키워드 배열 (5~7개) |
| category | text | 카테고리 ("금융", "세금", "정부지원", "종합" 등) |
| content | text | HTML 본문 (4000자 이상) |
| date | date | 게시 날짜 (YYYY-MM-DD) |

---

## 실행 절차

### Step 1: 주제 분석
- 사용자 요청에서 글 제목과 주제를 파악
- 비어있으면 사용자에게 주제를 물어봄

### Step 2: 키워드 리서치
- WebSearch로 해당 주제의 검색 트렌드와 관련 키워드 조사
- 경쟁 콘텐츠 상위 5개의 구조 분석

### Step 3: 기존 ID 확인
- execute_sql로 `SELECT max(id::int) FROM quizbells_posts` 실행하여 다음 ID 결정

### Step 4: 콘텐츠 작성
- 위 구조 규격과 E-E-A-T 원칙을 엄격히 준수하여 HTML 콘텐츠 작성
- content 길이가 4000자 이상인지 확인

### Step 5: DB 삽입
- execute_sql로 INSERT 실행
- 삽입 후 SELECT로 검증 (id, title, length(content))

### Step 6: 결과 보고

```
## 작성 완료

- ID: {id}
- 제목: {title}
- 카테고리: {category}
- 키워드: {keywords}
- 본문 길이: {length}자
- 섹션 수: {h2_count}개
- 테이블: {table_count}개
- 리스트: {list_count}개
```

---

## 주의사항

- 절대 허위 정보를 작성하지 않습니다. 확실하지 않은 수치는 "약", "대략" 등을 붙입니다.
- 금융 상품 정보는 변동될 수 있음을 명시합니다.
- 광고 블록의 data-ad-client, data-ad-slot 값은 절대 변경하지 않습니다.
- HTML 문자열 내 작은따옴표(')는 두 개로 이스케이프합니다 (SQL 삽입 시).
- 한 번에 1개 글씩 작성하고 삽입합니다.
