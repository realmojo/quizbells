const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

function extractQuizData(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const quizTypes = {
    "신한SOL뱅크 쏠퀴즈": "신한쏠퀴즈",
    "신한SOL페이 퀴즈팡팡": "쏠페이 퀴즈팡팡",
    "신한슈퍼SOL 출석퀴즈": "신한슈퍼SOL 출석퀴즈",
  };

  const quizzes = [];
  let currentType = "";
  let currentQuestion = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // type 식별
    if (quizTypes[line]) {
      currentType = quizTypes[line];
      currentQuestion = "";
      continue;
    }

    // 문제(question) 식별
    if (line.startsWith("신한SOL뱅크 쏠퀴즈 문제")) {
      currentType = "신한쏠퀴즈";
      currentQuestion = line.replace("신한SOL뱅크 쏠퀴즈 문제", "").trim();
      continue;
    }

    // 정답(answer) 식별
    const answerMatch = line.match(/정답은\s['"](.+?)['"]이다\./);
    if (answerMatch && currentType) {
      let questionText = currentQuestion;

      // 명시된 문제가 없는 경우 기본 문제 생성
      if (!questionText) {
        questionText = `${currentType} ${lines[i - 1] || ""}`.trim();
        if (!questionText.includes("문제")) {
          questionText = `${currentType}의 오늘의 퀴즈 정답은?`;
        }
      }

      quizzes.push({
        type: currentType,
        question: questionText,
        answer: answerMatch[1],
        otherAnswers: [],
      });

      // 초기화
      currentQuestion = "";
    }
  }

  return quizzes;
}

const getShinhanQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "shinhan";
  const getItem = await getQuizbells(type, todayDate);

  if (getItem === undefined) {
    let response = await axios.get(
      "https://www.bntnews.co.kr/article/search?searchText=쏠퀴즈"
    );
    const $ = cheerio.load(response.data);
    const articleItems = $("#list .text_box");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      const title = $(item).find(".title").text();

      const itemDate = title.replace("쏠퀴즈 정답 ", "");
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
        .map((line) => cheerio.load(line).text().trim())
        .join("\n");

      const quizzes = extractQuizData(lines);

      console.log(quizzes);
      console.log("✅ 신한은행 쏠퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));

      if (quizJson.length > 0) {
        insertQuizbells("shinhan", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("shinhan");
      }
    } else {
      console.log(
        `⏺️  [${moment().format(
          "YYYY-MM-DD"
        )}] 신한은행 쏠퀴즈 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getShinhanQuiz };
