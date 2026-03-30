# GEO Audit Report: QuizBells (퀴즈벨)

**Audit Date:** 2026-03-30
**URL:** https://quizbells.com
**Business Type:** Publisher / Content Aggregator (Korean App-Tech Quiz Answer Service)
**Pages Analyzed:** 21 quiz pages + 52 blog posts + 7 static pages = ~80 pages
**Language:** Korean (ko)

---

## Executive Summary

**Overall GEO Score: 44/100 (Poor)**

QuizBells has a solid technical foundation -- all AI crawlers are allowed, sitemaps are comprehensive, and quiz pages are server-rendered with rich structured data. However, the site suffers from two severe deficits: **near-zero external brand presence** (no Wikipedia, YouTube, Reddit, LinkedIn, or Naver mentions) and **weak content authority signals** (no named authors, no credentials, thin About page, no external citations). The core quiz answer content is inherently low-citability due to its ephemeral, context-dependent nature. The blog section (comparison articles, guides) is the strongest GEO asset but needs significant expansion. Creating external brand presence and improving content E-E-A-T signals are the highest-leverage actions.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 52/100 | 25% | 13.0 |
| Brand Authority | 12/100 | 20% | 2.4 |
| Content E-E-A-T | 42/100 | 20% | 8.4 |
| Technical GEO | 74/100 | 15% | 11.1 |
| Schema & Structured Data | 38/100 | 10% | 3.8 |
| Platform Optimization | 52/100 | 10% | 5.2 |
| **Overall GEO Score** | | | **43.9/100** |

### AI Platform Readiness

| Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 68/100 | Good |
| Google Gemini | 55/100 | Fair |
| Bing Copilot | 48/100 | Poor |
| Perplexity AI | 45/100 | Poor |
| ChatGPT Web Search | 42/100 | Poor |

---

## Critical Issues (Fix Immediately)

### 1. Near-Zero External Brand Presence (Brand Authority: 12/100)
QuizBells is virtually invisible outside its own domain. No Wikipedia article, no YouTube channel, no Reddit mentions, no LinkedIn company page, no Naver Blog/Cafe presence, and no coverage in Korean tech blogs or news sites. AI models cannot recommend or cite a brand they have never encountered in training data or retrieval sources. Competitors (리워드팁, 앱테크고, 모두퀴즈, BNT뉴스) dominate search results for the same keywords.

**Fix:** Create profiles on YouTube, LinkedIn, Naver Blog. Pursue Wikipedia/Namu Wiki entries. Engage on Korean communities (ppomppu, fmkorea). Seek inclusion in app-tech recommendation articles.

### 2. No llms.txt File (Score: 0/100)
No `llms.txt` or `llms-full.txt` exists. AI models that support this standard cannot discover structured information about the site.

**Fix:** Create `/llms.txt` with site description, key page URLs, and content organization. Reference in robots.txt.

### 3. Blog Post Article Schema Missing Required `image` Property
Blog posts (`/posts/[id]`) and tips pages (`/tips/[id]`) have Article JSON-LD without the `image` property, which Google requires for Article rich results. These pages are ineligible for rich snippets.

**Fix:** Add `"image": {"@type": "ImageObject", "url": "https://quizbells.com/images/quizbells_og_1200.png", "width": 1200, "height": 630}` to Article schema in `/posts/[id]/page.tsx` and `/tips/[id]/page.tsx`.

### 4. Blog/Tips JSON-LD Uses `<Script>` Instead of `<script>`
Blog posts and tips pages use Next.js `<Script>` component for Article and BreadcrumbList JSON-LD, which may cause delayed processing by Google and complete invisibility to AI crawlers. Quiz pages correctly use plain `<script>` tags.

**Fix:** Change `import Script from "next/script"` to plain `<script type="application/ld+json">` with `dangerouslySetInnerHTML` in `/posts/[id]/page.tsx` and `/tips/[id]/page.tsx`.

### 5. YMYL Content Without Disclaimers
The freelancer tax guide (posts/23) provides specific tax advice from a quiz aggregator with no tax credentials and no disclaimer. This is a serious E-E-A-T risk.

**Fix:** Add prominent disclaimer: "이 콘텐츠는 정보 제공 목적이며 전문적인 세무/재무 조언이 아닙니다. 구체적인 상황은 세무사에게 상담하세요."

---

## High Priority Issues

### 6. Homepage Quiz Grid is Client-Side Rendered Only
The `QuizComponent` on the homepage is a `"use client"` component. AI crawlers see "Loading..." instead of the quiz card grid. The homepage has structured data and meta tags, but the core content listing is invisible to crawlers.

**Fix:** Convert quiz listing to server component or pass server-fetched data as props to a thin client wrapper.

### 7. Organization Schema `sameAs` Only Links to 2 App Stores
Only Google Play and Apple App Store are linked. No Wikipedia, LinkedIn, YouTube, or social media. AI models cannot build a complete entity graph.

**Fix:** Expand `sameAs` to include 5+ platforms. Create LinkedIn company page, YouTube channel, etc.

### 8. No Person Schema / No Named Author
All content is attributed to "퀴즈벨 에디터" or the Organization. No named person, no credentials, no author page, no Person schema. AI models cannot verify author expertise.

**Fix:** Establish individual author identity with real name, bio, credentials, LinkedIn profile. Implement Person schema with `@id` referencing.

### 9. Missing Security Headers (HSTS, CSP, X-Frame-Options)
- No `Strict-Transport-Security` header (SSL stripping vulnerability)
- No `Content-Security-Policy` (intentionally omitted for AdSense/GTM compatibility)
- No `X-Frame-Options` (clickjacking risk)

**Fix:** Enable HSTS via Cloudflare or middleware. Add `X-Frame-Options: SAMEORIGIN`. Consider report-only CSP.

### 10. Render-Blocking Analytics Scripts
5 scripts use `strategy="beforeInteractive"` in root layout (Naver Analytics, GTM, GA). These block initial rendering and impact LCP.

**Fix:** Change to `afterInteractive` or `lazyOnload` strategy. Expected LCP improvement: 500ms+.

### 11. About Page is Critically Thin (~350 words)
No team information, no company history, no physical address, no credentials, no user metrics. This is the primary Authoritativeness signal and it's nearly empty.

**Fix:** Add founding story, team members with bios, company registration, user metrics, methodology explanation.

### 12. Quiz Answers Hidden Behind Click-Through
On primary quiz URLs (`/quiz/[type]/today`), answers are in FAQPage JSON-LD but the visible answer text requires clicking through to `/answer`. AI platforms extract from initial HTML.

**Fix:** Surface actual answer text on the primary quiz page in server-rendered HTML.

### 13. No WebSite Schema / SearchAction on Wrong Type
SearchAction is placed on SoftwareApplication instead of WebSite. Google only recognizes SearchAction for sitelinks search box on WebSite schema.

**Fix:** Add standalone WebSite JSON-LD to `layout.tsx`. Move SearchAction there.

### 14. IndexNow Only Submits to Naver
The `/api/naver/indexnow` route only POSTs to Naver's IndexNow endpoint. Bing's endpoint is not included.

**Fix:** Add parallel POST to `https://api.indexnow.org/indexnow`. Register in Bing Webmaster Tools.

---

## Medium Priority Issues

### 15. No External Citations in Content
Blog posts make specific claims without sources. The walking app comparison cites "20 million+ downloads" without linking to a source. Tax rates are stated without linking to the Korean National Tax Service.

**Fix:** Add 3-5 authoritative external citations per blog post.

### 16. No `speakable` Schema on Any Page
Zero AI voice search optimization. Not present on any Article schema.

**Fix:** Add `SpeakableSpecification` with CSS selectors targeting headlines, descriptions, and answer text.

### 17. Meta Descriptions Too Short (70-80 chars)
Current descriptions are below the ideal 150-160 character range. Longer descriptions provide more context for search snippets and AI.

**Fix:** Expand meta descriptions to 150-160 characters.

### 18. Blog Post URLs Use Numeric IDs
`/posts/44` instead of `/posts/cashwalk-vs-toss-walking-app-comparison`. Misses keyword signals in URLs.

**Fix:** Implement keyword-rich slugs for blog posts.

### 19. Tips Section Severely Underdeveloped
Only 2 tips articles from July 2025. This section is stale and thin.

**Fix:** Publish 2-4 new tips articles per month. Target 15+ articles.

### 20. Missing `<link rel="preconnect">` for Third-Party Domains
No preconnect hints for `cdn.jsdelivr.net` (fonts), `www.googletagmanager.com`, or `wcs.naver.net`.

**Fix:** Add preconnect links in root layout. Expected LCP improvement: 100-300ms.

### 21. No Community Presence on Korean Forums
Zero mentions on ppomppu, fmkorea, clien, Naver Cafe, or other Korean communities. Perplexity heavily weights community discussion.

**Fix:** Start community engagement on Korean app-tech forums with regular posts.

### 22. Dynamic Pages Have No Cache-Control Headers
Quiz and post pages have no caching headers. Adding edge caching would improve TTFB.

**Fix:** Add `Cache-Control: s-maxage=60, stale-while-revalidate=300` for quiz pages.

### 23. Author Identity Inconsistent Across Pages
Author is represented as `Organization "퀴즈벨"` on blog posts, `Person "퀴즈벨 에디터"` on quiz pages, `Organization "퀴즈벨 에디터"` on tips pages.

**Fix:** Standardize author identity using `@id` references across all content pages.

### 24. No Advertising/Affiliate Disclosure
Google AdSense integrated site-wide (ca-pub-9130836798889522) but not disclosed. Cross-promotion to sajulatte.app without disclosure.

**Fix:** Add visible advertising disclosure notice.

---

## Low Priority Issues

### 25. Sitemap `lastmod` Format Inconsistent
Some entries use full ISO 8601 with timezone, others use date-only format.

### 26. About Page OG Image Uses 192x192 Icon
Should use the 1200x630 OG image like other pages.

### 27. No RSS Auto-Discovery Link
Missing `<link rel="alternate" type="application/rss+xml">` in HTML head.

### 28. FAQ Page Uses Microdata Instead of JSON-LD
Inconsistent with the rest of the site. Add supplementary JSON-LD.

### 29. BreadcrumbList Missing on /about and /faq Pages
These pages only inherit global Organization schema.

### 30. Homepage BreadcrumbList Has Only 1 Item
Single-item breadcrumb provides minimal value.

### 31. `mainEntityOfPage` on Tips Pages Uses String URL
Should be `{"@type": "WebPage", "@id": "URL"}` for proper nesting.

### 32. Organization `logo` is String URL Instead of ImageObject
Google recommends ImageObject with width/height.

---

## Category Deep Dives

### AI Citability (52/100)

**Strongest Content for AI Citation:**
- Walking app comparison table (posts/44): **78/100** -- structured comparison with specific figures
- Freelancer tax bracket table (posts/23): **75/100** -- precise numerical data in table format
- 6-month app-tech income progression (posts/50): **73/100** -- original experience data with monthly breakdown

**Weakest Content:**
- Quiz answer pages (all 21 types): **45-50/100** -- answers are short, context-dependent, expire daily
- Homepage: **38/100** -- thin marketing copy with no statistics
- About page: **35/100** -- generic mission statement

**Key Insight:** Blog content with comparison tables and data is the site's strongest citability asset. Quiz answers, the core product, have inherently low citability because "the answer is 70" is meaningless without the quiz context. Adding explanatory context paragraphs for each answer would significantly improve citability.

**Recommendations:**
1. Add 2-3 sentence explanatory paragraphs for each quiz answer providing context
2. Include "What is [App Name] Quiz?" definition blocks at the top of each quiz type page
3. Add statistical summary blocks with earnings data per quiz type
4. Expand blog content with more comparison and data-driven articles
5. Add "Key Takeaway" summary blocks at the top of each article

### Brand Authority (12/100)

| Platform | Status | Score |
|---|---|---|
| Wikipedia (EN/KO) | Absent | 0 |
| Namu Wiki | Absent | 0 |
| Reddit | Absent | 0 |
| YouTube | Absent | 0 |
| LinkedIn | Absent | 0 |
| Naver Blog/Cafe | Absent | 0 |
| Korean News Sites | Absent | 0 |
| Google Play Store | Minimal | 5 |
| Apple App Store | Minimal | 5 |
| Industry Sources | Absent | 0 |

**Competitive Gap:** Competitors (리워드팁, 앱테크고, 모두퀴즈, BNT뉴스, 위키트리) appear prominently in search results for app-tech quiz queries. QuizBells does not appear in any third-party results.

**Recommendations:**
1. Create YouTube channel with app-tech tutorial videos and daily quiz answer Shorts
2. Establish Naver Blog/Cafe presence with regular posts
3. Pursue Korean Wikipedia/Namu Wiki entries
4. Engage on ppomppu, fmkorea communities
5. Create LinkedIn company page
6. Seek inclusion in app-tech recommendation articles

### Content E-E-A-T (42/100)

| Dimension | Score | Key Gap |
|---|---|---|
| Experience | 6/25 | No screenshots, no first-hand usage narratives, no earnings proof |
| Expertise | 8/25 | Generic anonymous byline, no credentials, YMYL content without expert backing |
| Authoritativeness | 7/25 | Thin about page, no external citations, no media mentions, no partnerships |
| Trustworthiness | 12/25 | HTTPS present, privacy/terms exist, but no physical address, no editorial standards, undisclosed advertising |

**Strongest Signals:** Real-time update timestamps, daily content freshness, correct industry terminology, comprehensive quiz type coverage.

**Weakest Signals:** Anonymous authorship, zero external citations, thin About page, YMYL content without disclaimers, no community validation.

**Recommendations:**
1. Create substantive About page with team, history, methodology, metrics
2. Establish named author with credentials and Person schema
3. Add screenshots and visual evidence to quiz pages
4. Add external citations to all blog content
5. Create original experience-based content (monthly earnings reports)
6. Disclose advertising relationships

### Technical GEO (74/100)

| Area | Score | Status |
|---|---|---|
| Meta Tags & Indexability | 92/100 | Good |
| URL Structure | 92/100 | Good |
| Mobile Optimization | 90/100 | Good |
| Crawlability | 85/100 | Good |
| SSR Assessment | 72/100 | Medium Risk |
| Core Web Vitals Risk | 65/100 | Fair |
| Security Headers | 42/100 | Poor |

**Strengths:** Comprehensive sitemaps (5 sub-sitemaps, ~1,157 URLs), proper meta robots/canonical tags, clean URL structure, responsive design, edge-rendered quiz pages with full SSR, proper HTML semantics.

**Weaknesses:** Homepage client-rendered quiz grid, missing security headers (HSTS, CSP, X-Frame-Options), 5 render-blocking `beforeInteractive` scripts, no preconnect hints for third-party domains, no caching headers on dynamic pages.

**Recommendations:**
1. Add preconnect hints for CDN and analytics domains
2. Move analytics scripts from `beforeInteractive` to `afterInteractive`
3. Add HSTS and X-Frame-Options headers
4. Server-render homepage quiz grid
5. Add Cache-Control headers for dynamic pages

### Schema & Structured Data (38/100)

**Schema Types Found:**

| Schema | Pages | Status |
|---|---|---|
| Organization | All (layout) | Valid with warnings (thin sameAs, no description) |
| SoftwareApplication | All (layout) | Valid (SearchAction on wrong type) |
| FAQPage (JSON-LD) | Quiz pages | Valid (restricted since Aug 2023 but semantically valuable) |
| Article | Quiz, posts, tips | Valid with warnings (missing image on posts/tips, inconsistent author) |
| BreadcrumbList | Most pages | Valid (minimal on homepage) |
| CollectionPage + ItemList | Quiz layout | Valid |
| FAQPage (Microdata) | /faq | Valid |

**Critical Gaps:**
- No WebSite schema
- No Person schema for authors
- No `speakable` property on any page
- Blog/tips Article missing required `image` property
- Organization `sameAs` only links to 2 platforms
- Blog/tips JSON-LD rendered via `<Script>` (JS-dependent) instead of `<script>`

**Recommendations:**
1. Add Article `image` property to blog/tips pages
2. Expand Organization `sameAs` to 5+ platforms
3. Change `<Script>` to `<script>` for blog/tips JSON-LD
4. Add WebSite schema with SearchAction
5. Add Person schema for author identity
6. Add `speakable` property to Article schemas

### Platform Optimization (52/100)

**Google AI Overviews (68/100):** Strongest platform due to rich structured data (FAQPage, Article, BreadcrumbList), daily-refreshed sitemaps, and server-rendered quiz content. Main gaps: homepage CSR, quiz answers hidden behind click-through, no outbound citations.

**Google Gemini (55/100):** Good content depth with 20 quiz types and topical clustering. Gaps: no YouTube presence, no Knowledge Graph entity, app store-only sameAs.

**Bing Copilot (48/100):** IndexNow infrastructure exists but only for Naver. No Bing Webmaster Tools. No LinkedIn presence (Microsoft ecosystem). Technically solid page structure.

**Perplexity AI (45/100):** Excellent freshness signals (W3C datetime precision). Gaps: zero community validation (no Reddit/forum mentions), homepage CSR invisible to PerplexityBot, aggregated rather than original content.

**ChatGPT Web Search (42/100):** Weakest platform. No entity recognition signals (no Wikipedia/Wikidata). No author credentials. Brand invisible to ChatGPT's entity resolution system.

---

## Quick Wins (Implement This Week)

1. **Create `/llms.txt`** -- Zero-cost, 30-minute task. Provide structured site description for AI models. (Impact: +5-10 on AI Citability)

2. **Fix blog/tips JSON-LD: `<Script>` to `<script>`** -- 5-minute code change in 2 files. Makes Article schema visible to all AI crawlers. (Impact: +5 on Schema score)

3. **Add `image` to blog/tips Article schema** -- 5-minute code change. Enables Article rich results in Google. (Impact: +5 on Schema score)

4. **Extend IndexNow to Bing** -- Add ~5 lines of code to existing IndexNow route. (Impact: +10 on Bing Copilot)

5. **Add explicit AI bot directives to robots.txt** -- 2-minute edit. Add `User-agent: GPTBot`, `ClaudeBot`, `PerplexityBot` with `Allow: /`. (Impact: Future-proofing)

---

## 30-Day Action Plan

### Week 1: Critical Schema & Technical Fixes
- [ ] Fix blog/tips JSON-LD rendering (`<Script>` to `<script>`)
- [ ] Add `image` property to blog/tips Article schema
- [ ] Create `/llms.txt` file
- [ ] Add WebSite schema with SearchAction to layout.tsx
- [ ] Add Organization `description` property
- [ ] Expand Organization `sameAs` (add LinkedIn, any existing profiles)
- [ ] Add explicit AI crawler directives to robots.txt
- [ ] Extend IndexNow to Bing endpoint
- [ ] Add HSTS and X-Frame-Options headers
- [ ] Add YMYL disclaimer to tax/finance blog posts

### Week 2: Content & E-E-A-T Improvements
- [ ] Rewrite About page with team info, methodology, metrics
- [ ] Establish named author identity (real name, bio, credentials)
- [ ] Add Person schema for author
- [ ] Add external citations (3-5 per post) to existing blog posts
- [ ] Add advertising disclosure notice
- [ ] Add `speakable` property to Article schemas
- [ ] Update privacy policy for Korean PIPA compliance
- [ ] Move analytics scripts from `beforeInteractive` to `afterInteractive`
- [ ] Add preconnect hints for third-party domains

### Week 3: Content Production & Brand Building
- [ ] Create LinkedIn company page for QUIZBELLS
- [ ] Set up YouTube channel (even placeholder with 1-2 quiz answer Shorts)
- [ ] Publish 2 new tips articles with original data
- [ ] Add screenshots to 5 highest-traffic quiz pages
- [ ] Create "What is [App Name] Quiz?" definition blocks for each quiz type
- [ ] Add answer explanation paragraphs to quiz pages
- [ ] Start Naver Blog with weekly app-tech roundups

### Week 4: Platform Optimization & Outreach
- [ ] Server-render homepage quiz grid (refactor QuizComponent)
- [ ] Surface quiz answers on primary URLs in server-rendered HTML
- [ ] Register in Bing Webmaster Tools (add msvalidate.01 meta tag)
- [ ] Register with Google News publisher center
- [ ] Start community engagement on ppomppu and fmkorea
- [ ] Cross-link quiz pages and blog content
- [ ] Publish first monthly "App-Tech Earnings Report" with real data

---

## Appendix: Pages Analyzed

| URL | Title | Key GEO Issues |
|---|---|---|
| https://quizbells.com | 퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음 | Client-rendered quiz grid, thin homepage content (~300 words) |
| https://quizbells.com/quiz/toss/today | 토스 행운퀴즈 오늘 정답 | Answers hidden behind click-through, low citability for ephemeral content |
| https://quizbells.com/quiz/cashwalk/today | 캐시워크 퀴즈 오늘 정답 | Same as above |
| https://quizbells.com/quiz/shinhan/today | 신한쏠 퀴즈 오늘 정답 | Same as above |
| https://quizbells.com/posts/44 | 걷기앱 비교 | Missing Article image, `<Script>` JSON-LD, no external citations |
| https://quizbells.com/posts/23 | 프리랜서 세금 가이드 | YMYL without disclaimer, missing image, no expert credentials |
| https://quizbells.com/posts/50 | 6개월 앱테크 수익 | Missing image, no external citations |
| https://quizbells.com/about | 서비스 소개 | Critically thin (~350 words), no team info, OG image wrong size |
| https://quizbells.com/faq | 자주 묻는 질문 | Microdata only (no JSON-LD), no breadcrumb schema |
| https://quizbells.com/tips | 앱테크 꿀팁 | Only 2 articles (stale since July 2025) |
| https://quizbells.com/privacy | 개인정보처리방침 | Short (~350 words), no PIPA reference, no update date |
| https://quizbells.com/terms | 이용약관 | No governing law clause |

### Key Files Referenced

| File | Relevance |
|---|---|
| `src/app/layout.tsx` | Organization + SoftwareApplication schema, meta tags, analytics scripts |
| `src/app/page.tsx` | Homepage (client-rendered QuizComponent) |
| `src/app/quiz/[type]/[date]/page.tsx` | Quiz detail page (FAQPage + Article + Breadcrumb schema) |
| `src/app/quiz/[type]/[date]/answer/page.tsx` | Server-rendered answer page |
| `src/app/posts/[id]/page.tsx` | Blog post (Article schema via `<Script>`) |
| `src/app/tips/[id]/page.tsx` | Tips page (Article schema via `<Script>`) |
| `src/app/faq/page.tsx` | FAQ page (Microdata FAQPage) |
| `src/app/about/page.tsx` | About page (thin content) |
| `src/middleware.ts` | Security headers |
| `public/robots.txt` | Crawler directives |
| `src/app/api/naver/indexnow/route.ts` | IndexNow (Naver-only) |
| `src/components/QuizComponent.tsx` | Homepage quiz listing (client-only) |
| `src/components/DescriptionComponent.tsx` | Quiz type descriptions |
| `src/utils/utils.ts` | Quiz items registry (21 types) |

---

*Generated by GEO Audit Tool | 2026-03-30*
*Methodology: GEO Score = (Citability x 0.25) + (Brand x 0.20) + (E-E-A-T x 0.20) + (Technical x 0.15) + (Schema x 0.10) + (Platform x 0.10)*
