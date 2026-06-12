const getType = (title) => {
  if (title.includes("토스")) {
    return "toss";
  } else if (
    title.includes("오퀴즈") ||
    title.includes("오케이캐시백") ||
    title.includes("오케이캐쉬백") ||
    title.includes("ok캐시백") ||
    title.includes("ok캐쉬백")
  ) {
    return "okcashbag";
  } else if (title.includes("삼쩜삼")) {
    return "3o3";
  } else if (title.includes("신한") && title.includes("쏠")) {
    return "shinhan";
  } else if (title.includes("신한") && title.includes("SOL")) {
    return "shinhan";
  } else if (title.includes("신한")) {
    return "shinhan";
  } else if (title.includes("닥터나우")) {
    return "doctornow";
  } else if (title.includes("나만의닥터")) {
    return "mydoctor";
  } else if (
    title.includes("카카오뱅크") ||
    title.includes("카뱅") ||
    title.includes("이모지")
  ) {
    return "kakaobank";
  } else if (title.includes("카카오페이")) {
    return "kakaopay";
  } else if (
    title.includes("에이치") ||
    title.includes("H.Point") ||
    title.toLowerCase().includes("hpoint")
  ) {
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
    // 버그 수정: 기존에 kbank(케이뱅크)로 잘못 매핑되어 기후동행 정답이
    // 케이뱅크 페이지에 저장되고 있었음
    return "climate";
  } else if (title.includes("monimo") || title.includes("모니스쿨")) {
    return "monimo";
  } else if (title.includes("buzzvil") || title.includes("버즈빌")) {
    return "buzzvil";
  } else if (title.includes("리브메이트")) {
    return "livemate";
  } else if (title.includes("페이북")) {
    return "paybooc";
  } else if (title.includes("캐시슬라이드")) {
    return "cashslide";
  } else if (title.includes("발로소득")) {
    return "balso";
  }
};

const getTypeKr = (type) => {
  if (type === "toss") {
    return "토스";
  } else if (type === "okcashbag") {
    return "오케이캐시백";
  } else if (type === "3o3") {
    return "삼쩜삼";
  } else if (type === "shinhan") {
    return "신한퀴즈";
  } else if (type === "doctornow") {
    return "닥터나우";
  } else if (type === "mydoctor") {
    return "나만의닥터";
  } else if (type === "kakaobank") {
    return "카카오뱅크";
  } else if (type === "kakaopay") {
    return "카카오페이";
  } else if (type === "hpoint") {
    return "에이치포인트";
  } else if (type === "bitbunny") {
    return "비트버니";
  } else if (type === "nh") {
    return "농협";
  } else if (type === "skstoa") {
    return "스토아";
  } else if (type === "cashwalk") {
    return "캐시워크";
  } else if (type === "hanabank") {
    return "하나은행";
  } else if (type === "kbstar") {
    return "KB스타";
  } else if (type === "auction") {
    return "옥션";
  } else if (type === "cashdoc") {
    return "캐시닥";
  } else if (type === "kbank") {
    return "케이뱅크";
  } else if (type === "climate") {
    return "기후행동 기후동행 기회소득";
  } else if (type === "monimo") {
    return "모니스쿨";
  } else if (type === "buzzvil") {
    return "버즈빌";
  } else if (type === "livemate") {
    return "리브메이트";
  } else if (type === "paybooc") {
    return "페이북";
  } else if (type === "cashslide") {
    return "캐시슬라이드";
  } else if (type === "balso") {
    return "발로소득";
  } else {
    return type;
  }
};

module.exports = { getType, getTypeKr };
