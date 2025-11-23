const { generateStockPost, generateAllPosts } = require("./generatePost");
const categories = require("./categories");

// 단일 종목 글 생성
const runSingle = async () => {
  const category = categories[0]; // 첫 번째 종목 (삼성전자)
  const result = await generateStockPost(
    category.code,
    category.name,
    category.wpCategoryId
  );
  console.log("\n📊 결과:", result);
};

// 모든 종목 글 생성
const runAll = async () => {
  console.log("🚀 모든 종목 글 생성 시작...\n");
  const results = await generateAllPosts();

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
};

// 실행
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === "all") {
    runAll();
  } else {
    runSingle();
  }
}

module.exports = { runSingle, runAll };
