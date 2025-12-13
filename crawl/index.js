const moment = require("moment-timezone");

// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  return moment().tz("Asia/Seoul");
};
const { getVeil8000Quiz } = require("./veil8000");
const { getClimateQuiz } = require("./climate");
const { getBntNews } = require("./bntnews");
const { google } = require("googleapis");
const request = require("request");
const path = require("path");
const fs = require("fs");
const { quizItems } = require("./db");
const key = require("./devupbox.json");

const LOG_PATH = path.resolve(__dirname, "./last-indexing.txt");

// 인덱싱할 URL 목록 만들기
const getUrlsToIndex = () => {
  const today = getKoreaTime().format("YYYY-MM-DD");
  return quizItems.flatMap((item) => [
    `https://quizbells.com/quiz/${item.type}/today`,
    `https://quizbells.com/quiz/${item.type}/${today}`,
  ]);
};

const hasIndexedToday = () => {
  if (!fs.existsSync(LOG_PATH)) return false;
  const last = fs.readFileSync(LOG_PATH, "utf-8");
  return last === getKoreaTime().format("YYYY-MM-DD");
};

const setIndexedToday = () => {
  fs.writeFileSync(LOG_PATH, getKoreaTime().format("YYYY-MM-DD"), "utf-8");
};

const googleIndexingApi = async (link) => {
  return new Promise((resolve) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key.replace(/\\n/g, "\n"), // ✅ 줄바꿈 처리
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
          await getBntNews(); // BNT News 토스 행운퀴즈
        } catch (err) {
          console.error("❌ BNT News 토스 오류:", err.message || err);
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
    return;
  }

  const urls = getUrlsToIndex();

  for (const url of urls) {
    await googleIndexingApi(url);
  }

  setIndexedToday(); // ✅ 오늘 실행 완료 기록
};

// 최초 1회 실행
run();

// 3분 간격 반복
// setInterval(run, 1 * 60 * 1000);
setInterval(run, 1 * 60 * 1000);
