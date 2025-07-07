const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
  findNewQuizzes,
  updateQuizbells,
  doInsert,
} = require("./db");

const getTossQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "toss";
  const getItem = await getQuizbells(type, todayDate);
  // if (getItem === undefined) {
  let response = await axios.get(
    "https://www.bntnews.co.kr/article/search?searchText=행운퀴즈"
  );
  const $ = cheerio.load(response.data);
  const articleItems = $("#list .text_box");

  let fullLink = "";
  let isOn = true;
  for (const item of articleItems) {
    const link = $(item).find("a").attr("href");
    const title = $(item).find(".title").text();

    const itemDate = title.replace("토스 행운퀴즈 정답 ", "");
    const todayDate = moment().format("M월 D일");

    if (todayDate === itemDate) {
      fullLink = `https://www.bntnews.co.kr${link}`;
      isOn = true;
    }
  }

  if (isOn && fullLink) {
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

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("정답 -")) {
        const answer = line.replace("정답 -", "").trim();
        const question = lines[i - 1]?.trim();

        if (question && answer) {
          quizzes.push({
            type: "토스 행운퀴즈",
            question,
            answer,
            otherAnswers: [],
          });
        }
      }
    }

    doInsert(quizzes, type);
  } else {
    console.log(
      `⏺️  [${moment().format(
        "YYYY-MM-DD"
      )}] 토스 행운퀴즈 아직 존재하지 않습니다.`
    );
  }
  // console.log(
  //   `✅ [${moment().format("YYYY-MM-DD")}] 토스 행운퀴즈 이미 존재 합니다.`
  // );
  // }
};

module.exports = { getTossQuiz };
