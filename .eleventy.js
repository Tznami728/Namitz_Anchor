module.exports = function (eleventyConfig) {
eleventyConfig.addPassthroughCopy("src/styles.css");
eleventyConfig.addPassthroughCopy("src/images");
eleventyConfig.addPassthroughCopy("src/gallery");

eleventyConfig.addFilter("readableDate", (dateObj) => {
  const d = new Date(dateObj);
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
