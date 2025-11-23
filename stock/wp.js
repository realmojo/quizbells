const WPAPI = require("wpapi");

const wpToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJ0ZWNodXBib3giLCJpYXQiOjE3NjM5MTMzMjUsImV4cCI6MTkyMTU5MzMyNX0.6xKzn3ZUzAPaxvZjLVM4aHdN17uuVP1GN90OeiuGN0Y";

const wp = new WPAPI({
  endpoint: "https://techupbox.com/wp-json",
  username: "admin",
  password: "password",
});

const wpCreatePost = async (title, content, category = 13) => {
  if (!title && !content) {
    return;
  }

  try {
    try {
      const params = {
        title,
        content: content,
        categories: [category],
        status: "publish",
      };
      console.log(params);

      const response = await wp
        .posts()
        .setHeaders("Authorization", `Bearer ${wpToken}`)
        .create(params);

      if (response) {
        console.log(response.title.raw);
        console.log(response.link);

        return response.link;
      }
    } catch (e) {
      console.log("워드프레스 등록 실패", e);
    }
  } catch (e) {
    console.log("no json", e);
  }
};

module.exports = {
  wpCreatePost,
};
