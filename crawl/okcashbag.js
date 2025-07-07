const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const getOkcashbagQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "okcashbag";
  const getItem = await getQuizbells(type, todayDate);
  if (getItem === undefined) {
    let response = await axios.get(
      "https://www.bntnews.co.kr/article/search?searchText=오퀴즈"
    );
    const $ = cheerio.load(response.data);
    const articleItems = $("#list .text_box");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      const title = $(item).find(".title").text();

      const itemDate = title.replace("오퀴즈 정답 ", "");
      const todayDate = moment().format("M월 D일");

      if (todayDate === itemDate) {
        fullLink = `https://www.bntnews.co.kr${link}`;
        isOn = true;
      }
    }

    if (isOn) {
      // fullLink = "https://www.bntnews.co.kr/Economy/article/view/bnt202506260021";
      response = await axios.get(fullLink);
      const $ = cheerio.load(response.data);
      let content = $(".content");
      content.find("figure").remove();
      content.find(".googleBanner").remove();
      content.find("style").remove();
      content.find("img").remove();

      const lines = content
        .html()
        .split(/<br\s*\/?>/i)
        .map((line) => cheerio.load(line).text().trim());

      const quizzes = [];
      let currentType = "오퀴즈";
      let currentQuestion = "";
      let currentAnswer = "";

      lines.forEach((line, index) => {
        line = line.trim();

        // 문제 문장 추정
        if (line.includes("문제") && line.length > 10) {
          currentQuestion = line;
        }

        // 정답 추정
        const answerMatch = line.match(
          /['‘“]?([가-힣a-zA-Z0-9%]+)['’”]?\s*이다/
        );
        if (line.includes("정답") && answerMatch) {
          currentAnswer = answerMatch[1];

          // 문제와 정답 모두 있으면 퀴즈 항목으로 추가
          if (currentQuestion) {
            quizzes.push({
              type: currentType,
              question: currentQuestion,
              answer: currentAnswer,
              otherAnswers: [],
            });

            // 초기화
            currentQuestion = "";
            currentAnswer = "";
          }
        }
      });

      console.log("✅ 오케이캐시백 오퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));

      if (quizJson.length > 0) {
        insertQuizbells("okcashbag", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("okcashbag");
      }
    } else {
      console.log(
        `⏺️  [${moment().format(
          "YYYY-MM-DD"
        )}] 오케이캐시백 오퀴즈 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getOkcashbagQuiz };
