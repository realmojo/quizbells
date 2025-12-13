const axios = require("axios");
const moment = require("moment-timezone");
const cheerio = require("cheerio");
// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  return moment().tz("Asia/Seoul");
};

const { doInsert } = require("./db");

const getClimateQuiz = async () => {
  const url =
    "https://bookshelf-journey.tistory.com/entry/%EA%B8%B0%ED%9B%84%ED%96%89%EB%8F%99-%EA%B8%B0%ED%9A%8C%EC%86%8C%EB%93%9D-%EC%98%A4%EB%8A%98%EC%9D%98-%ED%80%B4%EC%A6%88-%ED%80%B4%EC%A6%88%EB%A5%BC-%ED%92%80%EA%B3%A0-%EA%B8%B0%ED%9A%8C%EC%86%8C%EB%93%9D%EB%A6%AC%EC%9B%8C%EB%93%9C";

  const res = await axios.get(url);

  const $ = cheerio.load(res.data);

  const title = $("h1").text();
  const answer = $("[data-ke-style='style1'] > b > span:eq(1)").text();

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  let quizzes = null;

  if (title.includes(today1) || title.includes(today2)) {
    quizzes = [
      {
        type: "기후행동퀴즈 기후동행퀴즈 기회소득",
        question: `기후행동 기회소득 ${today1} 오늘의 퀴즈 문제`,
        answer: answer,
        otherAnswers: [],
      },
    ];
  }

  if (quizzes.length > 0) {
    await doInsert(quizzes, "climate", new Set());
  }
};

module.exports = { getClimateQuiz };
