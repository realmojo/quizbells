const { generateStockPost, generateAllPosts } = require("./generatePost");
const koreaCategories = require("./korea-categories.json");
const usCategories = require("./us-categories.json");

const MARKET = {
  KOREA: "korea",
  US: "us",
};

const getKstNow = () => {
  const now = new Date();
  const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  return new Date(kstString);
};

const determineMarket = (preferred) => {
  if (preferred && Object.values(MARKET).includes(preferred)) {
    return preferred;
  }

  const hour = getKstNow().getHours();
  // 한국: 09시 ~ 21시 59분 / 미국: 22시 ~ 익일 08시 59분
  if (hour >= 9 && hour < 22) {
    return MARKET.KOREA;
  }
  return MARKET.US;
};

const getCategoriesByMarket = (market) => {
  return market === MARKET.US ? usCategories : koreaCategories;
};

// 단일 종목 글 생성
const runSingle = async (market) => {
  const categories = getCategoriesByMarket(market);
  const category = categories[0];
  const result = await generateStockPost(
    category.code,
    category.name,
    category.wpCategoryId
  );
  console.log("\n📊 결과:", result);
  return result;
};

// 모든 종목 글 생성
const runAll = async (market) => {
  const categories = getCategoriesByMarket(market);
  console.log(
    `🚀 모든 종목 글 생성 시작... (시장: ${
      market === MARKET.US ? "미국" : "한국"
    })\n`
  );
  const results = await generateAllPosts(categories);

  console.log("\n📊 최종 결과:");
  results.forEach((result, idx) => {
    const category = categories[idx];
    if (result.success) {
      console.log(`✅ ${category.name}: ${result.url}`);
      console.log(
        `   추천: ${result.recommendation.emoji} ${result.recommendation.grade}`
      );
    } else {
      console.log(`❌ ${category.name}: 실패 - ${result.error}`);
    }
  });
  return results;
};

// 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0];
  const marketArg = args[1]?.toLowerCase();
  const market = determineMarket(marketArg);

  console.log(
    `⏱️ 현재 한국 시간: ${getKstNow().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    })}`
  );
  console.log(`🌐 선택된 시장: ${market === MARKET.US ? "미국" : "한국"}`);

  if (mode === "all") {
    runAll(market);
  } else {
    runSingle(market);
  }
}

module.exports = { runSingle, runAll, determineMarket };
