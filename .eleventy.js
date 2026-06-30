const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
eleventyConfig.addPassthroughCopy("src/styles.css");
eleventyConfig.addPassthroughCopy("src/signs");
eleventyConfig.addPassthroughCopy("src/gallery");
eleventyConfig.addPassthroughCopy("src/photos");

// 文章發表時間的 filter
eleventyConfig.addFilter("readableDate", (dateObj, inputPath) => {
  let d;

  // 如果有指定 date，優先使用指定的 date
  if (dateObj) {
    if (dateObj instanceof Date) {
      d = dateObj;
    } else if (typeof dateObj === "string" || typeof dateObj === "number") {
      const parsed = new Date(dateObj);
      if (!Number.isNaN(parsed.getTime())) {
        d = parsed;
      }
    }
  }

  if (!d && inputPath) {
    // 否則讀取文件的最後修改時間
    try {
      const filePath = path.join(__dirname, inputPath);
      const stats = fs.statSync(filePath);
      d = new Date(stats.mtime);
    } catch (error) {
      // 如果無法讀取文件，使用當前日期
      d = new Date();
    }
  }

  if (!d) {
    // 如果既沒有 dateObj 也沒有 inputPath，使用當前日期
    d = new Date();
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});

// 計算閱讀時間的 filter
eleventyConfig.addFilter("readingTime", (content) => {
  // 移除 HTML tag
  const text = content.replace(/<[^>]*>/g, "").trim();

  // 移除空白與換行，只算實際字元
  const charCount = text.replace(/\s+/g, "").length;

  // 以每分鐘 250 字估算
  const minutes = Math.max(1, Math.ceil(charCount / 250));

  return minutes;
});

// 計算字元數的 filter
eleventyConfig.addFilter("charCount", (content) => {
  // 移除 HTML tag
  const text = content.replace(/<[^>]*>/g, "").trim();

  // 計算字元數（包含空白）
  return text.length;
});

// 自訂 strftime filter，支援 %Y, %m, %d, %m-%d 格式
eleventyConfig.addFilter("strftime", (date, format) => {
  if (!(date instanceof Date)) {
    return "";
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  // 根據 format 返回對應的值
  if (format === "%Y") return year.toString();
  if (format === "%m") return month;
  if (format === "%d") return day;
  if (format === "%m-%d") return `${month}-${day}`;
  
  // 默認返回 YYYY-MM-DD
  return `${year}-${month}-${day}`;
});

// 文章 collection，按日期倒序排列
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
      widths: [300, 1000],
      formats: ["webp"],
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

// works collection，按日期倒序排列
eleventyConfig.addCollection("works", function (collectionApi) {
  return collectionApi
  .getFilteredByGlob("./src/works/*.md")
  .sort((a, b) => b.date - a.date);
});

// photos collection，自動掃描 photos 目錄中的所有圖片
eleventyConfig.addCollection("photos", function () {
  const photosDir = path.join(__dirname, "src/photos");
  const photos = fs.readdirSync(photosDir)
    .filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file))
    .sort((a, b) => b.localeCompare(a)); // 倒序排列
  
  return photos.map(file => ({
    name: file,
    path: `photos/${file}`,
    nameWithoutExt: path.basename(file, path.extname(file))
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
