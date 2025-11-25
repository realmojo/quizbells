const { runSingle, runAll, determineMarket } = require("./run");

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body, null, 2),
});

const extractPayload = (event = {}) => {
  let body = {};
  if (typeof event.body === "string") {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = {};
    }
  } else if (typeof event.body === "object" && event.body !== null) {
    body = event.body;
  }

  const query = event.queryStringParameters || {};

  return {
    mode: body.mode || event.mode || query.mode || "all",
    market:
      body.market ||
      event.market ||
      query.market ||
      (event.detail && event.detail.market) ||
      null,
  };
};

exports.handler = async (event = {}) => {
  try {
    const { mode, market: preferredMarket } = extractPayload(event);
    const market = determineMarket(
      preferredMarket && preferredMarket.toLowerCase()
    );

    if (mode === "single") {
      const result = await runSingle(market);
      return createResponse(200, {
        success: true,
        market,
        mode,
        result,
      });
    }

    const results = await runAll(market);
    return createResponse(200, {
      success: true,
      market,
      mode: "all",
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Lambda 실행 실패:", error);
    return createResponse(500, {
      success: false,
      error: error.message || "Unknown error",
    });
  }
};

