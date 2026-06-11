// 구조화 데이터(Schema.org JSON-LD) 공통 상수·빌더
// 모든 페이지의 스키마가 동일한 @id(Organization/WebSite)를 참조하도록 하여
// 검색엔진·AI 엔진이 엔티티를 하나로 인식하게 한다 (GEO/AEO 핵심).

export const SITE_URL = "https://quizbells.com";
export const SITE_NAME = "퀴즈벨";
export const SITE_NAME_EN = "QUIZBELLS";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_URL = `${SITE_URL}/icons/android-icon-192x192.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/quizbells_og_1200.webp`;

export const SAME_AS = [
  "https://play.google.com/store/apps/details?id=com.mojoday.quizbells",
  "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703",
];

/** 다른 스키마에서 Organization을 참조할 때 사용 */
export const organizationRef = { "@type": "Organization", "@id": ORG_ID };

/** 다른 스키마에서 WebSite를 참조할 때 사용 */
export const websiteRef = { "@type": "WebSite", "@id": WEBSITE_ID };

/** Article 등의 publisher 필드용 (로고 포함 전체 정보) */
export const publisherJsonLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: SITE_NAME_EN,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 192,
    height: 192,
  },
  sameAs: SAME_AS,
};

/** BreadcrumbList 빌더 */
export function buildBreadcrumb(items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}
