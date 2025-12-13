const axios = require("axios");
const moment = require("moment-timezone");
const cheerio = require("cheerio");

// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  return moment().tz("Asia/Seoul");
};

const { doInsert } = require("./db");

const getBntNews = async () => {
  console.log("BNT News 토스 행운퀴즈 크롤링 시작");
  const url =
    "https://www.bntnews.co.kr/article/search?searchText=%ED%86%A0%EC%8A%A4+%ED%96%89%EC%9A%B4%ED%80%B4%EC%A6%88";

  const {
    data
  } = await axios.get(url);

  const $ = cheerio.load(data);

  const firstTitle = $("h4.title").html();
  const aLink = $("h4.title").parent().attr("href");

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  if(firstTitle.includes(today1) || firstTitle.includes(today2)) {

    const bntNewsUrl = `https://www.bntnews.co.kr${aLink}`;
    const bntNewsResponse = await axios.get(bntNewsUrl);

    const $ = cheerio.load(bntNewsResponse.data);
    const content = $("div.content").html() || "";
    
    // <strong>질문</strong><br /><strong>정답 - ...</strong> 패턴 찾기
    const quizPattern = /<strong>([^<]+)<\/strong><br\s*\/?><strong>(정답\s*-\s*[^<]+)<\/strong>/g;
    const quizzes = [];
    
    let match;
    while ((match = quizPattern.exec(content)) !== null) {
      const question = match[1].trim();
      const answer = match[2].trim(); // "정답 - 방문완료, 10000, 500000" 전체 포함
      
      if (question && answer) {
        quizzes.push({
          type: "토스 행운퀴즈",
          question: question,
          answer: answer.replace("정답 - ", ""),
          otherAnswers: [],
        });
      }
    }

    if (quizzes.length > 0) {
      await doInsert(quizzes, "toss", new Set());
    } else {
      console.log("퀴즈를 찾을 수 없습니다.");
    }

  } else {
    console.log("오늘 날짜가 아닙니다.");
  }
};

module.exports = { getBntNews };
