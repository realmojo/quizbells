const axios = require("axios");
const moment = require("moment-timezone");

// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  return moment().tz("Asia/Seoul");
};

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
};

const doInsert = async (quizzes, type) => {
  if (quizzes.length > 0) {
    const getItem = await getQuizbells(type, getKoreaTime().format("YYYY-MM-DD"));
    if (getItem === undefined || getItem === null) {
      console.log(
        `✅ [${getKoreaTime().format("YYYY-MM-DD")}] ${type} 퀴즈 크롤링 완료`
      );
      const quizJson = escapeSQLString(JSON.stringify(quizzes));
      await insertQuizbells(type, quizJson, getKoreaTime().format("YYYY-MM-DD"));
      await alarmNotify(type);
    } else {
      console.log(
        `✅ [${getKoreaTime().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
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

  console.log(quizzes);
  await doInsert(quizzes, type);
};

const getClimateQuiz = async () => {
  const url =
    "https://m.blog.naver.com/api/blogs/zetaland/post-list?categoryNo=0&itemCount=10&page=1";
  const headers = {
    Referer: "https://m.blog.naver.com/zetaland?tab=1",
  };

  const {
    data: {
      result: { items },
    },
  } = await axios.get(url, { headers });

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");
  // const today2 = "11월 20일";

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
      post.content.includes("정답")
    ) {
      return true;
    }
  });

  for (const post of quizItems) {
    const { title, content, type } = post;

    if (type === "climate") {
      await extractClimateQuizFromText(title, content, type);
    }
  }

  // fs.writeFileSync("./veil8000.json", JSON.stringify(quizItems, null, 2));

  // console.log(quizItems);
};

module.exports = { getClimateQuiz };
