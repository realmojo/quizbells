const axios = require("axios");
const cheerio = require("cheerio");

const { doInsert, getKoreaTime } = require("./db");
const { contactcenterinsights_v1 } = require("googleapis");

const cleanHtml = ($content, $) => {
  // adsbygoogle 관련 요소들 제거
  $content.find(".adsbygoogle").remove(); // adsbygoogle 클래스를 가진 모든 요소 제거
  $content.find("ins.adsbygoogle").remove(); // ins 태그 중 adsbygoogle 클래스 제거
  $content.find("div.adsbygoogle").remove(); // div 태그 중 adsbygoogle 클래스 제거

  // adsbygoogle 관련 script 태그 제거
  $content.find("script").each((i, el) => {
    const scriptContent = $(el).html() || "";
    if (scriptContent.includes("adsbygoogle")) {
      $(el).remove();
    }
  });

  // googleBanner 클래스를 가진 div도 제거 (광고 배너)
  $content.find(".googleBanner").remove();
  $content.find("div.googleBanner").remove();
  $content.find("br").remove();

  return $content;
};

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
    const $content = $("div.content");

    let content = cleanHtml($content, $).html() || "";

    const $contentClean = cheerio.load(content);
    const quizzes = [];

    const strongElements = $contentClean("strong").toArray();
    const seenQuizzes = new Set();

    for (let i = 0; i < strongElements.length; i++) {
      const currentHtml = $contentClean(strongElements[i]).html() || "";
      const currentText = $contentClean(strongElements[i]).text().trim();

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
        const prevText = $contentClean(strongElements[i - 1])
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
        const nextText = $contentClean(strongElements[i + 1])
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

    const d = $("div.content");
    d.find("ins").remove();
    d.find("script").remove();
    const content = d.html() || "";

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

  // 두번째꺼 테스트 할 때
  // const firstTitle = $("h4.title:eq(1)").html();
  // const aLink = $("h4.title:eq(1)").parent().attr("href");
  const firstTitle = $("h4.title").html();
  const aLink = $("h4.title").parent().attr("href");

  const today1 = getKoreaTime().format("M월 D일");
  const today2 = getKoreaTime().format("M월D일");

  if (firstTitle.includes(today1) || firstTitle.includes(today2)) {
    const bntNewsUrl = `https://www.bntnews.co.kr${aLink}`;
    const bntNewsResponse = await axios.get(bntNewsUrl);

    const $ = cheerio.load(bntNewsResponse.data);
    const $content = $("div.content");

    let content = cleanHtml($content, $).html() || "";

    const quizzes = [];
    const $contentClean = cheerio.load(content);
    const seenQuizzes = new Set();

    // 패턴 1: "퀴즈 정답은 'XXX'이다." 형식 찾기
    const answerPattern = /퀴즈\s*정답은\s*['"]([^'"]+)['"]\s*이다\./gi;
    let answerMatch;

    while ((answerMatch = answerPattern.exec(content)) !== null) {
      // 정답에서 HTML 태그 제거 (strong 태그 등)
      const answerHtml = answerMatch[1];
      const $answer = cheerio.load(answerHtml);
      const answer = $answer.text().trim();

      const answerIndex = answerMatch.index;

      // 정답 앞의 텍스트에서 "○" 문자가 있는 부분 찾기
      const textBeforeAnswer = content.substring(0, answerIndex);

      // "○" 문자가 포함된 부분 찾기
      const circleIndex = textBeforeAnswer.lastIndexOf("○");

      if (circleIndex !== -1) {
        // "문제" 키워드가 있는지 확인하고, "문제"부터 "○" 문자가 포함된 전체 문장 추출
        const problemIndex = textBeforeAnswer.lastIndexOf("문제");

        let questionText = "";

        if (problemIndex !== -1 && problemIndex < circleIndex) {
          // "문제"부터 정답 직전까지의 전체 텍스트 추출 (○ 문자가 포함된 전체 문장)
          questionText = textBeforeAnswer.substring(problemIndex);
        } else {
          // "문제" 키워드가 없으면 "○" 문자부터 추출
          questionText = textBeforeAnswer.substring(circleIndex);
        }

        // HTML 태그 제거 및 텍스트 정리
        questionText = questionText
          .replace(/<[^>]+>/g, " ") // HTML 태그 제거
          .replace(/\s+/g, " ") // 연속된 공백 제거
          .trim();

        // 문제가 너무 짧거나 비어있으면 스킵
        if (questionText && questionText.length > 5) {
          const uniqueKey = `${questionText}|||${answer}`;
          if (!seenQuizzes.has(uniqueKey)) {
            seenQuizzes.add(uniqueKey);
            quizzes.push({
              type: "오퀴즈",
              question: questionText,
              answer: answer,
              otherAnswers: [],
            });
          }
        }
      } else {
        // "○" 문자가 없으면 "문제" 키워드가 있는 부분 찾기
        const problemMatch = textBeforeAnswer.match(
          /([^<]*문제[^<]*?)(?=퀴즈\s*정답은)/
        );

        if (problemMatch) {
          // 문제 텍스트 추출 (HTML 태그 제거)
          let question = problemMatch[1]
            .replace(/<[^>]+>/g, " ") // HTML 태그 제거
            .replace(/\s+/g, " ") // 연속된 공백 제거
            .trim();

          // "문제" 키워드 앞의 제목 부분 제거 (예: "오전 10시 ... 문제" -> 문제 부분만)
          const problemIndex = question.lastIndexOf("문제");
          if (problemIndex !== -1) {
            question = question.substring(problemIndex + 2).trim(); // "문제" 다음부터
          }

          // 문제가 너무 짧거나 비어있으면 스킵
          if (question && question.length > 5) {
            const uniqueKey = `${question}|||${answer}`;
            if (!seenQuizzes.has(uniqueKey)) {
              seenQuizzes.add(uniqueKey);
              quizzes.push({
                type: "오퀴즈",
                question: question,
                answer: answer,
                otherAnswers: [],
              });
            }
          }
        }
      }
    }

    // 패턴 2: strong 태그 내부의 문제-정답 쌍 찾기
    $contentClean("strong").each((i, el) => {
      const strongHtml = $contentClean(el).html() || "";
      const strongText = $contentClean(el).text().trim();

      // "○" 문자와 "퀴즈 정답은"이 모두 포함된 경우
      if (strongText.includes("○") && strongText.includes("퀴즈 정답은")) {
        const answerMatch = strongText.match(
          /퀴즈\s*정답은\s*['"]([^'"]+)['"]/
        );
        if (answerMatch) {
          // 정답에서 HTML 태그 제거
          const answerHtml = answerMatch[1];
          const $answer = cheerio.load(answerHtml);
          const answer = $answer.text().trim();

          const circleIndex = strongText.indexOf("○");
          const answerIndex = strongText.indexOf("퀴즈 정답은");

          if (circleIndex !== -1 && answerIndex > circleIndex) {
            let question = strongText
              .substring(circleIndex, answerIndex)
              .trim();

            if (question && question.length > 5) {
              const uniqueKey = `${question}|||${answer}`;
              if (!seenQuizzes.has(uniqueKey)) {
                seenQuizzes.add(uniqueKey);
                quizzes.push({
                  type: "오퀴즈",
                  question: question,
                  answer: answer,
                  otherAnswers: [],
                });
              }
            }
          }
        }
      }
    });

    if (quizzes.length > 0) {
      await doInsert(quizzes, "okcashbag", new Set());
    } else {
      console.log("퀴즈를 찾을 수 없습니다.");
    }
  } else {
    console.log("오늘 날짜가 아닙니다.");
  }
};

module.exports = {
  getBntNewsByToss,
  getBntNewsByCashwork,
  getBntNewsByOkCashbag,
};
