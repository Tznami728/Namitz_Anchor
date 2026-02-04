
2026-02-03 插入圖片，美化Sidebar
    <img src="/images/hero.jpg" alt="個人空間圖片" />
    eleventyConfig.addPassthroughCopy("src/images");
    //在11ty建置目錄
    .hero-image {
    max-width: 600px;
    width: 100%;
    height: auto;
    }
    //在css增加響應式設計

2026-02-04 建立Blog連結，自動連結到最新的Post
    <h2><a href="{{ (collections.posts | first).url }}">Blog</a></h2>
    
2026-02-04 建立git版本管理
