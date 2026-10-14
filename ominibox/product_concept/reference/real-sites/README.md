# Real-site reference screenshots

Captured 2026-10-12 with ego-browser, logged out, viewport 1200×676. UI reference only: the video uses them to check layout, not as footage.

| File | URL | Logged-out result |
|---|---|---|
| 01_zhihu_home.png | www.zhihu.com | Redirects to the sign-in page (QR code / SMS) |
| 01b_zhihu_search.png | zhihu.com/search?q=AI Agent 第二大脑 | Header loads, results stay empty: login required |
| 02_zhihu_column.png | zhuanlan.zhihu.com | Column landing loads; login popover; no article links exposed |
| 03_bilibili_home.png | www.bilibili.com | OK (login prompt in header only) |
| 04_bilibili_search_RAG.png | search.bilibili.com/all?keyword=RAG | OK |
| 04b_bilibili_video_page.png | bilibili.com/video/BV1otokBpENn | OK: title, player cover, actions, playlist |
| 05_xiaohongshu_explore.png | www.xiaohongshu.com/explore | Feed loads; search says "登录探索更多内容" |
| 05b_xiaohongshu_note.png | xiaohongshu.com/explore/6aa4c85f… | Note blocked → 404 "页面不见了" (error 300031): login required |
| 06_x_home.png | x.com | Login wall only |
| 06b_x_profile.png | x.com/github | Profile header visible; posts hidden behind "Continue to X" login |
| 07_github_omnibox.png | github.com/import-ai/omnibox | OK (first try returned 504, retry succeeded) |
| 08_wechat_web.png | wx.qq.com | QR-code login only |
| 09_qq.png | im.qq.com | Download landing page only; no web chat |
| 10_douyin.png | www.douyin.com → /jingxuan | OK: feed loads without login |
| 11_omnibox_web.png | www.omnibox.pro | OK: product homepage |

## Layout references used for the rebuilt video pages (2026-10-14)

ego-browser screenshots failed this round (`Page.captureScreenshot` → "Unable to capture screenshot"), so the layout was read from the live DOM instead (computed fonts, sizes, colors and positions):

- **Zhihu column article** — `zhuanlan.zhihu.com/p/2009587746952472367` (found via DuckDuckGo; Bing/Baidu/Sogou returned nothing). Readable logged out after closing the login modal. Header 62 px, content card 694 px + 296 px sidebar ("关于作者", "大家都在搜"), title 24/500 #191B1F, blockquote with 3 px #C4C7CE left border, sticky action bar with the #1772F6 赞同 pill.
- **Bilibili video page** — `bilibili.com/video/BV1otokBpENn`: header 64 px, title 20/500, stats 13 px #9499A0, player control bar, danmaku sending bar, like/coin/favorite/forward toolbar in #61666D.
- **Logged-in chrome, Xiaohongshu, X** — taken from the user's screenshots in `../../assets/screenshot/` (zhihu, bilibili, xiaohongshu, x).
