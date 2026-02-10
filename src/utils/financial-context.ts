export const FINANCIAL_TIPS = [
  "오늘의 퀴즈 정답과 함께 알아보는 카카오뱅크 금리 혜택",
  "최근 신용대출 한도 조회 시 유의사항",
  "파킹통장 이자 높은 곳 비교와 효율적인 자금 관리법",
  "사회초년생을 위한 신용점수 올리는 법",
  "알아두면 쓸모있는 예적금 풍차돌리기 재테크",
  "마이데이터 서비스로 흩어진 내 자산 한눈에 관리하기",
  "연말정산 소득공제 혜택 챙기는 꿀팁",
  "CMA 통장 vs 파킹통장, 나에게 맞는 선택은?",
  "주택청약통장, 일찍 가입할수록 유리한 이유",
  "ISA(개인종합자산관리계좌) 절세 혜택 완벽 가이드",
];

export const BRIDGE_CONTENT: Record<string, string | string[]> = {
  card: "참고로 요즘 연회비 없는 신용카드나 캐시백 혜택이 큰 체크카드를 찾으신다면, 카드사별 신규 발급 이벤트를 확인해보세요. 최대 10만원 이상의 혜택을 받을 수도 있습니다.",
  deposit:
    "최근 비과세 종합저축 혜택이나 절세 계좌(ISA) 활용법이 주목받고 있습니다. 예금 금리가 높을 때 가입해두면 만기 시 짭짤한 이자 수익을 기대할 수 있죠.",
  loan: "대출 금리가 걱정되신다면, 정부 지원 서민 금융 상품이나 금리 인하 요구권을 적극적으로 활용해보세요. 작은 차이가 큰 이자 절감으로 이어질 수 있습니다.",
  insurance:
    "보험료가 부담된다면, 불필요한 특약을 줄이거나 다이렉트 보험으로 갈아타는 것을 고려해보세요. 보장 내용은 유지하면서 보험료를 낮출 수 있는 방법입니다.",
  stock:
    "주식 투자는 변동성이 크므로, 분산 투자를 통해 리스크를 관리하는 것이 중요합니다. 우량주 중심의 장기 투자나 ETF 상품을 눈여겨보세요.",
  default: [
    "금융 지식은 돈을 모으는 것만큼이나 지키는 데에도 중요합니다. 매일 조금씩 경제 뉴스를 읽고 금융 상식을 넓혀가세요.",
    "소비를 통제하는 가장 좋은 방법은 '선저축 후지출'입니다. 월급이 들어오면 저축액을 먼저 이체하고 남은 돈으로 생활하는 습관을 들이세요.",
    "신용점수는 현대 사회의 '금융 신분증'입니다. 연체 없이 꾸준히 관리하면 대출 금리 인하 등 실질적인 혜택을 누릴 수 있습니다.",
    "비상금 통장은 필수입니다. 갑작스러운 지출에 대비해 월 생활비의 3~6개월 치를 CMA나 파킹통장에 넣어두는 것이 좋습니다.",
    "보험은 '비용'이 아닌 '미래를 위한 투자'입니다. 하지만 중복 보장이나 불필요한 특약은 없는지 주기적으로 점검하는 '보험 다이어트'가 필요합니다.",
  ],
};

export const HIGH_VALUE_KEYWORDS = [
  "신용 점수 올리는 법",
  "소상공인 정책 자금",
  "버팀목 전세 자금 대출",
  "카드 포인트 현금화",
  "실손 보험 청구 방법",
  "증권사 수수료 비교",
  "자동차 보험료 계산",
  "주택 담보 대출 금리 비교",
  "무직자 소액 대출",
  "개인 회생 신청 자격",
  "숨은 보험금 찾기",
  "휴면 계좌 통합 조회",
];

export const getRandomFinancialTip = () => {
  const randomIndex = Math.floor(Math.random() * FINANCIAL_TIPS.length);
  return FINANCIAL_TIPS[randomIndex];
};

export const getBridgeContent = (quizType: string) => {
  let content: string | string[];

  // 퀴즈 타입에 '카드', '적금', '예금' 등의 키워드가 포함되어 있는지 확인하여 매핑
  if (quizType.includes("카드")) content = BRIDGE_CONTENT.card;
  else if (quizType.includes("적금") || quizType.includes("예금"))
    content = BRIDGE_CONTENT.deposit;
  else if (quizType.includes("대출")) content = BRIDGE_CONTENT.loan;
  else if (quizType.includes("보험")) content = BRIDGE_CONTENT.insurance;
  else if (quizType.includes("주식") || quizType.includes("증권"))
    content = BRIDGE_CONTENT.stock;
  else content = BRIDGE_CONTENT.default;

  if (Array.isArray(content)) {
    const randomIndex = Math.floor(Math.random() * content.length);
    return content[randomIndex];
  }

  return content;
};

export const DETAILED_FINANCIAL_ARTICLES: Record<
  string,
  { title: string; content: string[] }
> = {
  card: {
    title: "신용카드 리빌딩: 잠자는 포인트와 혜택, 어떻게 깨울까?",
    content: [
      "지갑 속에 잠들어 있는 신용카드, 단순히 결제 수단으로만 사용하고 계신가요? 매년 소멸되는 카드 포인트만 수천억 원에 달한다고 합니다. 지금 당장 '여신금융협회 카드포인트 통합조회'를 이용해 흩어진 포인트를 현금으로 전환해보세요.",
      "또한, 자신의 소비 패턴에 맞지 않는 카드를 계속 쓰고 있다면 '카드 리빌딩'이 필요합니다. 예를 들어, 통신비나 관리비 할인 혜택이 큰 카드로 교체하거나, 전월 실적 조건이 없는 '무실적 카드'를 서브 카드로 활용하는 전략이 유효합니다.",
      "연회비만 나가고 혜택은 못 받는 카드는 과감히 정리하고, 내 라이프스타일에 딱 맞는 혜택을 찾아 스마트한 소비 생활을 시작해보세요.",
    ],
  },
  deposit: {
    title: "예적금 금리 노마드족을 위한 고금리 상품 찾기 가이드",
    content: [
      "0.1%라도 더 높은 금리를 찾아 이동하는 '금리 노마드족'이 늘고 있습니다. 요즘은 저축은행뿐만 아니라 시중은행에서도 특판 상품을 통해 꽤 높은 금리를 제공하는 경우가 많습니다. '금융감독원 금융상품한눈에' 사이트를 활용하면 내 조건에 맞는 최적의 예적금 상품을 손쉽게 비교할 수 있습니다.",
      "특히 '파킹통장'은 하루만 맡겨도 이자가 붙어 비상금 관리에 유용하며, ISA(개인종합자산관리계좌)는 이자 소득에 대해 비과세 혜택을 제공하므로 목돈 마련에 필수적입니다. 단순히 주거래 은행만 고집하기보다, 손품을 조금만 팔면 연 수십만 원의 이자 수익 차이를 만들 수 있다는 점을 명심하세요.",
    ],
  },
  loan: {
    title: "금리 인하 요구권: 내 권리 당당하게 행사하는 법",
    content: [
      "대출을 이용 중이라면 '금리 인하 요구권'에 대해 꼭 알아두셔야 합니다. 이는 취업, 승진, 재산 증가, 신용점수 상승 등 신용 상태가 개선되었을 때 금융사에 금리 인하를 요구할 수 있는 법적 권리입니다. 시중은행뿐만 아니라 저축은행, 카드사, 보험사 등 제2금융권에서도 신청 가능합니다.",
      "신청 방법도 간단해져서 영업점 방문 없이 모바일 앱으로 증빙 서류를 제출하고 신청할 수 있는 경우가 많습니다. 물론 모든 신청이 받아들여지는 것은 아니지만, 밑져야 본전이라는 마음으로 주기적으로 나의 신용 상태를 점검하고 권리를 행사해보세요. 작은 실천이 매달 나가는 대출 이자를 줄이는 큰 힘이 될 수 있습니다.",
    ],
  },
  insurance: {
    title: "보험 다이어트: 불필요한 특약 줄이고 보장은 탄탄하게",
    content: [
      "매달 나가는 보험료가 부담스럽다면 무작정 해지하기보다 '보험 리모델링'을 고려해보세요. 중복 가입된 보장이 없는지, 갱신형 특약으로 인해 나중에 보험료가 급등할 위험은 없는지 꼼꼼히 따져봐야 합니다.",
      "실손의료비보험(실비)은 필수지만, 과도한 입원 일당이나 자잘한 수술비 특약은 가성비가 떨어질 수 있습니다. '내보험다보여' 같은 통합 조회 서비스를 통해 내가 가입한 보험 내역을 한눈에 파악하고, 전문가의 조언을 얻거나 다이렉트 보험으로 갈아타 보험료를 절약하는 방법도 있습니다. 보장 공백은 없애고 보험료 거품은 걷어내는 현명한 관리가 필요합니다.",
    ],
  },
  stock: {
    title: "투자의 첫걸음, ETF로 시작하는 현명한 자산 배분",
    content: [
      "주식 투자가 두렵다면 개별 종목 대신 ETF(상장지수펀드)로 시작해보는 건 어떨까요? ETF는 펀드처럼 여러 종목에 분산 투자하면서도 주식처럼 실시간으로 거래할 수 있는 장점이 있습니다. 코스피 200이나 S&P 500과 같은 시장 지수를 추종하는 인덱스 ETF는 장기적으로 시장 평균 수익률을 따라갈 수 있어 초보 투자자에게 적합합니다.",
      "또한 채권, 원자재, 리츠 등 다양한 자산군에 투자하는 ETF를 조합하여 나만의 포트폴리오를 구성하면 변동성 장세에서도 비교적 안정적인 수익을 기대할 수 있습니다. '계란을 한 바구니에 담지 말라'는 격언처럼, ETF를 활용한 자산 배분은 투자의 성공 확률을 높이는 지름길입니다.",
    ],
  },
  default: {
    title: "재테크의 기본, '통장 쪼개기'로 시작하는 돈 관리",
    content: [
      "돈을 모으고 싶지만 어디서부터 시작해야 할지 막막하다면 '통장 쪼개기'부터 실천해보세요. 월급 통장, 생활비 통장, 비상금 통장, 투자 통장 등 목적에 따라 통장을 분리하여 관리하는 것입니다. 월급이 들어오면 먼저 고정 지출과 저축액을 자동 이체하고, 남은 금액으로 생활하는 습관을 들이는 것이 중요합니다.",
      "특히 비상금 통장은 갑작스러운 지출에 대비해 월 생활비의 3~6개월 치를 넣어두는 것이 좋으며, 수시 입출금이 가능하면서도 매일 이자가 붙는 CMA나 파킹통장을 활용하는 것이 유리합니다. 통장 쪼개기는 불필요한 소비를 통제하고 자금 흐름을 한눈에 파악할 수 있게 해주는 재테크의 강력한 기초 체력입니다.",
    ],
  },
};

export const getDetailedArticle = (quizType: string) => {
  if (quizType.includes("카드")) return DETAILED_FINANCIAL_ARTICLES.card;
  if (quizType.includes("적금") || quizType.includes("예금"))
    return DETAILED_FINANCIAL_ARTICLES.deposit;
  if (quizType.includes("대출")) return DETAILED_FINANCIAL_ARTICLES.loan;
  if (quizType.includes("보험")) return DETAILED_FINANCIAL_ARTICLES.insurance;
  if (quizType.includes("주식") || quizType.includes("증권"))
    return DETAILED_FINANCIAL_ARTICLES.stock;

  return DETAILED_FINANCIAL_ARTICLES.default;
};
