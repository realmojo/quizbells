const axios = require("axios");
const moment = require("moment-timezone");
const cheerio = require("cheerio");

// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  return moment().tz("Asia/Seoul");
};

const { doInsert } = require("./db");

const getBntNewsByToss = async () => {
  console.log("BNT News 토스 행운퀴즈 크롤링 시작");
  const url = "https://www.bntnews.co.kr/article/search?searchText=행운퀴즈";

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const firstTitle = $("h4.title").html();
  const aLink = $("h4.title").parent().attr("href");

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  if (firstTitle.includes(today1) || firstTitle.includes(today2)) {
    const bntNewsUrl = `https://www.bntnews.co.kr${aLink}`;
    const bntNewsResponse = await axios.get(bntNewsUrl);

    const $ = cheerio.load(bntNewsResponse.data);
    const content = $("div.content").html() || "";

    const quizzes = [];
    const $content = cheerio.load(content);

    // 방법 1: strong 태그들을 순회하면서 질문-정답 쌍 찾기
    const strongElements = $content("strong").toArray();
    const seenQuizzes = new Set();

    for (let i = 0; i < strongElements.length; i++) {
      const currentHtml = $content(strongElements[i]).html() || "";
      const currentText = $content(strongElements[i]).text().trim();

      // 현재 strong 태그 내부에 "정답 -" 패턴이 있는지 확인
      const answerPattern = /정답\s*-\s*([^<\n&]+)/gi;
      const answers = [];
      let answerMatch;
      const tempHtml = currentHtml;
      while ((answerMatch = answerPattern.exec(tempHtml)) !== null) {
        answers.push({
          answer: answerMatch[1].trim(),
          position: answerMatch.index,
        });
      }

      // 케이스 1: 이전 strong이 질문이고, 현재 strong의 첫 번째 정답과 매칭
      // 예: <strong>네이버플러스 스토어</strong><br><strong>정답 - 3, 30<br>...</strong>
      if (i > 0 && answers.length > 0) {
        const prevText = $content(strongElements[i - 1])
          .text()
          .trim();
        if (
          prevText &&
          !prevText.includes("정답") &&
          !prevText.startsWith("정답")
        ) {
          const question = prevText;
          const cleanAnswer = answers[0].answer;
          const uniqueKey = `${question}|||${cleanAnswer}`;
          if (!seenQuizzes.has(uniqueKey)) {
            seenQuizzes.add(uniqueKey);
            quizzes.push({
              type: "토스 행운퀴즈",
              question: question,
              answer: cleanAnswer,
              otherAnswers: [],
            });
          }
        }
      }

      // 케이스 2: 현재 strong 태그 내부에 여러 퀴즈가 있는 경우
      // 예: <strong>정답 - 3, 30<br>&nbsp;<br>토스증권 연말퀴즈 도착<br>정답 - 완전무료</strong>
      if (answers.length > 0) {
        // HTML을 <br>로 분리하여 처리
        const parts = currentHtml.split(/<br\s*\/?>/);
        let currentQuestion = "";

        for (const part of parts) {
          const trimmedPart = part.trim();
          if (!trimmedPart || trimmedPart === "&nbsp;") continue;

          // HTML 태그 제거
          const textOnly = trimmedPart.replace(/<[^>]+>/g, "").trim();

          // "정답 -"으로 시작하는지 확인
          if (/^정답\s*-\s*/i.test(textOnly)) {
            const cleanAnswer = textOnly.replace(/^정답\s*-\s*/i, "").trim();
            // 이전에 저장된 질문이 있으면 퀴즈로 추가
            if (currentQuestion && cleanAnswer) {
              const uniqueKey = `${currentQuestion}|||${cleanAnswer}`;
              if (!seenQuizzes.has(uniqueKey)) {
                seenQuizzes.add(uniqueKey);
                quizzes.push({
                  type: "토스 행운퀴즈",
                  question: currentQuestion,
                  answer: cleanAnswer,
                  otherAnswers: [],
                });
              }
              currentQuestion = "";
            }
          } else if (
            textOnly &&
            !textOnly.startsWith("정답") &&
            textOnly.length > 0
          ) {
            // 질문으로 저장 (정답이 아닌 텍스트)
            currentQuestion = textOnly;
          }
        }
      }

      // 케이스 3: 현재 strong이 질문이고, 다음 strong이 정답인 경우
      // 예: <strong>파브리 추천 신메뉴</strong><br><strong>정답 - 시그니처포크</strong>
      if (i < strongElements.length - 1 && !currentText.includes("정답")) {
        const nextText = $content(strongElements[i + 1])
          .text()
          .trim();
        if (nextText.startsWith("정답")) {
          const question = currentText;
          const cleanAnswer = nextText.replace(/^정답\s*-\s*/i, "").trim();
          if (question && cleanAnswer) {
            const uniqueKey = `${question}|||${cleanAnswer}`;
            if (!seenQuizzes.has(uniqueKey)) {
              seenQuizzes.add(uniqueKey);
              quizzes.push({
                type: "토스 행운퀴즈",
                question: question,
                answer: cleanAnswer,
                otherAnswers: [],
              });
            }
          }
        }
      }
    }

    // 방법 2: 정규식으로 모든 패턴 찾기 (보완)
    // <strong>질문</strong><br><strong>정답 - 답</strong> 패턴
    const quizPattern =
      /<strong>([^<]+)<\/strong><br\s*\/?><strong>(정답\s*-\s*[^<]+)<\/strong>/gi;

    let match;
    while ((match = quizPattern.exec(content)) !== null) {
      const question = match[1].trim();
      const answerText = match[2].trim();
      const cleanAnswer = answerText.replace(/^정답\s*-\s*/i, "").trim();

      if (question && cleanAnswer && !question.includes("정답")) {
        const uniqueKey = `${question}|||${cleanAnswer}`;
        if (!seenQuizzes.has(uniqueKey)) {
          seenQuizzes.add(uniqueKey);
          quizzes.push({
            type: "토스 행운퀴즈",
            question: question,
            answer: cleanAnswer,
            otherAnswers: [],
          });
        }
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

const getBntNewsByCashwork = async () => {
  console.log("BNT News 캐시워크 크롤링 시작");
  const url = "https://www.bntnews.co.kr/article/search?searchText=캐시워크";

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const firstTitle = $("h4.title").html();
  const aLink = $("h4.title").parent().attr("href");

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  if (firstTitle.includes(today1) || firstTitle.includes(today2)) {
    const bntNewsUrl = `https://www.bntnews.co.kr${aLink}`;
    const bntNewsResponse = await axios.get(bntNewsUrl);

    const $ = cheerio.load(bntNewsResponse.data);
    const content = $("div.content").html() || "";

    const quizzes = [];

    // HTML 태그를 줄바꿈으로 치환하여 텍스트화 (p, br, div)
    let textContent = content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n");

    // 나머지 태그 제거
    textContent = textContent.replace(/<[^>]+>/g, "");

    // HTML 엔티티 디코딩
    textContent = textContent
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");

    // 줄 단위로 분리하고 빈 줄 제거
    const lines = textContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let currentQuestion = "";
    const seenQuizzes = new Set(); // 중복 방지

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. 질문 찾기
      // "캐시워크 돈버는퀴즈 문제" 또는 "돈버는퀴즈 문제" 패턴 포함 시 시작
      if (
        line.includes("돈버는퀴즈 문제") ||
        line.includes("돈버는 퀴즈 문제")
      ) {
        currentQuestion = line;
        continue;
      }

      // 2. 정답 찾기
      // "퀴즈 정답은 'OOO'이다."
      const answerMatch = /퀴즈 정답은 '([^']+)'이다/i.exec(line);
      if (answerMatch) {
        const answer = answerMatch[1];

        if (currentQuestion) {
          // 중복 체크
          const uniqueKey = `${currentQuestion}|||${answer}`;
          if (!seenQuizzes.has(uniqueKey)) {
            seenQuizzes.add(uniqueKey);
            quizzes.push({
              type: "cashwalk", // DB enum 값에 맞춤 ('cashwork' -> 'cashwalk' 가능성 있음, 확인 필요하나 요청엔 cashwork로 되어있었음. 일단 type은 변수로 유연하게 처리 필요없으면 하드코딩)
              // 기존 코드 getBntNewsByToss 에서는 '토스 행운퀴즈'로 한글을 넣었으나,
              // 여기서는 DB insert 시 type을 'cashwalk'로 매핑할 수도 있음.
              // doInsert 호출부를 보면 "cashwork" 문자열을 넘김.
              // quizzes 배열 안의 type은 보통 한글 표기용일 수 있음.
              // 일단 질문/정답 구조에 집중.
              question: currentQuestion,
              answer: answer,
              otherAnswers: [],
            });
          }
        }
        continue;
      }

      // 3. 다른 정답 찾기
      // "다른 정답은 '...', '...'이다." 또는 "다른 정답도 '...'이다."
      const otherAnswerMatch = /다른 정답[은도] (.+)이다/i.exec(line);
      if (otherAnswerMatch && quizzes.length > 0) {
        const othersRaw = otherAnswerMatch[1]; // "'...', '...'" 형태
        const others = othersRaw.match(/'([^']+)'/g); // ['...'] 배열

        if (others) {
          const cleanOthers = others.map((s) => s.replace(/'/g, ""));
          const lastQuiz = quizzes[quizzes.length - 1];

          // 기존 otherAnswers에 병합 (중복 제거)
          const existing = new Set(lastQuiz.otherAnswers);
          cleanOthers.forEach((a) => existing.add(a));
          lastQuiz.otherAnswers = Array.from(existing);
        }

        // 정답까지 다 찾았으므로 질문 초기화
        currentQuestion = "";
        continue;
      }

      // 4. 질문이 여러 줄인 경우 (정답 라인이 아니면서, 이미 질문이 시작된 경우)
      // 단, "캐시워크 돈버는퀴즈 정답" 같은 안내 문 구는 제외해야 함.
      if (
        currentQuestion &&
        !line.includes("퀴즈 정답은") &&
        !line.includes("돈버는퀴즈 정답") &&
        !line.includes("캐시워크 정답")
      ) {
        currentQuestion += " " + line;
      }
    }

    // type 필드 일괄 정리 (한글 명칭 등)
    quizzes.forEach((q) => (q.type = "캐시워크 돈버는퀴즈"));

    console.log("quizzes", quizzes);
    if (quizzes.length > 0) {
      await doInsert(quizzes, "cashwalk", new Set());
    } else {
      console.log("퀴즈를 찾을 수 없습니다.");
    }
  } else {
    console.log("오늘 날짜가 아닙니다.");
  }
};

const getBntNewsByOkCashbag = async () => {
  console.log("BNT News 오퀴즈 크롤링 시작");
  const url = "https://www.bntnews.co.kr/article/search?searchText=오퀴즈";

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const firstTitle = $("h4.title").html();
  const aLink = $("h4.title").parent().attr("href");

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  if (firstTitle.includes(today1) || firstTitle.includes(today2)) {
    const bntNewsUrl = `https://www.bntnews.co.kr${aLink}`;
    const bntNewsResponse = await axios.get(bntNewsUrl);

    const $ = cheerio.load(bntNewsResponse.data);
    const content = $("div.content").html() || "";

    console.log("content", content);

    const quizzes = [];

    // HTML 태그를 줄바꿈으로 치환하여 텍스트화 (p, br, div)

    console.log("quizzes", quizzes);
    // if (quizzes.length > 0) {
    //   await doInsert(quizzes, "okcashbag", new Set());
    // } else {
    //   console.log("퀴즈를 찾을 수 없습니다.");
    // }
  } else {
    console.log("오늘 날짜가 아닙니다.");
  }
};

module.exports = {
  getBntNewsByToss,
  getBntNewsByCashwork,
  getBntNewsByOkCashbag,
};
