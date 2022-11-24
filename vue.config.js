process.env.BASE_URL = "index.html";
const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '.'
    : '.',

  pages: {
    index: {
      entry: "src/main.ts",
      template: "app/public/index.html",
      filename: "index.html",
    },
  },

};
