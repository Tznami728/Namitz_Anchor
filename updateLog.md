
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

2026-02-06 更換字體、個人簽名圖片、新增關於我頁面
    font-family: "Noto Serif TC", PMingLiU, "LiSong Pro","Times New Roman", serif;

2026-02-10 修改為底部導覽列(AI生成)
    文章列表改到Blog頁面裡

2026-02-11 小修改
    簡化關於我為單一頁面
    版面微調
    更改導覽列在active狀態的視覺樣式：取消顏色背景，增加下底線
    終於搞定版面置中了 (是說現在CSS樣式的階層有點複雜了)