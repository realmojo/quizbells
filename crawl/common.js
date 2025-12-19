export const getType = (title) => {
  if (title.includes("토스")) {
    return "toss";
  } else if (title.includes("오퀴즈")) {
    return "okcashbag";
  } else if (title.includes("삼쩜삼")) {
    return "3o3";
  } else if (title.includes("신한") && title.includes("쏠")) {
    return "shinhan";
  } else if (title.includes("신한") && title.includes("SOL")) {
    return "shinhan";
  } else if (title.includes("닥터나우")) {
    return "doctornow";
  } else if (title.includes("나만의닥터")) {
    return "mydoctor";
  } else if (title.includes("카카오뱅크")) {
    return "kakaobank";
  } else if (title.includes("카카오페이")) {
    return "kakaopay";
  } else if (title.includes("에이치") || title.includes("H.Point")) {
    return "hpoint";
  } else if (title.includes("비트버니")) {
    return "bitbunny";
  } else if (title.includes("농협") || title.includes("디깅")) {
    return "nh";
  } else if (title.includes("스토아")) {
    return "skstoa";
  } else if (title.includes("캐시워크")) {
    return "cashwalk";
  } else if (title.includes("하나은행") || title.includes("하나원큐")) {
    return "hanabank";
  } else if (
    title.includes("KB스타") ||
    title.includes("KB페이") ||
    title.includes("KB")
  ) {
    return "kbstar";
  } else if (title.includes("옥션")) {
    return "auction";
  } else if (title.includes("캐시닥")) {
    return "cashdoc";
  } else if (title.includes("케이뱅크")) {
    return "kbank";
  } else if (
    title.includes("기후행동") ||
    title.includes("기후동행") ||
    title.includes("기회소득")
  ) {
    return "kbank";
  } else if (title.includes("monimo") || title.includes("모니스쿨")) {
    return "monimo";
  }
};
