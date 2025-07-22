const axios = require("axios");
const moment = require("moment");

const quizItems = [
  {
    type: "toss",
    typeKr: "토스",
    title: "행운퀴즈",
    image: "/images/toss.png",
  },
  {
    type: "cashwalk",
    typeKr: "캐시워크",
    title: "돈버는퀴즈",
    image: "/images/cashwalk.png",
  },
  {
    type: "shinhan",
    typeKr: "신한쏠페이",
    title: "쏠퀴즈, 퀴즈팡팡, 출석퀴즈",
    image: "/images/shinhan.png",
  },
  {
    type: "kakaobank",
    typeKr: "카카오뱅크",
    title: "OX 퀴즈",
    image: "/images/kakaobank.png",
  },
  {
    type: "kakaopay",
    typeKr: "카카오페이",
    title: "오늘의 퀴즈",
    image: "/images/kakaopay.png",
  },
  {
    type: "bitbunny",
    typeKr: "비트버니",
    title: "오늘의 퀴즈",
    image: "/images/bitbunny.png",
  },
  {
    type: "okcashbag",
    typeKr: "오케이캐시백",
    title: "오퀴즈",
    image: "/images/okcashbag.png",
  },
  {
    type: "cashdoc",
    typeKr: "캐시닥",
    title: "용돈퀴즈",
    image: "/images/cashdoc.png",
  },
  {
    type: "kbstar",
    typeKr: "KB스타 KBPAY",
    title: "도전미션 스타퀴즈, 오늘의 퀴즈",
    image: "/images/kbstar.png",
  },
  {
    type: "3o3",
    typeKr: "삼쩜삼",
    title: "오늘의 퀴즈",
    image: "/images/3o3.png",
  },
  {
    type: "doctornow",
    typeKr: "닥터나우",
    title: "오늘의 퀴즈",
    image: "/images/doctornow.png",
  },
  {
    type: "mydoctor",
    typeKr: "나만의 닥터",
    title: "건강 퀴즈",
    image: "/images/mydoctor.png",
  },
  {
    type: "hpoint",
    typeKr: "에이치포인트",
    title: "오늘의 퀴즈",
    image: "/images/hpoint.png",
  },
  {
    type: "climate",
    typeKr: "기후행동 기회소득",
    title: "오늘의 퀴즈",
    image: "/images/climate.png",
  },
  {
    type: "skstoa",
    typeKr: "스토아",
    title: "퀴즈타임",
    image: "/images/skstoa.png",
  },
  {
    type: "hanabank",
    typeKr: "하나은행",
    title: "오늘의 퀴즈",
    image: "/images/hanabank.png",
  },
  {
    type: "auction",
    typeKr: "옥션",
    title: "매일퀴즈",
    image: "/images/auction.png",
  },
  {
    type: "nh",
    typeKr: "농협",
    title: "디깅퀴즈",
    image: "/images/nh.png",
  },
];

const escapeSQLString = (str) => {
  if (!str) return ""; // null, undefined 방지
  return str
    .replace(/\\/g, "\\\\") // 백슬래시 → 이중 백슬래시
    .replace(/'/g, "\\'") // 홑따옴표 → \' 로 이스케이프
    .replace(/"/g, '\\"'); // 쌍따옴표 → \" 로 이스케이프
};

const getQuizItems = (type) => {
  return quizItems.find((item) => item.type === type);
};

const getQuizbells = async (type, answerDate) => {
  const query = `SELECT * FROM quizbells WHERE type = '${type}' AND answerDate = '${answerDate}'`;
  const [rows] = await pool.query(query, [type, answerDate]);
  return rows[0];
};

const insertQuizbells = async (type, contents, answerDate) => {
  try {
    if (type && contents && answerDate) {
      const query = `INSERT INTO quizbells (type, contents, answerDate) VALUES ('${type}', '${contents}', '${answerDate}')`;
      await pool.query(query);
    }
  } catch (e) {
    console.log(e);
  }
};

const updateQuizbells = async (id, contents) => {
  try {
    if (id && contents) {
      const query = `UPDATE quizbells SET contents = '${contents}' WHERE id = '${id}'`;
      await pool.query(query);
    }
  } catch (e) {
    console.log(e);
  }
};

const alarmNotify = async (type) => {
  try {
    // 가격 알람 등록한 유저 가져오기
    let query = `SELECT * FROM quizbells_users`;
    let d = await pool.query(query);
    const items = d[0];

    if (items.length === 0) {
      console.log("❎ 아무도 등록을 해놓은 사람이 없습니다.");
    }

    for (const item of items) {
      const params = {
        token: item.fcmToken,
        title: "퀴즈벨",
        body: `${getQuizItems(type).typeKr} 정답 알람이 도착했어요`,
        icon: `https://quizbells.com/icons/android-icon-192x192.png`,
        link: `https://quizbells.com/quiz/${type || "toss"}/today`,
      };

      // 1. 알림 자체 비활성화
      if (item.isQuizAlarm !== "Y") {
        console.log(`🔕 ${item.fcmToken} 유저에게 발송 안 함 (알림 비활성화)`);
        continue;
      }

      // 2. 어떤 퀴즈에 대한 알람인지 명확히 설정
      const quizType = type; // 예: "toss" / "cashwalk" 등

      // 3. 설정 파싱
      const allowedTypes =
        item.alarmSettings === "*"
          ? "ALL"
          : item.alarmSettings?.split(",").map((t) => t.trim()) || [];

      // 4. 조건 체크 후 발송
      if (allowedTypes === "ALL" || allowedTypes.includes(quizType)) {
        console.log(
          `🔔 [${getQuizItems(quizType).typeKr}] ${item.fcmToken} 유저에게 발송`
        );
        await axios.post("https://quizbells.com/api/notify", params);
      } else {
        console.log(
          `⛔️ [${getQuizItems(quizType).typeKr}] ${item.fcmToken} 유저는 해당 퀴즈 알림 비활성화`
        );
      }
    }
  } catch (e) {
    console.log("alarmNotify 오류: ", e);
  }
};

const findNewQuizzes = (getItemContents, quizzes) => {
  const isSameQuiz = (quizA, quizB) => {
    return quizA.answer === quizB.answer;
  };
  const newQuizzes = quizzes.filter((newQuiz) => {
    const exists = getItemContents.some((existingQuiz) =>
      isSameQuiz(newQuiz, existingQuiz)
    );
    return !exists;
  });

  return newQuizzes;
};

const sanitizeQuotesInJsonArray = (data) => {
  return data.map((item) => {
    const newItem = {};

    for (const key in item) {
      if (!item.hasOwnProperty(key)) continue;

      const value = item[key];

      if (typeof value === "string") {
        newItem[key] = value.replace(/'/g, "").replace(/"/g, ""); // ' 제거
      } else if (Array.isArray(value)) {
        newItem[key] = value.map((v) =>
          typeof v === "string" ? v.replace(/'/g, "") : v
        );
      } else {
        newItem[key] = value;
      }
    }

    return newItem;
  });
};

const replaceAll = (str, search, replacement) => {
  return str.split(search).join(replacement);
};

const doInsert = async (quizzes, type, notifiedTypes) => {
  let shouldNotify = false;

  // 이상한 답은 제외 처리하기
  quizzes = quizzes.filter((quiz) => !quiz.answer.includes("잠시만"));

  if (quizzes.length > 0) {
    const getItem = await getQuizbells(type, moment().format("YYYY-MM-DD"));

    if (getItem === undefined) {
      console.log(
        `✅ [${moment().format("YYYY-MM-DD")}] ${type} 퀴즈 크롤링 완료`
      );
      const quizJson = escapeSQLString(JSON.stringify(quizzes));
      try {
        insertQuizbells(type, quizJson, moment().format("YYYY-MM-DD"));
        shouldNotify = true;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(
        `✅ [${moment().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
      );
    }

    if (getItem !== undefined) {
      const newQuizzes = findNewQuizzes(JSON.parse(getItem.contents), quizzes);
      // 두번째 문제
      if (newQuizzes.length > 0) {
        console.log("✅ 이미 등록되었지만 문제가 추가되어서 업데이트 합니다.");
        const prevAnswers = sanitizeQuotesInJsonArray(
          JSON.parse(getItem.contents)
        );
        prevAnswers.push(newQuizzes[0]);

        console.log(
          `✅ [${moment().format("YYYY-MM-DD")}] ${type} 퀴즈 업데이트 합니다..`
        );

        if (prevAnswers.length > 0) {
          try {
            await updateQuizbells(getItem.id, JSON.stringify(prevAnswers));
            shouldNotify = true;
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    if (shouldNotify && notifiedTypes && !notifiedTypes.has(type)) {
      await alarmNotify(type);
      notifiedTypes.add(type); // ← 알람 보냈다고 기록
    }
  }
};

module.exports = {
  insertQuizbells,
  updateQuizbells,
  getQuizbells,
  alarmNotify,
  escapeSQLString,
  findNewQuizzes,
  replaceAll,
  sanitizeQuotesInJsonArray,
  doInsert,
  quizItems,
};
