const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const getCashworkQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "cashwalk";
  const getItem = await getQuizbells(type, todayDate);
  if (getItem === undefined) {
    let response = await axios.get(
      "https://www.bntnews.co.kr/article/search?searchText=캐시워크"
    );
    const $ = cheerio.load(response.data);
    const articleItems = $("#list .text_box");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      const title = $(item).find(".title").text();

      const itemDate = title.replace("[단독] 캐시워크 돈버는퀴즈 정답 ", "");
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
      let currentQuiz = {};

      for (const line of lines) {
        // 문제 탐색
        if (line.includes("캐시워크 돈버는퀴즈 문제")) {
          const [type, questionPart] = line.split(" 캐시워크 돈버는퀴즈 문제 ");
          currentQuiz = {
            type: type.trim(),
            question: questionPart.trim(),
            answer: "",
            otherAnswers: [],
          };
        }

        // 정답 탐색
        const answerMatch = line.match(/퀴즈 정답은 ['"](.+?)['"]이다/);
        if (answerMatch && currentQuiz) {
          currentQuiz.answer = answerMatch[1];
        }

        // 다른 정답 탐색
        const othersMatch = line.match(/다른 정답은 ['"]?(.+?)['"]?\./);
        if (othersMatch && currentQuiz) {
          currentQuiz.otherAnswers = othersMatch[1]
            .split(",")
            .map((s) => s.trim());
          quizzes.push(currentQuiz); // 완료된 퀴즈만 push
          currentQuiz = {}; // 초기화
        }

        // 정답만 있고 다른 정답이 없는 경우
        if (
          answerMatch &&
          !line.includes("다른 정답은") &&
          currentQuiz.answer &&
          currentQuiz.type
        ) {
          quizzes.push(currentQuiz);
          currentQuiz = {};
        }
      }

      console.log(quizzes);
      console.log("✅ 캐시워크 퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));

      if (quizzes.length > 0) {
        insertQuizbells("cashwalk", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("cashwalk");
      }
    } else {
      console.log(
        `⏺️  [${moment().format(
          "YYYY-MM-DD"
        )}] 캐시워크 퀴즈 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getCashworkQuiz };
