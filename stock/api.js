const categories = require("./categories");
const axios = require("axios");

// 뉴스 데이터 가져오기
const getStockNews = async (code, pageSize = 20, page = 1) => {
  try {
    const url = `https://m.stock.naver.com/api/news/stock/${code}?pageSize=${pageSize}&page=${page}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const t = data.map((item) => {
      const { officeId, articleId, title, body } = item.items[0];
      return {
        title,
        body,
        url: `https://n.news.naver.com/mnews/article/${officeId}/${articleId}`,
      };
    });

    return t;
  } catch (error) {
    console.error("뉴스 데이터 가져오기 실패:", error.message);
    throw error;
  }
};

// 실시간 시세 가져오기
const getRealtimePrice = async (code) => {
  try {
    const url = `https://polling.finance.naver.com/api/realtime/domestic/stock/${code}`;
    const {
      data: { datas },
    } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    return datas;
  } catch (error) {
    console.error("실시간 시세 가져오기 실패:", error.message);
    throw error;
  }
};

// 종목 정보 가져오기
const getStockChannelInfo = async (code) => {
  try {
    const url = `https://m.stock.naver.com/front-api/opentalk/channelInfo?code=${code}`;
    const {
      data: { result },
    } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    result.opentalkUrl = `https://ntalk.naver.com/ch/${result.channelId}`;

    return result;
  } catch (error) {
    console.error("종목 정보 가져오기 실패:", error.message);
    throw error;
  }
};

// 일별 시세 가져오기
const getDayCandle = async (code, periodType = "dayCandle") => {
  try {
    const url = `https://api.stock.naver.com/chart/domestic/item/${code}?periodType=${periodType}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    data.priceInfos = data.priceInfos.reverse().slice(0, 10);

    return data;
  } catch (error) {
    console.error("일별 시세 가져오기 실패:", error.message);
    throw error;
  }
};

const getWiseReport = async (code) => {
  return `https://navercomp.wisereport.co.kr/v2/company/c1010001.aspx?cmp_cd=${code}`;
};

// 테스트 함수
const run = async () => {
  try {
    const code = "005930";

    console.log("=== 뉴스 데이터 ===");
    const news = await getStockNews(code, 5, 1);
    console.log(news);

    console.log("\n=== 실시간 시세 ===");
    const realtime = await getRealtimePrice(code);
    console.log(realtime);

    console.log("\n=== 종목 정보 ===");
    const channelInfo = await getStockChannelInfo(code);
    console.log(channelInfo);

    console.log("\n=== 일별 시세 ===");
    const dayCandle = await getDayCandle(code);
    console.log(dayCandle);
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
};

// 모듈로 export
module.exports = {
  getStockNews,
  getRealtimePrice,
  getStockChannelInfo,
  getDayCandle,
};

// 직접 실행 시
if (require.main === module) {
  run();
}
