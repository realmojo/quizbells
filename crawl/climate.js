const axios = require("axios");
const moment = require("moment");

const {
  insertQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
} = require("./db");

const getType = (title) => {
  if (title.includes("기후행동")) {
    return "climate";
  }
  // } else if (title.includes("오퀴즈")) {
  //   return "okcashbag";
  // } else if (title.includes("삼쩜삼")) {
  //   return "3o3";
  // } else if (title.includes("쏠퀴즈")) {
  //   return "shinhan";
  // } else if (title.includes("닥터나우")) {
  //   return "doctornow";
  // } else if (title.includes("나만의닥터")) {
  //   return "mydoctor";
  // } else if (title.includes("카카오뱅크")) {
  //   return "kakaobank";
  // } else if (title.includes("에이치")) {
  //   return "hpoint";
  // } else if (title.includes("농협")) {
  //   return "nh";
  // } else if (title.includes("비트버니")) {
  //   return "bitbunny";
  // } else if (title.includes("하나원큐")) {
  //   return "hana";
  // } else if (title.includes("농협")) {
  //   return "nh";
  // }
};

const doInsert = async (quizzes, type) => {
  if (quizzes.length > 0) {
    const getItem = await getQuizbells(type, moment().format("YYYY-MM-DD"));
    if (getItem === undefined) {
      console.log(
        `✅ [${moment().format("YYYY-MM-DD")}] ${type} 퀴즈 크롤링 완료`
      );
      const quizJson = escapeSQLString(JSON.stringify(quizzes));
      insertQuizbells(type, quizJson, moment().format("YYYY-MM-DD"));
      alarmNotify(type);
    } else {
      console.log(
        `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
      );
    }
  }
};

const extractClimateQuizFromText = async (title, text, type) => {
  const question = title.split("_")[1];

  const answerRegex = /퀴즈\s*정답은\s*[:：]?\s*(O|X)/i;
  const answerMatch = text.match(answerRegex);
  const answer = answerMatch ? answerMatch[1].toUpperCase() : null;

  if (!question || !answer) return null;

  const quizzes = [
    {
      type: "기후행동 기회소득",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const getClimateQuiz = async () => {
  const url =
    "https://m.blog.naver.com/api/blogs/zetaland/post-list?categoryNo=0&itemCount=24&page=1";
  const headers = {
    Referer: "https://m.blog.naver.com/zetaland?tab=1",
  };

  const {
    data: {
      result: { items },
    },
  } = await axios.get(url, { headers });

  const today1 = moment().format("M월 D일");
  const today2 = moment().format("M월D일");

  let quizItems = items.map((post) => {
    return {
      title: post.titleWithInspectMessage,
      content: post.briefContents,
      type: getType(post.titleWithInspectMessage),
    };
  });

  quizItems = quizItems.filter((post) => {
    if (
      (post.title.includes(today1) || post.title.includes(today2)) &&
      post.content.includes("정답은")
    ) {
      return true;
    }
  });

  for (const post of quizItems) {
    const { title, content, type } = post;

    if (type === "climate") {
      await extractClimateQuizFromText(title, content, type);
    }
    // if (type === "3o3") {
    //   await extract3o3QuizFromText(content, type);
    // } else if (type === "doctornow") {
    //   await extractDoctornowQuizFromText(content, type);
    // } else if (type === "mydoctor") {
    //   await extractMydoctorQuizFromText(content, type);
    // } else if (type === "kakaobank") {
    //   await extractKakaobankQuizFromText(content, type);
    // } else if (type === "hpoint") {
    //   await extractHpointQuizFromText(content, type);
    // }
  }

  // fs.writeFileSync("./veil8000.json", JSON.stringify(quizItems, null, 2));

  // console.log(quizItems);
};

module.exports = { getClimateQuiz };
