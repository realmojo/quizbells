// 퀴즈 정답 페이지의 구조화된 데이터(JSON-LD) 생성.
// page.tsx 본문이 비대해지지 않도록 SEO 데이터 구성 로직을 분리한다.
// 반환값(@graph)은 기존 인라인 구현과 동일하다.

import { getQuizSeoLead } from "@/utils/utils";

interface QuizDescItem {
  typeKr: string;
  title: string;
  seoLead?: string;
  searchKeywords?: string[];
}

export interface BuildStructuredDataArgs {
  type: string;
  date: string;
  answerDate: string;
  item: QuizDescItem;
  answerDateString: string;
  shortDateLabel: string;
  h1Title: string;
  firstDescription: string;
  currentUrl: string;
  isoDate: string;
  modifiedDate: string;
  contents: any[];
  participantCount: number;
}

export function buildQuizStructuredData(args: BuildStructuredDataArgs) {
  const {
    type,
    date,
    answerDate,
    item,
    answerDateString,
    shortDateLabel,
    h1Title,
    firstDescription,
    currentUrl,
    isoDate,
    modifiedDate,
    contents,
    participantCount,
  } = args;

  const searchKeywords = item.searchKeywords || [];
  // 검색 사용자가 실제 입력하는 연속 구문 (예: "토스 1등찍기", "기후동행퀴즈")
  const seoLead = getQuizSeoLead(item);

  // FAQPage 구조화된 데이터 (검색결과 리치 스니펫용)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ko",
    mainEntity:
      contents.length > 0
        ? contents.map((quiz: any) => ({
            "@type": "Question",
            // AEO: 사용자가 실제 검색하는 질문형 문장으로 작성해야
            // AI 답변 엔진이 질의와 매칭하기 쉽다.
            name: `${answerDateString} ${seoLead}${quiz.question ? ` "${quiz.question}"` : ""} 정답은 무엇인가요?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${answerDateString} ${seoLead} 정답은 [${quiz.answer}] 입니다.${quiz.otherAnswers?.length > 0 ? ` 다른 정답으로는 ${quiz.otherAnswers.join(", ")} 등이 있습니다.` : ""}`,
            },
          }))
        : [
            {
              "@type": "Question",
              name: `${answerDateString} ${seoLead} 퀴즈 정답은 무엇인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "정답이 아직 업데이트되지 않았습니다. 곧 업데이트될 예정입니다.",
              },
            },
          ],
  };

  // Breadcrumb 구조화된 데이터
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: "https://quizbells.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: `${item.typeKr} 퀴즈`,
      item: `https://quizbells.com/quiz/${type}/today`,
    },
  ];
  // today가 아닌 과거 날짜일 때만 3단계 추가 (today면 2번째와 URL이 중복되므로)
  if (date !== "today") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: `${shortDateLabel} 정답`,
      item: `https://quizbells.com/quiz/${type}/${answerDate}`,
    });
  }
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  // 키워드 생성 (searchKeywords 포함)
  const keywords = [
    `${item.typeKr} 정답`,
    `${seoLead} 정답`,
    `${shortDateLabel} ${item.typeKr}`,
    `${item.typeKr} 퀴즈`,
    `${item.typeKr} 퀴즈 정답`,
    ...searchKeywords,
    "앱테크 퀴즈",
    "퀴즈 정답",
    "실시간 정답",
    "오늘의 퀴즈",
    "퀴즈벨",
  ].join(", ");

  // articleBody 생성 (퀴즈 내용 포함)
  const articleBodyText = `${seoLead} ${answerDateString} 정답을 알려드립니다. ${contents.length > 0 ? `오늘의 퀴즈 정답은 ${contents.map((q: any) => q.answer).join(", ")} 등이 있습니다.` : ""} 앱테크로 소소한 행복을 누리시는 분들을 위해 실시간으로 정답을 업데이트하고 있습니다. 매일 새로운 퀴즈와 함께 포인트를 적립하고 현금으로 환급받을 수 있는 기회를 제공합니다. 정확하고 빠른 정답 정보로 여러분의 앱테크 생활을 더욱 풍요롭게 만들어드리겠습니다.`;

  // 검색 키워드 기반 대체 헤드라인 (검색엔진이 키워드 매칭에 활용)
  const alternativeHeadlines =
    searchKeywords.length > 0
      ? searchKeywords.slice(0, 3).map((kw: string) => `${kw} ${shortDateLabel} 정답`)
      : [];

  const articleJsonLd = {
    "@type": "Article",
    "@id": currentUrl,
    url: currentUrl,
    headline: h1Title,
    ...(alternativeHeadlines.length > 0 && {
      alternativeHeadline: alternativeHeadlines.join(" | "),
    }),
    description: firstDescription,
    inLanguage: "ko",
    isAccessibleForFree: true,
    datePublished: isoDate,
    dateModified: modifiedDate,
    dateCreated: isoDate,
    author: {
      "@type": "Person",
      name: "퀴즈벨 에디터",
      url: "https://quizbells.com",
    },
    // Publisher 정보 보강 (필수 항목)
    publisher: {
      "@type": "Organization",
      "@id": "https://quizbells.com/#organization",
      name: "퀴즈벨",
      alternateName: "QUIZBELLS",
      url: "https://quizbells.com",
      logo: {
        "@type": "ImageObject",
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
      },
      sameAs: [
        "https://play.google.com/store/apps/details?id=com.mojoday.quizbells",
        "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703",
      ],
    },
    // mainEntityOfPage 추가 (페이지의 핵심 콘텐츠임을 명시)
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
      url: currentUrl,
      name: h1Title,
      description: firstDescription,
      inLanguage: "ko",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://quizbells.com/#website",
        name: "퀴즈벨",
        url: "https://quizbells.com",
      },
    },
    // Image 정보 보강 (검색 결과 썸네일 노출 확률 향상)
    image: {
      "@type": "ImageObject",
      url: `https://quizbells.com/images/${type}.webp`,
      width: 1200,
      height: 630,
      alt: `${seoLead} 퀴즈 정답`,
      caption: `${seoLead} ${answerDateString} 정답`,
    },
    keywords: keywords,
    articleSection: "앱테크/재테크",
    articleBody: articleBodyText,
    // 음성 비서·AI 요약 엔진이 우선 읽어갈 핵심 영역 지정 (AEO)
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#quiz-content"],
    },
    about: {
      "@type": "Thing",
      name: `${seoLead}`,
      description: `매일 출제되는 ${seoLead} 퀴즈 정답을 실시간으로 제공하는 서비스`,
    },
    // FAQPage의 mainEntity에 Question을 넣는 것이 올바른 방법
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://quizbells.com/#website",
      name: "퀴즈벨",
      url: "https://quizbells.com",
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: {
          "@type": "https://schema.org/ReadAction",
        },
        userInteractionCount: participantCount,
      },
    ],
  };

  // @graph로 모든 구조화된 데이터 통합
  return {
    "@context": "https://schema.org",
    "@graph": [faqJsonLd, breadcrumbJsonLd, articleJsonLd],
  };
}
