const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
eleventyConfig.addPassthroughCopy("src/styles.css");
eleventyConfig.addPassthroughCopy("src/images");
eleventyConfig.addPassthroughCopy("src/gallery");

eleventyConfig.addFilter("readableDate", (dateObj, inputPath) => {
  let d;
  
  // 如果有指定 date，優先使用指定的 date
  if (dateObj && dateObj instanceof Date) {
    d = dateObj;
  } else if (inputPath) {
    // 否則讀取文件的最後修改時間
    try {
      const filePath = path.join(__dirname, inputPath);
      const stats = fs.statSync(filePath);
      d = new Date(stats.mtime);
    } catch (error) {
      // 如果無法讀取文件，使用當前日期
      d = new Date();
    }
  } else {
    // 如果既沒有 dateObj 也沒有 inputPath，使用當前日期
    d = new Date();
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});

eleventyConfig.addFilter("readingTime", (content) => {
  // 移除 HTML tag
  const text = content.replace(/<[^>]*>/g, "").trim();

  // 移除空白與換行，只算實際字元
  const charCount = text.replace(/\s+/g, "").length;

  // 以每分鐘 350 字估算
  const minutes = Math.max(1, Math.ceil(charCount / 350));

  return minutes;
});

eleventyConfig.addFilter("charCount", (content) => {
  // 移除 HTML tag
  const text = content.replace(/<[^>]*>/g, "").trim();

  // 計算字元數（包含空白）
  return text.length;
});

eleventyConfig.addCollection("posts", function (collectionApi) {
  return collectionApi
  .getFilteredByGlob("src/posts/*.md")
  .sort((a, b) => b.date - a.date);
});

eleventyConfig.addCollection("works", function (collectionApi) {
  return collectionApi
  .getFilteredByGlob("./src/works/*.md")
  .sort((a, b) => b.date - a.date);
});

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
