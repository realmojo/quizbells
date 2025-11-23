const {
  getStockNews,
  getRealtimePrice,
  getStockChannelInfo,
  getDayCandle,
} = require("./api");
const { wpCreatePost } = require("./wp");
const moment = require("moment");
const categories = require("./categories");

// 숫자 포맷팅
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 추천 등급 결정
const getRecommendation = (analysis) => {
  const { priceChange, volumeChange, newsSentiment, trend } = analysis;
  let score = 0;

  // 가격 변동 분석
  if (priceChange > 3) score += 2;
  else if (priceChange > 1) score += 1;
  else if (priceChange < -3) score -= 2;
  else if (priceChange < -1) score -= 1;

  // 거래량 분석
  if (volumeChange > 50) score += 1;
  else if (volumeChange < -30) score -= 1;

  // 뉴스 감정 분석
  if (newsSentiment > 0.3) score += 1;
  else if (newsSentiment < -0.3) score -= 1;

  // 추세 분석
  if (trend === "upward") score += 1;
  else if (trend === "downward") score -= 1;

  if (score >= 3)
    return { grade: "매수", emoji: "🟢", reason: "긍정적 신호가 강합니다" };
  if (score >= 1)
    return { grade: "관망", emoji: "🟡", reason: "신호가 혼재되어 있습니다" };
  return { grade: "매도", emoji: "🔴", reason: "부정적 신호가 우세합니다" };
};

// 기술적 분석 수행
const analyzeStock = (realtime, dayCandle, news) => {
  const analysis = {
    priceChange: 0,
    volumeChange: 0,
    newsSentiment: 0,
    trend: "neutral",
  };

  // 숫자에서 콤마 제거하는 헬퍼 함수
  const parseNumber = (str) => {
    if (!str) return 0;
    return (
      parseInt(
        String(str)
          .replace(/,/g, "")
          .replace(/[^0-9.-]/g, "")
      ) || 0
    );
  };

  // 실시간 시세 분석
  let currentVolume = 0;
  if (realtime && Array.isArray(realtime) && realtime.length > 0) {
    const stockData = realtime[0]; // datas 배열의 첫 번째 요소

    // 등락률 추출 (fluctuationsRatio는 문자열로 "-5.77" 형식)
    if (stockData.fluctuationsRatio) {
      analysis.priceChange = parseFloat(stockData.fluctuationsRatio) || 0;
    }

    // 현재 거래량 추출
    currentVolume = parseNumber(stockData.accumulatedTradingVolume);
  }

  // 일별 시세 분석
  if (dayCandle) {
    const priceInfos =
      dayCandle.priceInfos || dayCandle.result?.priceInfos || [];

    if (priceInfos.length >= 2) {
      const recent = priceInfos[0];
      const previous = priceInfos[1];

      // 가격 추세 분석 (다양한 필드명 대응)
      const recentPrice =
        recent.closePrice || recent.close || recent.price || 0;
      const previousPrice =
        previous.closePrice || previous.close || previous.price || 0;

      if (recentPrice > previousPrice) {
        analysis.trend = "upward";
      } else if (recentPrice < previousPrice) {
        analysis.trend = "downward";
      }

      // 거래량 변화 분석
      // dayCandle의 필드명이 다양할 수 있으므로 여러 필드명 시도
      const previousVolume =
        parseNumber(previous.volume) ||
        parseNumber(previous.vol) ||
        parseNumber(previous.tradingVolume) ||
        parseNumber(previous.accumulatedTradingVolume) ||
        0;

      // realtime의 현재 거래량과 dayCandle의 전일 거래량 비교
      // 또는 dayCandle의 최근 2일 거래량 비교
      const recentVolumeFromCandle =
        parseNumber(recent.volume) ||
        parseNumber(recent.vol) ||
        parseNumber(recent.tradingVolume) ||
        parseNumber(recent.accumulatedTradingVolume) ||
        0;

      // realtime의 현재 거래량이 있으면 그것을 사용, 없으면 dayCandle의 최근 거래량 사용
      const recentVolume =
        currentVolume > 0 ? currentVolume : recentVolumeFromCandle;

      if (previousVolume > 0) {
        analysis.volumeChange = parseFloat(
          (((recentVolume - previousVolume) / previousVolume) * 100).toFixed(2)
        );
      } else if (recentVolumeFromCandle > 0 && previousVolume === 0) {
        // 전일 거래량이 없으면 최근 2일 비교
        const dayBeforeVolume =
          parseNumber(priceInfos[2]?.volume) ||
          parseNumber(priceInfos[2]?.vol) ||
          parseNumber(priceInfos[2]?.tradingVolume) ||
          parseNumber(priceInfos[2]?.accumulatedTradingVolume) ||
          0;

        if (dayBeforeVolume > 0) {
          analysis.volumeChange = parseFloat(
            (
              ((recentVolumeFromCandle - dayBeforeVolume) / dayBeforeVolume) *
              100
            ).toFixed(2)
          );
        }
      }
    }
  }

  // 뉴스 감정 분석 (간단한 키워드 기반)
  if (news) {
    const newsItems = (news.result || news.items || news || []).slice(0, 10);

    if (newsItems.length > 0) {
      let positiveCount = 0;
      let negativeCount = 0;

      const positiveKeywords = [
        "상승",
        "증가",
        "성장",
        "호재",
        "긍정",
        "개선",
        "확대",
        "투자",
        "수익",
        "기대",
      ];
      const negativeKeywords = [
        "하락",
        "감소",
        "부진",
        "악재",
        "부정",
        "우려",
        "축소",
        "손실",
        "위험",
        "실망",
      ];

      newsItems.forEach((item) => {
        const title = (
          (item.title || item.subject || "") +
          " " +
          (item.content || item.summary || "")
        ).toLowerCase();

        const positive = positiveKeywords.some((kw) => title.includes(kw));
        const negative = negativeKeywords.some((kw) => title.includes(kw));

        if (positive) positiveCount++;
        if (negative) negativeCount++;
      });

      analysis.newsSentiment =
        (positiveCount - negativeCount) / newsItems.length;
    }
  }

  return analysis;
};

// HTML 콘텐츠 생성
const generateContent = (
  stockName,
  code,
  realtime,
  dayCandle,
  news,
  channelInfo,
  analysis,
  recommendation
) => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 현재가 정보 추출
  let currentPrice = 0;
  let prevClose = 0;
  let changePrice = 0;
  let changeRate = 0;
  let volume = 0;
  let openPrice = 0;
  let highPrice = 0;
  let lowPrice = 0;
  let tradingValue = 0;

  if (realtime && Array.isArray(realtime) && realtime.length > 0) {
    const stockData = realtime[0]; // datas 배열의 첫 번째 요소

    // 숫자에서 콤마 제거하는 헬퍼 함수
    const parseNumber = (str) => {
      if (!str) return 0;
      return (
        parseInt(
          String(str)
            .replace(/,/g, "")
            .replace(/[^0-9.-]/g, "")
        ) || 0
      );
    };

    // 현재가 (closePrice는 "94,800" 형식의 문자열)
    currentPrice = parseNumber(stockData.closePrice);

    // 전일대비 (compareToPreviousClosePrice는 "-5,800" 형식의 문자열)
    changePrice = parseNumber(stockData.compareToPreviousClosePrice);

    // 등락률 (fluctuationsRatio는 "-5.77" 형식의 문자열)
    changeRate = parseFloat(stockData.fluctuationsRatio) || 0;

    // 전일종가 = 현재가 - 전일대비
    prevClose = currentPrice - changePrice;

    // 시가, 고가, 저가
    openPrice = parseNumber(stockData.openPrice);
    highPrice = parseNumber(stockData.highPrice);
    lowPrice = parseNumber(stockData.lowPrice);

    // 거래량 (accumulatedTradingVolume는 "22,970,800" 형식의 문자열)
    volume = parseNumber(stockData.accumulatedTradingVolume);

    // 거래대금 (accumulatedTradingValue는 "2,191,650백만" 형식, 백만원 단위)
    const tradingValueStr = String(
      stockData.accumulatedTradingValue || ""
    ).replace(/백만/g, "");
    tradingValue = parseNumber(tradingValueStr) * 1000000; // 백만원을 원으로 변환
  }

  // 최근 5일 가격 정보
  let priceHistory = "";
  const priceInfos =
    dayCandle?.priceInfos || dayCandle?.result?.priceInfos || [];

  if (priceInfos.length > 0) {
    const recentPrices = priceInfos.slice(0, 5);
    priceHistory = recentPrices
      .map((price, idx) => {
        const date = price.localDate;
        const closePrice = price.closePrice || price.close || price.price || 0;
        const volume = price.accumulatedTradingVolume || 0;
        const foreignRetentionRate = price.foreignRetentionRate || 0;

        return `<tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${moment(date).format("YYYY-MM-DD")}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(closePrice)}원</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(foreignRetentionRate)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(volume)}</td>
        </tr>`;
      })
      .join("");
  }

  // 주요 뉴스 링크
  let newsLinks = "";
  const newsItems = news || [];

  if (newsItems.length > 0) {
    newsLinks = newsItems
      .map((item, idx) => {
        return `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`;
      })
      .join("");
  }

  // 관련 링크 버튼 생성
  const opentalkUrl =
    channelInfo && channelInfo.opentalkUrl ? channelInfo.opentalkUrl : null;
  const mobileUrl = `https://m.stock.naver.com/item/main.nhn?code=${code}`;

  const linkButtons = `
    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 25px 0; justify-content: center;">
      ${
        opentalkUrl
          ? `<a href="${opentalkUrl}" target="_blank" 
             style="display: inline-block; 
                    padding: 2px 28px; 
                    background: linear-gradient(135deg, #03C75A 0%, #02B350 100%); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    font-size: 15px;
                    box-shadow: 0 4px 6px rgba(3, 199, 90, 0.3);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    height: 68px;">
        💬 네이버 오픈톡 채널
      </a>`
          : ""
      }
      <a href="${mobileUrl}" target="_blank" 
         style="display: inline-block; 
                padding: 2px 28px; 
                background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%); 
                color: white; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 15px;
                box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3);
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                height: 68px;">
        📱 종목 페이지
      </a>
    </div>
    <style>
      a[href*="opentalk"]:hover, a[href*="finance.naver.com"]:hover, a[href*="m.stock.naver.com"]:hover {
        transform: translateY(-2px) !important;
      }
      a[href*="opentalk"]:hover {
        box-shadow: 0 6px 12px rgba(3, 199, 90, 0.4) !important;
        background: linear-gradient(135deg, #02B350 0%, #019A45 100%) !important;
      }
      a[href*="finance.naver.com"]:hover {
        box-shadow: 0 6px 12px rgba(0, 102, 204, 0.4) !important;
        background: linear-gradient(135deg, #0052A3 0%, #003D7A 100%) !important;
      }
      a[href*="m.stock.naver.com"]:hover {
        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4) !important;
        background: linear-gradient(135deg, #45A049 0%, #3D8B40 100%) !important;
      }
    </style>
  `;

  const content = `
    <h2>📊 ${stockName} 주가 분석 리포트</h2>
    <img src="https://ssl.pstatic.net/imgfinance/chart/item/area/day/${code}.png" alt="${stockName}-주가-차트-${dateStr}" style="width: 100%; height: auto; margin-bottom: 20px;" />
    <p><strong>분석 일자:</strong> ${dateStr}</p>
    
    <h3>💰 현재 시세</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>현재가</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(currentPrice)}원</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>전일대비</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd; color: ${changePrice >= 0 ? "red" : "blue"}">
          ${changePrice >= 0 ? "+" : ""}${formatNumber(changePrice)}원 (${changeRate >= 0 ? "+" : ""}${changeRate.toFixed(2)}%)
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>전일종가</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(prevClose)}원</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>시가</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(openPrice)}원</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>고가</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(highPrice)}원</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>저가</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(lowPrice)}원</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>거래량</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(volume)}주</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>거래대금</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${formatNumber(tradingValue)}원</td>
      </tr>
    </table>

    <h3>${recommendation.emoji} 투자 의견: ${recommendation.grade}</h3>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
      <p><strong>${recommendation.reason}</strong></p>
      <ul>
        <li>가격 변동률: ${analysis.priceChange >= 0 ? "+" : ""}${analysis.priceChange}%</li>
        <li>거래량 변화: ${analysis.volumeChange >= 0 ? "+" : ""}${analysis.volumeChange}%</li>
        <li>뉴스 감정 지수: ${(analysis.newsSentiment * 100).toFixed(1)}</li>
        <li>가격 추세: ${analysis.trend === "upward" ? "상승" : analysis.trend === "downward" ? "하락" : "보합"}</li>
      </ul>
    </div>
    ${linkButtons}

    <h3>📈 최근 5일 가격 동향</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd;">날짜</th>
          <th style="padding: 10px; border: 1px solid #ddd;">종가</th>
          <th style="padding: 10px; border: 1px solid #ddd;">외국인 비율</th>
          <th style="padding: 10px; border: 1px solid #ddd;">거래량</th>
        </tr>
      </thead>
      <tbody>
        ${priceHistory}
      </tbody>
    </table>

    <h3>💡 투자 포인트</h3>
    <div style="background-color: #e8f4f8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h4 style="margin-top: 0; color: #2c3e50;">📊 기술적 분석</h4>
      <ul style="line-height: 1.8;">
        ${
          analysis.trend === "upward"
            ? "<li><strong>가격 추세:</strong> 최근 가격이 상승 추세를 보이고 있어 매수 관점에서 긍정적 신호로 해석됩니다. 다만 상승 추세가 지속될지 지켜볼 필요가 있습니다.</li>"
            : analysis.trend === "downward"
              ? "<li><strong>가격 추세:</strong> 최근 가격이 하락 추세를 보이고 있어 단기적으로는 주의가 필요합니다. 추가 하락 가능성을 염두에 두고 투자 결정을 내리는 것이 좋습니다.</li>"
              : "<li><strong>가격 추세:</strong> 가격이 횡보 중이며 명확한 방향성이 보이지 않습니다. 돌파 방향을 확인한 후 투자 결정을 내리는 것이 안전합니다.</li>"
        }
        ${
          Math.abs(changeRate) > 5
            ? `<li><strong>등락률 분석:</strong> 오늘 ${Math.abs(changeRate).toFixed(2)}%의 ${changeRate >= 0 ? "상승" : "하락"}을 기록했습니다. 이는 상당한 변동폭으로 시장의 관심이 집중되고 있음을 의미합니다.</li>`
            : Math.abs(changeRate) > 2
              ? `<li><strong>등락률 분석:</strong> 오늘 ${Math.abs(changeRate).toFixed(2)}%의 ${changeRate >= 0 ? "상승" : "하락"}을 보였습니다. 적정한 수준의 변동으로 보입니다.</li>`
              : `<li><strong>등락률 분석:</strong> 오늘 ${Math.abs(changeRate).toFixed(2)}%의 ${changeRate >= 0 ? "소폭 상승" : "소폭 하락"}을 기록했습니다. 가격이 안정적인 수준을 유지하고 있습니다.</li>`
        }
        ${
          highPrice > 0 && lowPrice > 0 && currentPrice > 0
            ? (() => {
                const priceRange = highPrice - lowPrice;
                const rangePercent = (
                  (priceRange / currentPrice) *
                  100
                ).toFixed(2);
                const isNearHigh =
                  (highPrice - currentPrice) / priceRange < 0.1;
                const isNearLow = (currentPrice - lowPrice) / priceRange < 0.1;

                if (isNearHigh) {
                  return `<li><strong>가격 위치:</strong> 현재가가 오늘 고가 근처에 위치하고 있어 상승 모멘텀이 강한 것으로 보입니다. 다만 고가 저항선을 주의깊게 관찰해야 합니다.</li>`;
                } else if (isNearLow) {
                  return `<li><strong>가격 위치:</strong> 현재가가 오늘 저가 근처에 위치하고 있어 추가 하락 가능성보다는 반등 기대감이 있습니다. 저가 지지선을 확인하는 것이 중요합니다.</li>`;
                } else {
                  return `<li><strong>가격 위치:</strong> 현재가가 오늘 거래 범위(${formatNumber(lowPrice)}원 ~ ${formatNumber(highPrice)}원)의 중간 지점에 위치하고 있습니다. 변동폭은 ${rangePercent}%로 ${rangePercent > 3 ? "큰 편" : "적정한 수준"}입니다.</li>`;
                }
              })()
            : ""
        }
        ${
          openPrice > 0 && currentPrice > 0
            ? (() => {
                const openChange = (
                  ((currentPrice - openPrice) / openPrice) *
                  100
                ).toFixed(2);
                if (Math.abs(openChange) > 2) {
                  return `<li><strong>시가 대비:</strong> 시가(${formatNumber(openPrice)}원) 대비 ${openChange >= 0 ? "+" : ""}${openChange}% ${openChange >= 0 ? "상승" : "하락"}했습니다. ${openChange >= 0 ? "강세" : "약세"} 흐름이 지속되고 있습니다.</li>`;
                } else {
                  return `<li><strong>시가 대비:</strong> 시가(${formatNumber(openPrice)}원) 대비 ${openChange >= 0 ? "+" : ""}${openChange}%로 큰 변화 없이 거래되고 있습니다.</li>`;
                }
              })()
            : ""
        }
      </ul>

      <h4 style="margin-top: 20px; color: #2c3e50;">📈 거래량 및 유동성 분석</h4>
      <ul style="line-height: 1.8;">
        ${
          Math.abs(analysis.volumeChange) > 50
            ? `<li><strong>거래량 변화:</strong> 거래량이 전일 대비 ${analysis.volumeChange >= 0 ? "+" : ""}${Math.abs(analysis.volumeChange).toFixed(1)}% ${analysis.volumeChange >= 0 ? "증가" : "감소"}했습니다. 이는 시장 참여자들의 ${analysis.volumeChange >= 0 ? "관심이 급증" : "관심이 크게 줄어든"} 상태를 의미합니다.</li>`
            : Math.abs(analysis.volumeChange) > 20
              ? `<li><strong>거래량 변화:</strong> 거래량이 전일 대비 ${analysis.volumeChange >= 0 ? "+" : ""}${Math.abs(analysis.volumeChange).toFixed(1)}% ${analysis.volumeChange >= 0 ? "증가" : "감소"}했습니다. ${analysis.volumeChange >= 0 ? "활발한 거래" : "거래 위축"}가 감지됩니다.</li>`
              : Math.abs(analysis.volumeChange) > 0
                ? `<li><strong>거래량 변화:</strong> 거래량이 전일 대비 ${analysis.volumeChange >= 0 ? "+" : ""}${Math.abs(analysis.volumeChange).toFixed(1)}%로 ${analysis.volumeChange >= 0 ? "소폭 증가" : "소폭 감소"}했습니다. 거래량은 안정적인 수준을 유지하고 있습니다.</li>`
                : "<li><strong>거래량 변화:</strong> 거래량 변화가 미미하여 시장 참여가 제한적인 상태입니다.</li>"
        }
        ${
          tradingValue > 0
            ? (() => {
                const tradingValueBillion = (tradingValue / 1000000000).toFixed(
                  2
                );
                if (tradingValue > 1000000000000) {
                  return `<li><strong>거래대금:</strong> 오늘 거래대금이 ${tradingValueBillion}조원으로 매우 높은 수준입니다. 대형 자금의 움직임이 활발한 것으로 보입니다.</li>`;
                } else if (tradingValue > 500000000000) {
                  return `<li><strong>거래대금:</strong> 오늘 거래대금이 ${tradingValueBillion}조원으로 높은 수준입니다. 시장의 관심이 집중되고 있습니다.</li>`;
                } else {
                  return `<li><strong>거래대금:</strong> 오늘 거래대금이 ${tradingValueBillion}조원으로 보통 수준입니다.</li>`;
                }
              })()
            : ""
        }
        ${
          volume > 0 && currentPrice > 0
            ? (() => {
                const avgPrice = tradingValue / volume;
                const priceDiff =
                  (Math.abs(currentPrice - avgPrice) / currentPrice) * 100;
                if (priceDiff > 2) {
                  return `<li><strong>평균 체결가:</strong> 거래량 대비 평균 체결가와 현재가의 차이가 ${priceDiff.toFixed(2)}%로 나타나 ${currentPrice > avgPrice ? "상단" : "하단"}에서 거래가 집중되고 있습니다.</li>`;
                } else {
                  return `<li><strong>평균 체결가:</strong> 거래가 현재가 근처에서 균형있게 이루어지고 있습니다.</li>`;
                }
              })()
            : ""
        }
      </ul>

      <h4 style="margin-top: 20px; color: #2c3e50;">📰 뉴스 및 시장 심리 분석</h4>
      <ul style="line-height: 1.8;">
        ${
          analysis.newsSentiment > 0.3
            ? "<li><strong>뉴스 감정:</strong> 최근 뉴스가 대체로 매우 긍정적인 편입니다. 시장 심리에 긍정적 영향을 미칠 가능성이 높습니다.</li>"
            : analysis.newsSentiment > 0.1
              ? "<li><strong>뉴스 감정:</strong> 최근 뉴스가 긍정적인 편입니다. 다만 과도한 낙관은 경계해야 합니다.</li>"
              : analysis.newsSentiment > -0.1
                ? "<li><strong>뉴스 감정:</strong> 최근 뉴스가 중립적인 편입니다. 특별한 호재나 악재 없이 시장이 움직이고 있습니다.</li>"
                : analysis.newsSentiment > -0.3
                  ? "<li><strong>뉴스 감정:</strong> 최근 뉴스가 다소 부정적인 편입니다. 추가적인 부정적 뉴스에 주의가 필요합니다.</li>"
                  : "<li><strong>뉴스 감정:</strong> 최근 뉴스가 매우 부정적인 편입니다. 시장 심리에 부정적 영향을 미칠 가능성이 높아 주의가 필요합니다.</li>"
        }
        ${
          newsItems.length > 0
            ? `<li><strong>뉴스 활동:</strong> 최근 ${newsItems.length}건의 주요 뉴스가 발생했습니다. 뉴스의 영향력을 지속적으로 모니터링하는 것이 중요합니다.</li>`
            : "<li><strong>뉴스 활동:</strong> 최근 특별한 뉴스가 없어 시장이 기술적 요인에 의해 움직이고 있을 가능성이 있습니다.</li>"
        }
      </ul>

      <h4 style="margin-top: 20px; color: #2c3e50;">🎯 투자 전략 제안</h4>
      <ul style="line-height: 1.8;">
        ${
          recommendation.grade === "매수"
            ? "<li><strong>매수 전략:</strong> 현재 시점에서 매수를 고려할 수 있습니다. 다만 분할 매수를 통해 리스크를 분산시키는 것이 좋습니다. 목표가는 설정하되 손절가도 함께 설정하여 리스크 관리를 철저히 하시기 바랍니다.</li>"
            : recommendation.grade === "관망"
              ? "<li><strong>관망 전략:</strong> 현재는 관망하는 것이 좋겠습니다. 명확한 방향성이 나타날 때까지 기다리거나, 추가적인 정보를 수집한 후 투자 결정을 내리는 것을 권장합니다.</li>"
              : "<li><strong>매도/보유 전략:</strong> 현재 시점에서는 매수를 지양하고, 보유 중이라면 일부 매도를 고려하거나 손절가를 설정하여 리스크를 관리하는 것이 좋겠습니다.</li>"
        }
        ${
          Math.abs(changeRate) > 3
            ? "<li><strong>변동성 관리:</strong> 오늘 큰 변동폭을 보였으므로, 향후 변동성 확대 가능성을 염두에 두고 포지션 크기를 조절하는 것이 중요합니다.</li>"
            : "<li><strong>변동성 관리:</strong> 현재 변동성이 안정적인 수준이므로, 일반적인 리스크 관리 원칙을 따르면 됩니다.</li>"
        }
        ${
          analysis.trend === "upward" && analysis.volumeChange > 20
            ? "<li><strong>모멘텀 전략:</strong> 상승 추세와 거래량 증가가 동반되고 있어 모멘텀 전략을 고려할 수 있습니다. 다만 과열 신호에 주의하세요.</li>"
            : analysis.trend === "downward" && analysis.volumeChange < -20
              ? "<li><strong>하락 모멘텀:</strong> 하락 추세와 거래량 감소가 동반되고 있어 추가 하락 가능성이 있습니다. 신중한 접근이 필요합니다.</li>"
              : ""
        }
      </ul>

      <h4 style="margin-top: 20px; color: #2c3e50;">⚠️ 리스크 요인</h4>
      <ul style="line-height: 1.8;">
        ${
          Math.abs(changeRate) > 5
            ? "<li>단기적으로 큰 변동폭을 보이고 있어 변동성 리스크가 높습니다.</li>"
            : ""
        }
        ${
          analysis.newsSentiment < -0.2
            ? "<li>부정적인 뉴스 흐름이 지속될 경우 추가 하락 압력이 가해질 수 있습니다.</li>"
            : ""
        }
        ${
          analysis.trend === "downward" && analysis.volumeChange < -30
            ? "<li>하락 추세와 거래량 감소가 동반되어 약세 모멘텀이 강화될 수 있습니다.</li>"
            : ""
        }
        ${
          highPrice > 0 &&
          currentPrice > 0 &&
          (highPrice - currentPrice) / highPrice < 0.02
            ? "<li>고가 근처에서 거래되고 있어 저항선 테스트 중입니다. 돌파 실패 시 조정 가능성이 있습니다.</li>"
            : ""
        }
        <li>시장 전체 상황과 외부 요인(경제 지표, 정책 변화 등)에 대한 지속적인 모니터링이 필요합니다.</li>
      </ul>

      <h4 style="margin-top: 20px; color: #2c3e50;">💎 기회 요인</h4>
      <ul style="line-height: 1.8;">
        ${
          analysis.trend === "upward" && analysis.volumeChange > 20
            ? "<li>상승 추세와 거래량 증가가 동반되어 강세 모멘텀이 형성되고 있습니다.</li>"
            : ""
        }
        ${
          analysis.newsSentiment > 0.2
            ? "<li>긍정적인 뉴스 흐름이 지속될 경우 추가 상승 동력이 될 수 있습니다.</li>"
            : ""
        }
        ${
          lowPrice > 0 &&
          currentPrice > 0 &&
          (currentPrice - lowPrice) / lowPrice < 0.02
            ? "<li>저가 근처에서 거래되고 있어 지지선 테스트 중입니다. 지지선 유지 시 반등 기회가 있습니다.</li>"
            : ""
        }
        ${
          Math.abs(changeRate) < 1 && analysis.volumeChange > 10
            ? "<li>가격은 안정적이면서 거래량이 증가하고 있어 관심도 상승의 신호일 수 있습니다.</li>"
            : ""
        }
        <li>장기 투자 관점에서 현재 가격대가 매력적일 수 있으니, 종목의 펀더멘털을 함께 검토해보시기 바랍니다.</li>
      </ul>
    </div>

    <h3>📰 주요 뉴스</h3>
    <ul style="line-height: 1.8;">
      ${newsLinks}
    </ul>


    <h3>🔗 관련 링크</h3>
    <ul>
      ${
        channelInfo && channelInfo.opentalkUrl
          ? `<li><a href="${channelInfo.opentalkUrl}" target="_blank">네이버 오픈톡 채널</a></li>`
          : ""
      }
      <li><a href="https://finance.naver.com/item/main.naver?code=${code}" target="_blank">네이버 증권 종목 페이지</a></li>
      <li><a href="https://m.stock.naver.com/item/main.nhn?code=${code}" target="_blank">모바일 종목 페이지</a></li>
    </ul>

    <hr style="margin: 30px 0;">
    <p style="color: #666; font-size: 12px;">
      <strong>면책사항:</strong> 본 분석은 참고용이며, 투자 결정에 대한 책임은 투자자 본인에게 있습니다. 
      실제 투자 전 충분한 검토와 전문가 상담을 권장합니다.
    </p>
  `;

  return content;
};

// 메인 함수: 주식 정보 수집 및 글 생성
const generateStockPost = async (code, stockName, wpCategoryId) => {
  try {
    console.log(`\n📊 ${stockName}(${code}) 주가 분석 시작...`);

    // 모든 정보 수집
    const [realtime, dayCandle, news, channelInfo] = await Promise.all([
      getRealtimePrice(code).catch((e) => {
        console.error("실시간 시세 조회 실패:", e.message);
        return null;
      }),
      getDayCandle(code).catch((e) => {
        console.error("일별 시세 조회 실패:", e.message);
        return null;
      }),
      getStockNews(code, 10, 1).catch((e) => {
        console.error("뉴스 조회 실패:", e.message);
        return null;
      }),
      getStockChannelInfo(code).catch((e) => {
        console.error("종목 정보 조회 실패:", e.message);
        return null;
      }),
    ]);

    // 분석 수행
    const analysis = analyzeStock(realtime, dayCandle, news);
    const recommendation = getRecommendation(analysis);

    // 제목 생성
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
    const title = `${stockName} 주가 분석 (${dateStr})`;

    // 콘텐츠 생성
    const content = generateContent(
      stockName,
      code,
      realtime,
      dayCandle,
      news,
      channelInfo,
      analysis,
      recommendation
    );

    console.log(content);

    // 워드프레스에 업로드
    console.log(`\n📝 워드프레스에 글 업로드 중...`);
    const postUrl = await wpCreatePost(title, content, wpCategoryId);

    if (postUrl) {
      console.log(`✅ 성공! 게시글 URL: ${postUrl}`);
      return { success: true, url: postUrl, title, recommendation };
    } else {
      console.error("❌ 워드프레스 업로드 실패");
      return { success: false, error: "워드프레스 업로드 실패" };
    }
  } catch (error) {
    console.error(`❌ ${stockName} 글 생성 실패:`, error.message);
    return { success: false, error: error.message };
  }
};

// 카테고리별로 글 생성
const generateAllPosts = async () => {
  const results = [];

  for (const category of categories) {
    const result = await generateStockPost(
      category.code,
      category.name,
      category.wpCategoryId
    );
    results.push(result);

    // API 호출 제한을 고려한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return results;
};

module.exports = {
  generateStockPost,
  generateAllPosts,
};
