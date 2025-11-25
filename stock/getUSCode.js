const fs = require("fs");
const axios = require("axios");

const run = async () => {
  const result = [];
  // for(let i = 1; i <= 38; i++) {
  for (let i = 1; i <= 38; i++) {
    const url = `https://api.stock.naver.com/stock/exchange/NASDAQ/marketValue?page=${i}&pageSize=100`;
    const response = await axios.get(url);
    const {
      data: { stocks },
    } = response;
    console.log(stocks.length);

    for (const stock of stocks) {
      const { reutersCode, stockName } = stock;
      result.push({ code: reutersCode, name: stockName, wpCategoryId: 26 });
    }
  }

  fs.writeFileSync("./us-categories.json", JSON.stringify(result, null, 2));
};

run();
