const moment = require("moment");
const mysql = require("mysql2/promise");
const { getCashworkQuiz } = require("./cashwalk");
const { getTossQuiz } = require("./toss");
const { getShinhanQuiz } = require("./shinhan");
const { getOkcashbagQuiz } = require("./okcashbag");
const { getCashdocQuiz } = require("./cashdoc");
const { getKbstarQuiz } = require("./kbstar");
const { getBitbunnyQuiz } = require("./bitbunny");
const { getVeil8000Quiz } = require("./veil8000");
const { getClimateQuiz } = require("./climate");

global.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const run = async () => {
  console.log(
    `🔍 [${moment().format("YYYY-MM-DD HH:mm:ss")}] 퀴즈 크롤링 시작`
  );

  try {
    await Promise.all([
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
      (async () => {
        try {
          await getCashworkQuiz(); // 캐시워크
        } catch (err) {
          console.error("❌ 캐시워크 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getTossQuiz(); // 토스
        } catch (err) {
          console.error("❌ 토스 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getShinhanQuiz(); // 쏠퀴즈
        } catch (err) {
          console.error("❌ 쏠퀴즈 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getOkcashbagQuiz(); // 오퀴즈
        } catch (err) {
          console.error("❌ 오퀴즈 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getCashdocQuiz(); // 캐시닥
        } catch (err) {
          console.error("❌ 캐시닥 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getKbstarQuiz(); // KB스타
        } catch (err) {
          console.error("❌ KB스타 오류:", err.message || err);
        }
      })(),
      (async () => {
        try {
          await getBitbunnyQuiz(); // 비트버니
        } catch (err) {
          console.error("❌ 비트버니 오류:", err.message || err);
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
    `✅ [${moment().format("YYYY-MM-DD HH:mm:ss")}] 퀴즈 크롤링 완료`
  );
};

// 최초 1회 실행
run();

// 3분 간격 반복
setInterval(run, 1 * 60 * 1000);
