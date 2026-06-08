const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
eleventyConfig.addPassthroughCopy("src/styles.css");
eleventyConfig.addPassthroughCopy("src/images");
eleventyConfig.addPassthroughCopy("src/gallery");
eleventyConfig.addPassthroughCopy("src/photos");

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

// 圖片處理 Shortcode
eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt, sizes = "100vw") => {
  const imagePath = path.join(__dirname, "src", src);
  
  try {
    const metadata = await Image(imagePath, {
      widths: [300, 600, 1000],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      filenameFormat: function (id, src, width, format, options) {
        let outputFilename = `${path.basename(src, path.extname(src))}-${width}w.${format}`;
        return outputFilename;
      }
    });

    const imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  } catch (error) {
    console.error(`Error processing image: ${src}`, error.message);
    // 如果圖片處理失敗，返回原始圖片
    return `<img src="/photos/${path.basename(src)}" alt="${alt}" loading="lazy" decoding="async">`;
  }
});

eleventyConfig.addCollection("works", function (collectionApi) {
  return collectionApi
  .getFilteredByGlob("./src/works/*.md")
  .sort((a, b) => b.date - a.date);
});

eleventyConfig.addCollection("photos", function () {
  const photosDir = path.join(__dirname, "src/photos");
  const photos = fs.readdirSync(photosDir)
    .filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file))
    .sort((a, b) => b.localeCompare(a)); // 倒序排列
  
  return photos.map(file => ({
    name: file,
    path: `photos/${file}`
  }));
});
//photos collection，自動掃描 photos 目錄中的所有圖片
//按檔案名稱倒序排列（最新的圖片在前）
//添加 photos 的 passthrough copy，確保圖片被複製到輸出目錄

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
