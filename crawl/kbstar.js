const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const extractQuizData = (text) => {
  const result = [];

  // 1. 퀴즈 블록을 [KB Pay 오늘의퀴즈] / [KB스타뱅킹 스타퀴즈] 기준으로 나눈다
  // ✅ KB Pay 퀴즈 정규식
  const kbpayRegex =
    /\[KB Pay 오늘의[ \u200e]*퀴즈\]\s*([\s\S]*?)\s*정답은\s*['"‘“]?(.+?)['"’”]?\s*(?:이다|다|입니다)[.。]/;

  // ✅ KB스타뱅킹 퀴즈: "정답은 'O'다." 또는 "정답은 'O'이다."
  const kbstarRegex =
    /\[KB스타뱅킹 스타퀴즈\]\s*([\s\S]*?)\s*정답은\s*['"‘“]?(.+?)['"’”]?\s*(?:이다|다|입니다)[.。]/;

  const kbpayMatch = text.match(kbpayRegex);
  if (kbpayMatch) {
    result.push({
      type: "kbpay",
      question: kbpayMatch[1].trim(),
      answer: kbpayMatch[2].trim(),
      otherAnswers: [],
    });
  }

  const kbstarMatch = text.match(kbstarRegex);
  if (kbstarMatch) {
    result.push({
      type: "kbstar",
      question: kbstarMatch[1].trim(),
      answer: kbstarMatch[2].trim(),
      otherAnswers: [],
    });
  }

  return result;
};

const getKbstarQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "kbstar";
  const getItem = await getQuizbells(type, todayDate);
  if (getItem === undefined) {
    const formData = new URLSearchParams();
    formData.append("sc_area", "A");
    formData.append("view_type", "sm");
    formData.append("sc_word", "KB스타뱅킹");

    let response = await axios.post(
      "https://www.job-post.co.kr/news/articleList.html",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const $ = cheerio.load(response.data);
    const articleItems = $(".article-list-content .list-titles");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      let title = $(item).find("a").text();
      title = title.replace("[N잡 앱테크] KB Pay, ", "");
      const itemDate = title.replace(
        " 'KB스타뱅킹 스타퀴즈' 오늘의 퀴즈 정답",
        ""
      );
      const todayDate = moment().format("M월 D일");
      if (todayDate === itemDate) {
        fullLink = `https://www.job-post.co.kr${link}`;
        isOn = true;
      }
    }

    if (isOn) {
      // fullLink = "https://www.bntnews.co.kr/Economy/article/view/bnt202506260021";
      response = await axios.get(fullLink);
      const $ = cheerio.load(response.data);
      let content = $("#article-view-content-div");
      content.find("figure").remove();
      content.find("div").remove();
      content.find(".googleBanner").remove();
      content.find("style").remove();
      content.find("img").remove();

      const lines = content
        .html()
        .split(/<br\s*\/?>/i)
        .map((line) => cheerio.load(line).text().trim())
        .join("\n");

      console.log(lines);
      const quizzes = await extractQuizData(lines);

      console.log(quizzes);
      console.log("✅ KB스타 퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));

      if (quizzes.length > 0) {
        insertQuizbells("kbstar", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("kbstar");
      }
    } else {
      console.log(
        `⏺️  [${moment().format(
          "YYYY-MM-DD"
        )}] KB스타 퀴즈 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getKbstarQuiz };
