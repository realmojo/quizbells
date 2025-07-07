const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const extractQuizData = (lines) => {
  // 🔍 퀴즈 문제 추출
  const questionMatch = lines.match(/퀴즈 문제는\s+‘([^’]+)’/);
  const question = questionMatch ? questionMatch[1].trim() : null;

  // ✅ 정답 추출
  const answerMatch = lines.match(/정답은.*?[‘|']([^’']+)[’|']/);
  const answer = answerMatch ? answerMatch[1].trim() : null;

  // 📦 결과 포맷
  const result = [];

  if (question && answer) {
    result.push({
      type: "비트버니",
      question,
      answer,
      otherAnswers: [],
    });
  }
  return result;
};

const fetchBitbunny = async (link) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(link, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json(); // JSON인 경우만 파싱
      return data;
    } else {
      const text = await response.text(); // HTML, XML 등 다른 형식은 텍스트로 받기
      return text;
    }
  } catch (error) {
    console.error("에러 발생:", error.message);
  }
};

const getBitbunnyQuiz = async () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const type = "bitbunny";
  const getItem = await getQuizbells(type, todayDate);
  if (getItem === undefined) {
    const response = await fetchBitbunny(
      "https://prt.namdonews.com/engine_yonhap/search.php?searchword=비트버니"
    );

    const $ = cheerio.load(response);
    const articleItems = $(".contents .title");

    let fullLink = "";
    let isOn = false;
    for (const item of articleItems) {
      const link = $(item).find("a").attr("href");
      let title = $(item).find("a").text();
      title = title.replace("비트버니 퀴즈 ", "");

      const itemDate = title.replace("정답은", "").trim();
      const todayDate = moment().format("M월 D일");
      if (todayDate === itemDate) {
        fullLink = link;
        isOn = true;
      }
    }
    console.log(fullLink);

    if (isOn) {
      const response = await fetchBitbunny(fullLink);
      const $ = cheerio.load(response);
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
      console.log("✅ 비트버니 퀴즈 크롤링 완료");
      const quizJson = escapeSQLString(JSON.stringify(quizzes));
      if (quizzes.length > 0) {
        insertQuizbells("bitbunny", quizJson, moment().format("YYYY-MM-DD"));
        alarmNotify("bitbunny");
      }
    } else {
      console.log(
        `⏺️  [${moment().format(
          "YYYY-MM-DD"
        )}] 비트버니 퀴즈 아직 존재하지 않습니다.`
      );
    }
  } else {
    console.log(
      `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
    );
  }
};

module.exports = { getBitbunnyQuiz };
