const axios = require("axios");
const cheerio = require("cheerio");

const { doInsert, getKoreaTime } = require("./db");
const { getType, getTypeKr } = require("./common");

// 스크립트 태그에서 QUIZ_DATA 객체 추출
const extractQuizDataFromScript = (html) => {
  try {
    // QUIZ_DATA 객체를 찾는 정규식
    const quizDataRegex = /const\s+QUIZ_DATA\s*=\s*({[\s\S]*?});/;
    const match = html.match(quizDataRegex);

    if (!match) {
      return null;
    }

    // 객체 문자열 추출
    const objectString = match[1];

    // 안전하게 객체로 파싱 (eval 대신 Function 사용)
    try {
      const quizData = new Function(`return ${objectString}`)();
      return quizData;
    } catch (parseError) {
      console.error("QUIZ_DATA 파싱 오류:", parseError.message);
      return null;
    }
  } catch (error) {
    console.error("QUIZ_DATA 추출 오류:", error.message);
    return null;
  }
};

const extractBookshelfJourneyQuizFromText = async (
  title,
  link,
  type,
  notifiedTypes
) => {
  const response = await axios.get(link);
  const html = response.data;
  const $ = cheerio.load(html);

  // 먼저 스크립트 태그에서 QUIZ_DATA 추출 시도
  const quizData = extractQuizDataFromScript(html);

  if (quizData && quizData.question && quizData.answer) {
    // QUIZ_DATA가 있으면 이것을 사용
    // 정답에서 숫자나 텍스트 추출 (① 8위 -> 8위)
    const cleanAnswer = quizData.answer
      .replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, "") // 원문자 제거
      .trim();

    if (cleanAnswer) {
      const quizzes = [
        {
          type: getTypeKr(type),
          question: quizData.question.replace(/^Q\.\s*/, ""), // "Q. " 제거
          answer: cleanAnswer,
          otherAnswers: [],
        },
      ];

      await doInsert(quizzes, type, notifiedTypes);
    }
  } else {
    // QUIZ_DATA가 없으면 기존 방식으로 h3 태그에서 추출
    const questions = $(".blogview_content h3");
    const answers = $(".blogview_content > [data-ke-style='style1']");

    if (questions.length > 0 && type !== "kakaopay") {
      for (let index = 0; index < questions.length; index++) {
        const questionText = $(questions[index]).text();
        const answerText = $(answers[index]).text();

        if (
          answerText.toLowerCase().includes("coming") ||
          answerText.toLowerCase().includes("soon")
        ) {
          continue;
        }

        const quizzes = [
          {
            type: getTypeKr(type),
            question: questionText
              ? questionText.replace(` (${getKoreaTime().format("MM/DD")})`, "")
              : "",
            answer: answerText
              ? answerText
                  .replace("[", " ")
                  .replace("]", " ")
                  .replace("퀴즈", "")
                  .replace("정답", "")
                  .replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, "")
                  .trim()
              : "",
            otherAnswers: [],
          },
        ];

        await doInsert(quizzes, type, notifiedTypes);
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  // fs.writeFileSync(`./bookshelf-journey/${title}.html`, html);
};

const getBookshelfJourneyQuiz = async () => {
  console.log("Bookshelf Journey 크롤링 시작");
  const url =
    "https://bookshelf-journey.tistory.com/m/api/entry/0/POST?page=0&size=20";

  const {
    data: {
      data: { items },
    },
  } = await axios.get(url);

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  let quizItems = items.map((post) => {
    return {
      title: post.title,
      link: `https://bookshelf-journey.tistory.com${post.path}`,
      type: getType(post.title),
    };
  });

  quizItems = quizItems.filter((post) => {
    if (
      post.title.includes(today1) ||
      post.title.includes(today2) ||
      post.title.includes("모니스쿨")
    ) {
      return true;
    }
  });

  const notifiedTypes = new Set(); // ← 알림 발송 추적용 Set

  for (const post of quizItems) {
    const { title, link, type } = post;

    await extractBookshelfJourneyQuizFromText(title, link, type, notifiedTypes);
  }
};

module.exports = { getBookshelfJourneyQuiz };
