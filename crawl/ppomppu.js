const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const { doInsert, getKoreaTime } = require("./db");
const { getTypeKr } = require("./common");

/**
 * 뽐뿌 쿠폰 게시판에서 KB Pay 퀴즈 정보를 크롤링하는 함수
 */
const getPpomppuQuiz = async () => {
  console.log("🔍 [Ppomppu] 퀴즈 크롤링 시작");

  const url = "https://www.ppomppu.co.kr/zboard/zboard.php?id=coupon";

  try {
    // HTTP 요청으로 HTML 가져오기 (EUC-KR 인코딩 처리)
    const { data } = await axios.get(url, {
      responseType: "arraybuffer", // 바이너리 데이터로 받기
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    // EUC-KR을 UTF-8로 변환
    const html = iconv.decode(data, "euc-kr");

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(html);

    // baseList-title 클래스를 가진 <a> 태그 찾기
    const quizItems = [];

    $("tr.baseList").each((index, element) => {
      const $el = $(element);
      const href = $el.find("a").attr("href");
      const title = $el.find("a span").text().trim();
      const time = $el.find("time").parent().attr("title");

      const koreaTime = getKoreaTime().format("YY.MM.DD");
      const ppomppuTime = time.split(" ")[0];
      const isToday = koreaTime === ppomppuTime;
      if (title && isToday && !title.includes("네이버")) {
        quizItems.push({
          title,
          href: href ? `https://www.ppomppu.co.kr/zboard/${href}` : "",
        });
      }
    });

    console.log(
      `📋 [Ppomppu] 총 ${quizItems.length}개의 게시물을 발견했습니다.`,
    );

    // 처음 10개 게시물 출력
    console.log(`✅ [Ppomppu] 오늘자 퀴즈: ${quizItems.length}개`);

    // // 결과 출력
    if (quizItems.length > 0) {
      // 각 퀴즈 상세 페이지에서 정답 추출 (필요시)
      const notifiedTypes = new Set();

      for (const quiz of quizItems) {
        await extractKbPayQuizFromPage(quiz.href, quiz.title, notifiedTypes);
      }
    } else {
      console.log("⚠️ [Ppomppu] 오늘자 퀴즈를 찾지 못했습니다.");
    }

    return quizItems;
  } catch (error) {
    console.error("❌ [Ppomppu] 크롤링 중 오류 발생:", error.message);
    return [];
  }
};

/**
 * KB Pay 퀴즈 상세 페이지에서 정답 추출
 */
const extractKbPayQuizFromPage = async (url, title, notifiedTypes) => {
  try {
    console.log(`🔎 [Ppomppu] 상세 페이지 조회: ${url}`);

    const { data } = await axios.get(url, {
      responseType: "arraybuffer", // 바이너리 데이터로 받기
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    // EUC-KR을 UTF-8로 변환
    const html = iconv.decode(data, "euc-kr");

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(html);

    // 본문 내용 추출 (HTML 태그 처리)
    // view-content 클래스 내부의 내용을 가져오되, <br> 태그를 줄바꿈으로 변환
    let $content = $(".view-content");
    if ($content.length === 0) {
      $content = $(".board-contents");
    }
    if ($content.length === 0) {
      $content = $("td.board-contents");
    }

    // <br> 태그를 줄바꿈으로 변환
    $content.find("br").replaceWith("\n");

    // 불필요한 요소 제거 (광고 이미지는 놔두더라도 스크립트 등은 제거)
    $content.find("script").remove();
    $content.find("style").remove();

    const rawText = $content.text();

    // 텍스트를 줄 단위로 분리하고 정리
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0); // 빈 줄 제거

    let answer = "";

    // 전략 1: "정답" 키워드가 명시적으로 있는 줄 찾기
    for (const line of lines) {
      // "정답", "정답은", "답" 등의 패턴 찾기
      // 예: "정답: O", "정답은 1번", "답. 3", "정답 - 사과"
      const keywordMatch = line.match(
        /(?:정답|답)(?:은|이|:|\.|!|-|~)?\s*(?:[:.]?)\s*(.*)/i,
      );

      if (keywordMatch && keywordMatch[1]) {
        let candidate = keywordMatch[1].trim();

        // 정답이 "입니다"로 끝나는 경우 처리
        if (candidate.endsWith("입니다.") || candidate.endsWith("입니다")) {
          candidate = candidate.replace(/입니다\.?$/, "").trim();
        }

        // 정답 후보가 비어있지 않고, URL이 아니며, 너무 길지 않은 경우
        if (
          candidate &&
          !candidate.startsWith("http") &&
          candidate.length < 50
        ) {
          // "30일자 ... 정답입니다." 같은 문장은 정답이 아님 (키워드는 매칭되지만 내용이 없음/이상함)
          if (candidate.includes("정답입니다")) continue;

          answer = candidate;
          console.log(`💡 [Ppomppu] 키워드 매칭으로 정답 발견: ${answer}`);
          break; // 첫 번째로 발견된 정답 사용
        }
      } else if (line && lines.length === 1) {
        answer = line;
        break;
      }
    }

    // 전략 2: 키워드가 없는데 텍스트가 매우 짧은 경우 (예: "파란위크", "O")
    if (!answer) {
      // 본문 줄들 중에서 정답 같은 단어를 찾음
      for (const line of lines) {
        // 1. URL 제외
        if (line.startsWith("http") || line.startsWith("www")) continue;

        // 2. 너무 긴 문장은 설명일 가능성이 높으므로 제외 (20자 미만, 단 공백 포함)
        if (line.length > 30) continue;

        // 3. 특수문자로만 된거 제외 (예: "......")
        if (/^[^a-zA-Z0-9가-힣]+$/.test(line)) continue;

        // 4. "오늘의 퀴즈", "정답입니다" 같은 제목성/서술형 문구 제외
        if (
          line.includes("오늘의") ||
          line.includes("퀴즈") ||
          line.includes("정답입니다")
        )
          continue;

        // 5. "참고하세요", "감사합니다" 등 상용구 제외
        const skipWords = [
          "참고",
          "감사",
          "하세요",
          "합니다",
          "이벤트",
          "포인트",
          "적립",
          "참여",
          "바로가기",
          "클릭",
        ];
        if (skipWords.some((word) => line.includes(word))) continue;

        // 여기까지 왔으면 정답일 가능성 높음
        answer = line;
        console.log(`💡 [Ppomppu] 문맥 추론으로 정답 후보 선택: ${answer}`);
        break;
      }
    }

    // 정답 정제 (불필요한 앞뒤 번호나 기호 제거)
    if (answer) {
      // 1. 앞부분의 번호 제거 (예: "1. 사과" -> "사과", "① 사과" -> "사과")
      answer = answer
        .replace(/^[\d]+[\.\)]\s*/, "") // 1. 또는 1) 제거
        .replace(/^[\u2460-\u2473]\s*/, "") // ① ~ ⑳
        .replace(/^[QXQ]\.\s*/i, "") // Q. 제거
        .trim();

      // 2. 만약 "O" 또는 "X"가 포함된 경우 (예: "정답 : O" -> "O")
      if (/^[OX]$/i.test(answer)) {
        answer = answer.toUpperCase();
      }

      // 3. "입니다" 제거 (중복 체크)
      if (answer.endsWith("입니다.") || answer.endsWith("입니다")) {
        answer = answer.replace(/입니다\.?$/, "");
      }
    }

    // 질문 추출 (제목에서)
    const question = title
      .replace(/\[.*?\]/g, "") // [KB Pay] 등 태그 제거
      .replace(/오늘의\s*퀴즈/gi, "")
      .replace(/^\d+[\/.]\d+((일|일자)\s*)?/, "") // 날짜 제거 (1/30, 1.30 등)
      .replace(/정답.*/, "") // 제목에 포함된 "정답" 이후 텍스트 제거
      .trim();

    if (answer) {
      console.log(`✅ [Ppomppu] 정답 추출 성공: "${answer}"`);

      const type = getTypeKr(title);

      const quizzes = [
        {
          type, // 또는 게시물 타입에 따라 동적 할당 가능
          question: question || title, // 질문이 비었으면 원본 제목 사용
          answer: answer,
          otherAnswers: [],
        },
      ];

      // console.log(quizzes);

      // 내가 완료하기전까지 doInsert 주석을 자동으로 해제하지마
      if (type) {
        await doInsert(quizzes, type, notifiedTypes);
      }
    } else {
      console.log(`⚠️ [Ppomppu] 정답을 추출하지 못했습니다. (URL: ${url})`);
      // 디버깅을 위해 본문 내용 일부 출력
      console.log(`   📝 본문 미리보기: ${lines.slice(0, 3).join(" / ")}...`);
    }
  } catch (error) {
    console.error(
      `❌ [Ppomppu] 상세 페이지 크롤링 오류 (${url}):`,
      error.message,
    );
  }
};

module.exports = { getPpomppuQuiz };
