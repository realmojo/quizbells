const { getKoreaTime } = require("./db");
const { getVeil8000Quiz } = require("./veil8000");
const { getClimateQuiz } = require("./climate");
const {
  getBntNewsByToss,
  getBntNewsByCashwork,
  getBntNewsByOkCashbag,
} = require("./bntnews");
const { getBookshelfJourneyQuiz } = require("./bookshelf-journey");
const { google } = require("googleapis");
const request = require("request");
const { quizItems } = require("./db");

// 환경 변수에서 Google API 키 정보 가져오기
const getGoogleKey = () => {
  // Lambda 환경 변수에서 가져오거나, devupbox.json 파일 사용
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  // 로컬 개발용 (devupbox.json 파일)
  try {
    return require("./devupbox.json");
  } catch (err) {
    throw new Error(
      "Google API 키를 찾을 수 없습니다. 환경 변수를 설정하세요."
    );
  }
};

// 인덱싱할 URL 목록 만들기
const getUrlsToIndex = () => {
  const today = getKoreaTime().format("YYYY-MM-DD");
  return quizItems.flatMap((item) => [
    `https://quizbells.com/quiz/${item.type}/today`,
    `https://quizbells.com/quiz/${item.type}/${today}`,
  ]);
};

// 환경 변수로 마지막 인덱싱 날짜 관리 (Lambda는 파일 시스템이 읽기 전용)
let lastIndexedDate = null;

const hasIndexedToday = () => {
  const today = getKoreaTime().format("YYYY-MM-DD");
  // 환경 변수에서 가져오기
  const envDate = process.env.LAST_INDEXED_DATE;
  if (envDate === today || lastIndexedDate === today) {
    return true;
  }
  return false;
};

const setIndexedToday = () => {
  const today = getKoreaTime().format("YYYY-MM-DD");
  lastIndexedDate = today;
  // 환경 변수는 Lambda에서 직접 수정할 수 없으므로,
  // DynamoDB나 다른 저장소를 사용하거나, 단순히 메모리에만 저장
  // 실제로는 DynamoDB나 Parameter Store를 사용하는 것을 권장
};

const googleIndexingApi = async (link) => {
  return new Promise((resolve) => {
    const key = getGoogleKey();
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ["https://www.googleapis.com/auth/indexing"]
    );

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log("❌ 인증 오류:", err);
        return resolve("fail");
      }

      const options = {
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        auth: { bearer: tokens.access_token },
        json: {
          url: link,
          type: "URL_UPDATED",
        },
      };

      request(options, function (error, response, body) {
        if (error) {
          console.log("❌ 요청 오류:", error);
        } else {
          console.log("✅ 인덱싱 응답:", body);
        }
        resolve("ok");
      });
    });
  });
};

const run = async () => {
  console.log(
    `🔍 [${getKoreaTime().format("YYYY-MM-DD HH:mm:ss")}] 퀴즈 크롤링 시작`
  );

  try {
    await Promise.all([
      (async () => {
        try {
          await getBookshelfJourneyQuiz(); // Bookshelf Journey 퀴즈
        } catch (err) {
          console.error("❌ Bookshelf Journey 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getBntNewsByToss(); // BNT News 토스, 캐시워크 행운퀴즈
        } catch (err) {
          console.error("❌ BNT News 토스 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getBntNewsByCashwork(); // BNT News 캐시워크 행운퀴즈
        } catch (err) {
          console.error("❌ BNT News 캐시워크 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getBntNewsByOkCashbag(); // BNT News 오퀴즈
        } catch (err) {
          console.error("❌ BNT News 오퀴즈 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getClimateQuiz(); // 기후행동 기회소득, 비트버니
        } catch (err) {
          console.error("❌ 기후행동 기회소득 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getVeil8000Quiz(); //  3o3, doctornow, mydoctor, kakaobank, hpoint, kakaopay
        } catch (err) {
          console.error("❌ Veil8000 오류:", err.message || err);
        }
      })(),
    ]);
  } catch (err) {
    console.error(
      "⚠️ 전체 크롤링 중단 오류 (이 블록은 사실상 발생하지 않음):",
      err.message || err
    );
  }

  console.log(
    `✅ [${getKoreaTime().format("YYYY-MM-DD HH:mm:ss")}] 퀴즈 크롤링 완료`
  );

  if (hasIndexedToday()) {
    console.log("❎ 이미 오늘 인덱싱 완료");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "이미 오늘 인덱싱 완료",
        timestamp: getKoreaTime().format("YYYY-MM-DD HH:mm:ss"),
      }),
    };
  }

  const urls = getUrlsToIndex();

  for (const url of urls) {
    await googleIndexingApi(url);
  }

  setIndexedToday(); // ✅ 오늘 실행 완료 기록

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "크롤링 및 인덱싱 완료",
      timestamp: getKoreaTime().format("YYYY-MM-DD HH:mm:ss"),
      indexedUrls: urls.length,
    }),
  };
};

// Lambda 핸들러 함수
exports.handler = async (event, context) => {
  // Lambda는 최대 15분까지 실행 가능
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const result = await run();
    return result;
  } catch (error) {
    console.error("❌ Lambda 실행 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "크롤링 실행 중 오류 발생",
        timestamp: getKoreaTime().format("YYYY-MM-DD HH:mm:ss"),
      }),
    };
  }
};

// 로컬 테스트용 (선택사항)
if (require.main === module) {
  run()
    .then((result) => {
      console.log("✅ 실행 완료:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ 실행 실패:", err);
      process.exit(1);
    });
}
