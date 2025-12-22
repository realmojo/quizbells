const axios = require("axios");

// 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
const getKoreaTime = () => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTime = new Date(utcTime + (9 * 60 * 60 * 1000)); // UTC+9
  
  // moment와 호환되는 객체 반환
  return {
    format: (formatStr) => {
      const year = koreaTime.getFullYear();
      const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
      const day = String(koreaTime.getDate()).padStart(2, "0");
      
      if (formatStr === "M월 D일") {
        return `${month}월 ${day}일`;
      }
      if (formatStr === "M월D일") {
        return `${month}월${day}일`;
      }
      // 기본값
      return `${year}-${month}-${day}`;
    },
    toDate: () => koreaTime,
    valueOf: () => koreaTime.getTime(),
  };
};

// 환경 변수에서 가져오거나 기본값 사용
const API_URL = process.env.API_URL || "https://quizbells.com";
// const API_URL = "http://localhost:3000";

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
    title: "퀴즈",
    image: "/images/kakaopay.png",
  },
  {
    type: "bitbunny",
    typeKr: "비트버니",
    title: "퀴즈",
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
    title: "퀴즈",
    image: "/images/3o3.png",
  },
  {
    type: "doctornow",
    typeKr: "닥터나우",
    title: "퀴즈",
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
    title: "퀴즈",
    image: "/images/hpoint.png",
  },
  {
    type: "climate",
    typeKr: "기후행동 기후동행 기회소득",
    title: "퀴즈",
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
    typeKr: "하나은행 하나원큐",
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
  {
    type: "kbank",
    typeKr: "케이뱅크",
    title: "미션 퀴즈",
    image: "/images/kbank.png",
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
  try {
    const url = `${API_URL}/api/quizbells?type=${type}&answerDate=${answerDate}`;
    const res = await axios.get(url);
    if (res?.data?.success === false) {
      return null;
    }
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const insertQuizbells = async (type, contents, answerDate) => {
  if (type && contents && answerDate) {
    try {
      const url = `${API_URL}/api/quizbells/add`;
      const res = await axios.post(url, {
        type,
        contents,
        answerDate,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
};

const updateQuizbells = async (id, contents) => {
  if (id && contents) {
    try {
      const url = `${API_URL}/api/quizbells/update`;
      const res = await axios.post(url, {
        id,
        contents,
      });
      return res.data;
    } catch (e) {
      return null;
    }
  }
};

const alarmNotify = async (type) => {
  try {
    // 가격 알람 등록한 유저 가져오기
    const url = `${API_URL}/api/users/alarm?type=${type}`;
    const res = await axios.get(url);
    const items = res.data;

    if (items.length === 0) {
      console.log("❎ 아무도 등록을 해놓은 사람이 없습니다.");
    }

    for (const item of items) {
      const params = {
        token: item.fcmToken,
        title: "퀴즈벨",
        body: `${getQuizItems(type).typeKr} 정답 알람이 도착했어요`,
        icon: `${API_URL}/icons/android-icon-192x192.png`,
        link: `${API_URL}/quiz/${type || "toss"}/today`,
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
        axios.post(`${API_URL}/api/notify`, params);
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

const normalizeQuizItem = (quiz = {}) => {
  return {
    question: (quiz.question || "").trim(),
    answer: (quiz.answer || "").trim(),
  };
};

const parseContentsArray = (contents) => {
  try {
    if (Array.isArray(contents)) return contents;
    if (typeof contents === "string") return JSON.parse(contents);
    return [];
  } catch (e) {
    console.log("❎ 기존 contents 파싱 실패", e);
    return [];
  }
};

const compareQuizQA = (existingContents, quizzes) => {
  const existing = parseContentsArray(existingContents).map(normalizeQuizItem);
  const incoming = (quizzes || []).map(normalizeQuizItem);

  const result = incoming.map((quiz, idx) => {
    const isSame = existing.some(
      (prev) => prev.question === quiz.question && prev.answer === quiz.answer
    );
    return { index: idx, ...quiz, isSame };
  });

  const mismatched = result.filter((item) => !item.isSame);

  console.log("🧾 퀴즈 Q/A 비교 결과", {
    totalExisting: existing.length,
    totalIncoming: incoming.length,
    matched: result.length - mismatched.length,
    mismatched: mismatched.map(({ index, question, answer }) => ({
      index,
      question,
      answer,
    })),
  });

  return result;
};

const quizzesExistInContents = (existingContents, quizzes) => {
  const existing = parseContentsArray(existingContents).map(normalizeQuizItem);
  const incoming = (quizzes || []).map(normalizeQuizItem);

  return incoming.every((quiz) =>
    existing.some(
      (prev) => prev.question === quiz.question && prev.answer === quiz.answer
    )
  );
};

const naverIndexNow = async (type) => {
  try {
    const { data } = await axios.get(
      `https://quizbells.com/api/naver/indexnow?type=${type}`
    );
    if (data.status === "ok") {
      console.log(`✅ ${type} 네이버 인덱싱 처리 성공`);
    } else {
      console.log("❌ 네이버 인덱싱 처리 실패", data.message);
    }
  } catch (e) {
    console.log("❌ 네이버 인덱싱 처리 실패", e);
  }
};

const doInsert = async (quizzes, type, notifiedTypes) => {
  let shouldNotify = false;

  // 이상한 답은 제외 처리하기
  quizzes = quizzes.filter(
    (quiz) => quiz.answer && !quiz.answer.includes("잠시만")
  );

  let isNotify = false;
  if (quizzes.length > 0) {
    const getItem = await getQuizbells(
      type,
      getKoreaTime().format("YYYY-MM-DD")
    );

    if (getItem === undefined || getItem === null) {
      console.log(
        `✅ [${getKoreaTime().format("YYYY-MM-DD")}] ${type} 퀴즈 크롤링 완료`
      );
      try {
        await naverIndexNow(type);
        await insertQuizbells(
          type,
          quizzes,
          getKoreaTime().format("YYYY-MM-DD")
        );
        isNotify = true;
        shouldNotify = true;
      } catch (e) {
        console.log(e);
        isNotify = false;
      }
    } else {
      if (getItem?.contents) {
        const allExists = quizzesExistInContents(getItem.contents, quizzes);
        console.log(
          allExists
            ? `🟢 모든 ${type}의 quizzes 가 기존 contents 에 존재합니다.`
            : "🟠 신규 quizzes 중 일부/전체가 기존 contents 에 없습니다."
        );

        if (!allExists) {
          getItem.contents.push(...quizzes);

          try {
            await naverIndexNow(type);
            await updateQuizbells(getItem.id, getItem.contents);
            shouldNotify = true;
            isNotify = true;
          } catch (e) {
            isNotify = false;
          }
        }
      }

      console.log(
        `✅ [${getKoreaTime().format("YYYY-MM-DD")}] 퀴즈 이미 존재 합니다 - ${type}`
      );
    }

    // if (getItem !== undefined || getItem !== null) {
    //   console.log(getItem.contents);
    //   const newQuizzes = findNewQuizzes(JSON.parse(getItem.contents), quizzes);
    //   // 두번째 문제
    //   if (newQuizzes.length > 0) {
    //     console.log("✅ 이미 등록되었지만 문제가 추가되어서 업데이트 합니다.");
    //     const prevAnswers = sanitizeQuotesInJsonArray(
    //       JSON.parse(getItem.contents)
    //     );
    //     prevAnswers.push(newQuizzes[0]);

    //     console.log(
    //       `✅ [${moment().format("YYYY-MM-DD")}] ${type} 퀴즈 업데이트 합니다..`
    //     );

    //     if (prevAnswers.length > 0) {
    //       try {
    //         await updateQuizbells(getItem.id, JSON.stringify(prevAnswers));
    //         shouldNotify = true;
    //         isNotify = true;
    //       } catch (e) {
    //         isNotify = false;
    //       }
    //     }
    //   }
    // }

    if (shouldNotify && isNotify && notifiedTypes && !notifiedTypes.has(type)) {
      console.log(
        `🔔 [${getKoreaTime().format("YYYY-MM-DD")}] ${type} 퀴즈 알람 발송`
      );
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
  compareQuizQA,
  quizzesExistInContents,
  doInsert,
  quizItems,
  getKoreaTime, // 한국 시간 함수 export
};
