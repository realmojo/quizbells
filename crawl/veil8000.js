const axios = require("axios");
const moment = require("moment");

const { doInsert } = require("./db");

const getType = (title) => {
  if (title.includes("토스")) {
    return "toss";
  } else if (title.includes("오퀴즈")) {
    return "okcashbag";
  } else if (title.includes("삼쩜삼")) {
    return "3o3";
  } else if (title.includes("신한")) {
    return "shinhan";
  } else if (title.includes("닥터나우")) {
    return "doctornow";
  } else if (title.includes("나만의닥터")) {
    return "mydoctor";
  } else if (title.includes("카카오뱅크")) {
    return "kakaobank";
  } else if (title.includes("카카오페이")) {
    return "kakaopay";
  } else if (title.includes("에이치")) {
    return "hpoint";
  } else if (title.includes("농협")) {
    return "nh";
  } else if (title.includes("비트버니")) {
    return "bitbunny";
  } else if (title.includes("농협")) {
    return "nh";
  } else if (title.includes("스토아")) {
    return "skstoa";
  } else if (title.includes("캐시워크")) {
    return "cashwalk";
  } else if (title.includes("하나은행") || title.includes("하나원큐")) {
    return "hanabank";
  } else if (title.includes("KB스타") || title.includes("KB페이")) {
    return "kbstar";
  } else if (title.includes("옥션")) {
    return "auction";
  } else if (title.includes("캐시닥")) {
    return "cashdoc";
  }
};

const extract3o3QuizFromText = async (text, type) => {
  const regex = /퀴즈\s(.+?)\sO\sX/i; // "퀴즈 소득세는 ~ O X" 형태를 캡처
  const answerRegex = /정답은\s([OX])/i; // "정답은 O" 또는 "정답은 X"

  const match = text.match(regex);
  const answerMatch = text.match(answerRegex);

  const question = match ? match[1].trim() : null;
  const answer = answerMatch ? answerMatch[1] : null;

  if (!question || !answer) return null;

  const quizzes = [
    {
      type: "3o3",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractDoctornowQuizFromText = async (text, type) => {
  // 질문 추출: "O X"가 붙은 문장 중 하나를 질문으로 가정
  const questionRegex = /([^\n]+?O\s*X)/i;
  const questionMatch = text.match(questionRegex);
  const question = questionMatch ? questionMatch[1].trim() : null;

  // 정답 추출: "정답은 O" 형식
  const answerRegex = /정답은\s*([OX])/i;
  const answerMatch = text.match(answerRegex);
  const answer = answerMatch ? answerMatch[1].toUpperCase() : null;

  const quizzes = [
    {
      type: "닥터나우",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractMydoctorQuizFromText = async (text, type) => {
  const questionMatch = text.match(/([^\n.]+[?\.])\s*O\s+[^\s]+\s+X\s+[^\s]+/);
  const question = questionMatch ? questionMatch[1].trim() : "";

  const answerMatch = text.match(/정답은\s+(O|X)\s*([^\s]+)/);
  const answer = answerMatch ? `${answerMatch[1]} ${answerMatch[2]}` : "";

  const quizzes = [
    {
      type: "건강퀴즈",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractHpointQuizFromText = async (title, text, type) => {
  const question = title.split("!")[1].trim();

  const answerRegex = /정답은\s*[:：]?\s*([가-힣a-zA-Z0-9]+)/i;
  const answerMatch = text.match(answerRegex);
  const answer = answerMatch ? answerMatch[1].toUpperCase() : null;

  if (!question || !answer) return null;

  const quizzes = [
    {
      type: "H.Point",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractKakaopayQuizFromText = async (title, text, type) => {
  const question = title.split("!")[1].trim();

  const answerRegex = /정답은\s*[:：]?\s*([가-힣a-zA-Z0-9]+)/i;
  const answerMatch = text.match(answerRegex);
  const answer = answerMatch ? answerMatch[1].toUpperCase() : null;

  if (!question || !answer) return null;

  const quizzes = [
    {
      type: "퀴즈타임",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractShinhanQuizFromText = async (title, text, type) => {
  let quizType = "";

  if (title.includes("출석퀴즈") || text.includes("출석퀴즈")) {
    quizType = "출석퀴즈";
  } else if (title.includes("퀴즈팡팡") || text.includes("퀴즈팡팡")) {
    quizType = "퀴즈팡팡";
  } else if (title.includes("야구") || text.includes("야구")) {
    quizType = "야구상식";
  }

  // 1. 문제 문장 추출
  const questionMatch = text.match(/([^\n]+?\?)/);
  const question = questionMatch ? questionMatch[1].trim() : "";

  // ✅ 2. 정답 추출 개선
  const answerMatch = text.match(/정답은\s+([^\n#]+)/);
  const answer = answerMatch ? answerMatch[1].trim() : null;

  const quizzes = [
    {
      type: quizType,
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractSkstoaQuizFromText = async (title, text, type) => {
  const question = title.split("!")[1].trim();

  // ✅ 2. 정답 추출 개선
  const answerMatch = text.match(/정답은\s+([^\n#]+)/);
  const answer = answerMatch ? answerMatch[1].trim() : null;

  const quizzes = [
    {
      type: "퀴즈타임",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractOkcashbagQuizFromText = async (title, text, type) => {
  let titles = title.split("정답");

  if (titles[1].length < 6) {
    question = titles[1].trim();
  } else {
    question = titles[0].trim();
  }

  // ✅ 2. 정답 추출 개선
  const answerMatch = text.match(/정답은\s+([^\n#]+)/);
  const answer = answerMatch ? answerMatch[1].trim() : null;

  const quizzes = [
    {
      type: "오퀴즈",
      question,
      answer,
      otherAnswers: [],
    },
  ];

  await doInsert(quizzes, type);
};

const extractKakaobankQuizFromText = async (title, text, type) => {
  const titleSplits = title.split("정답!");
  if (titleSplits.length > 1) {
    const question = titleSplits[1].trim();

    // ✅ 2. 정답 추출 개선
    const answerMatch = text.match(/정답은\s+([^\n#]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : null;

    if (answer.length < 100) {
      // 너무 길면 오류임
      const quizzes = [
        {
          type: "카카오뱅크",
          question,
          answer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type);
    }
  }
};

const extractCashwalkQuizFromText = async (title, text, type) => {
  const titleSplits = title.split("정답 ");
  if (titleSplits.length > 1) {
    const question = titleSplits[1].trim();

    // ✅ 2. 정답 추출 개선
    const answerMatch = text.match(/정답은\s+([^\n#]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : null;

    if (answer.length < 100) {
      // 너무 길면 오류임
      const quizzes = [
        {
          type: "캐시워크",
          question,
          answer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type);
    }
  }
};

const extractHanabankQuizFromText = async (title, text, type) => {
  const titleSplits = title.split("정답!");
  if (titleSplits.length > 1) {
    const question = titleSplits[1].trim();

    // ✅ 2. 정답 추출 개선
    const answerMatch = text.match(/정답은\s+([^\n#]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : null;

    if (answer.length < 100) {
      // 너무 길면 오류임
      const quizzes = [
        {
          type: "하나원큐",
          question,
          answer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type);
    }
  }
};

const extractKbstQuizFromText = async (title, text, type) => {
  const titleSplits = title.split("정답!");
  if (titleSplits.length > 1) {
    const question = titleSplits[1].trim();

    // ✅ 2. 정답 추출 개선
    const answerMatch = text.match(/정답은\s+([^\n#]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : null;

    if (answer.length < 100) {
      // 너무 길면 오류임
      const quizzes = [
        {
          type: title.includes("KB스타") ? "KB스타" : "KB페이",
          question,
          answer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type);
    }
  }
};

const extractAuctionQuizFromText = async (title, text, type) => {
  const titleSplits = title.split("정답!");
  if (titleSplits.length > 1) {
    const question = titleSplits[1].trim();

    // ✅ 2. 정답 추출 개선
    const answerMatch = text.match(/정답은\s+([^\n#]+)/);
    let answer = answerMatch ? answerMatch[1].trim() : null;

    const realAnswerMatch = answer.match(/정답은\s+([^\n#]+)/);
    let realAnswer = realAnswerMatch ? realAnswerMatch[1].trim() : null;

    answer = realAnswer ? realAnswer : answer;

    if (answer.length < 100) {
      // 너무 길면 오류임
      const quizzes = [
        {
          type: "매일퀴즈",
          question,
          answer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type);
    }
  }
};

const extractCashdocQuizFromText = async (title, text, type) => {
  let titles = title.split("정답");

  if (titles[1].length < 6) {
    question = titles[0].trim(); // 날짜가 뒤로오는 경우
  } else {
    question = titles[1].trim(); // 날짜가 앞에 질문이 뒤에 오는 경우
  }

  // ✅ 2. 정답 추출 개선
  const answerMatch = text.match(/정답은\s+([^\n#]+)/);
  let answer = answerMatch ? answerMatch[1].trim() : null;

  const realAnswerMatch = answer.match(/정답은\s+([^\n#]+)/);
  let realAnswer = realAnswerMatch ? realAnswerMatch[1].trim() : null;

  answer = realAnswer ? realAnswer : answer;

  if (answer.length < 100) {
    // 너무 길면 오류임
    const quizzes = [
      {
        type: "캐시닥",
        question,
        answer,
        otherAnswers: [],
      },
    ];

    await doInsert(quizzes, type);
  }
};

const getVeil8000Quiz = async () => {
  const url =
    "https://m.blog.naver.com/api/blogs/veil8000/post-list?categoryNo=61&itemCount=30&logCode=0&page=1";
  const headers = {
    Referer:
      "https://m.blog.naver.com/PostList.naver?blogId=veil8000&categoryName=%E2%80%A2%E2%80%A6%EC%95%B1%ED%85%8C%ED%81%AC%20%ED%80%B4%EC%A6%88&categoryNo=61&logCode=0&tab=1",
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
  // let quizItems = require("./veil8000.json");

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

    // console.log("type: ", type);
    if (type === "3o3") {
      await extract3o3QuizFromText(content, type);
    } else if (type === "doctornow") {
      await extractDoctornowQuizFromText(content, type);
    } else if (type === "mydoctor") {
      await extractMydoctorQuizFromText(content, type);
    } else if (type === "kakaobank") {
      await extractKakaobankQuizFromText(title, content, type);
    } else if (type === "hpoint") {
      await extractHpointQuizFromText(title, content, type);
    } else if (type === "kakaopay") {
      await extractKakaopayQuizFromText(title, content, type);
    } else if (type === "shinhan") {
      await extractShinhanQuizFromText(title, content, type);
    } else if (type === "skstoa") {
      await extractSkstoaQuizFromText(title, content, type);
    } else if (type === "okcashbag") {
      await extractOkcashbagQuizFromText(title, content, type);
    } else if (type === "cashwalk") {
      await extractCashwalkQuizFromText(title, content, type);
    } else if (type === "hanabank") {
      await extractHanabankQuizFromText(title, content, type);
    } else if (type === "kbstar") {
      await extractKbstQuizFromText(title, content, type);
    } else if (type === "auction") {
      await extractAuctionQuizFromText(title, content, type);
    } else if (type === "cashdoc") {
      await extractCashdocQuizFromText(title, content, type);
    }
  }

  // fs.writeFileSync("./veil8000.json", JSON.stringify(quizItems, null, 2));

  // console.log(quizItems);
};

module.exports = { getVeil8000Quiz };
