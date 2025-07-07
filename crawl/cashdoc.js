const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const getAnswerFromLine = (line) => {
  const match = line.match(/퀴즈 정답은\s*['“‘"]?(.+?)['”’"]?이다/);
  return match ? match[1].trim() : null;
};

const getOtherAnswers = (line) => {
  const match = line.match(/다른 정답은\s*['“‘"]?(.+?)['”’"]?이다/);
  if (!match) return [];
  return match[1].split(",").map((s) => s.trim());
};

const getCashdocQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "cashdoc";
  const getItem = await getQuizbells(type, todayDate);
  if (getItem === undefined) {
    let response = await axios.get(
      "https://www.bntnews.co.kr/article/search?searchText=캐시닥"
    );
    const $ = cheerio.load(response.data);
    const articleItems = $("#list .text_box");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      const title = $(item).find(".title").text();

      const itemDate = title
        .replace("캐시닥 용돈퀴즈 정답 ", "")
        .replace("[단독]", "")
        .trim();
      const todayDate = moment().format("M월 D일");
      if (todayDate === itemDate) {
        fullLink = `https://www.bntnews.co.kr${link}`;
        isOn = true;
      }
    }

    if (isOn) {
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
      let current = null;
      let accumulating = false;

      const getAnswerFromLine = (line) => {
        const match = line.match(/퀴즈 정답은\s*['“‘"]?(.+?)['”’"]?이다/);
        return match ? match[1].trim() : null;
      };

      const getOtherAnswers = (line) => {
        const match = line.match(/다른 정답은\s*['“‘"]?(.+?)['”’"]?이다/);
        if (!match) return [];
        return match[1].split(",").map((s) => s.trim());
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === "") continue;

        if (line.includes("용돈퀴즈")) {
          // "관절스타 용돈퀴즈 보스웰리아는..." → type: 관절스타, question: 나머지
          const splitIndex = line.indexOf("용돈퀴즈");
          const type = line.slice(0, splitIndex).trim();
          const question = line.slice(splitIndex + "용돈퀴즈".length).trim();

          current = {
            type,
            question: question || "",
            answer: "",
            otherAnswers: [],
          };

          accumulating = true;
        } else if (line.startsWith("퀴즈 정답은")) {
          const answer = getAnswerFromLine(line);
          if (current && answer) current.answer = answer;
          accumulating = false;
        } else if (line.startsWith("다른 정답은")) {
          const others = getOtherAnswers(line);
          if (current) current.otherAnswers = others;
        } else if (current && accumulating && !line.startsWith("퀴즈 정답은")) {
          // 문제 텍스트 계속 이어붙임
          current.question += (current.question ? " " : "") + line;
        }

        // 퀴즈 완료되면 저장
        if (
          current &&
          current.answer &&
          (!lines[i + 1] || lines[i + 1].includes("용돈퀴즈"))
        ) {
          quizzes.push(current);
          current = null;
          accumulating = false;
        }
      }
      console.log(quizzes);
      console.log("✅ 캐시닥 용돈퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));

      if (quizzes.length > 0) {
        insertQuizbells("cashdoc", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("cashdoc");
      }
    } else {
      console.log(
        `⏺️  [${moment().format("YYYY-MM-DD")}] 캐시닥 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getCashdocQuiz };
