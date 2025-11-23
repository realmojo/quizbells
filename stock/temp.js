const fs = require("fs");

const categories = fs.readFileSync("./a.txt", "utf8");

const d = categories.split("\n");

const result = d.map((item) => {
  const [code, name] = item.split("\t");
  return { code, name, wpCategoryId: 25 };
});

fs.writeFileSync("./categories.json", JSON.stringify(result, null, 2));
