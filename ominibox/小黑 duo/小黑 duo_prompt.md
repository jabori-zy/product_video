# 小黑 OmniBox ·「小黑 Duo」仿发布会恶搞短片提示词 v2（AI 视频生成 · 无口播）

> 形式：参照《咪duo》参考片，把小黑当成一台「新品硬件」来发布：微距拍身体部位，旁边打一行像参数又像段子的文案。
> 规格：1920×1080 · 24 fps · **约 33 秒**，10 个镜头 · 响度 −14 LUFS · 不配口播，只用音乐、音效和画面文字
> 素材：`assets/咪duo 参考视频.mp4`（运镜与文案结构参考）、`assets/小黑参考图.jpg`（小黑头部六视图）
> 事实来源：帮助文档 https://www.omnibox.pro/docs/zh-cn/llms.txt（2026-09-28 阅读）
> 流程：① 生成小黑全身设定图 → ② 逐镜头图生视频 → ③ 后期上字、调色、配乐、剪辑。**文字一律在后期叠加，不让视频模型画字。**

---

## 0. 参考片拆解（咪duo 参考视频.mp4 · 1280×720 · 24 fps · 33.0 s）

**整体套路**：用手机发布会的腔调介绍一只普通的狸花猫。纯白无影棚，猫是唯一主体，全片几乎都是微距和近景。每个镜头只讲一个身体部位，配一行「参数腔 + 反差梗」的文案。结尾拉成全身，用一个「松弛」的反差姿势收尾，最后白底出 logo。

### 0.1 镜头与运镜

| # | 时间 | 景别 / 主体 | 运镜 | 文字（原文） | 文字排版 |
|---|---|---|---|---|---|
| 1 | 0.0–2.9 s | 大特写：眼睛 | 从毛发虚焦里横移进来，焦点落到瞳孔上，然后缓慢推近，瞳孔微微收缩 | **极差视力范围**<br>小字：超绝近视眼 | 居中压在眼睛上，白字，主标加一行小副标 |
| 2 | 3.0–5.4 s | 微距：耳朵 | 绕耳朵缓慢环绕（约 30°），景深极浅，焦点从耳廓扫到耳尖，耳朵抖动一下 | **搭配孜然妙脆角** | 画面右侧单行，灰字 |
| 3 | 5.5–9.8 s | 近景：正脸 | 固定机位，几乎不动，只有极轻的呼吸感推近；猫张嘴叫一声 | **双耳传感** ｜ **随时监听** | 左右各一行，夹住脑袋。猫叫的时候，两侧横穿一条黄色声波线，随声音跳动 |
| 4 | 9.9–11.9 s | 特写：3/4 侧脸 | 固定机位，猫转头、眯眼、打哈欠前的酝酿 | 无 | 留白，作为喘气镜头 |
| 5 | 12.0–14.4 s | 特写：张大嘴（打哈欠 / 哈气） | 轻微推近，嘴张到最大时停一拍 | **超大火气　满嘴芬芳** | 文字沿嘴巴外沿排成**弧形**，跟着嘴一起出现，嘴闭上后文字还留一会儿 |
| 6 | 14.4–15.3 s | 转场：身体毛发 | 快速下摇（whip pan），毛发拉出运动模糊 | 无 | — |
| 7 | 15.4–22.3 s | 近景：伸爪 | 固定机位，猫朝镜头反复出爪，爪垫冲到镜头前失焦、再收回（焦点在爪和脸之间来回） | **抓人不卡顿**（左上）<br>**咬人不掉帧**（右下） | 对角线排布，第二行晚半拍出现 |
| 8 | 22.4–23.9 s | 转场：爪垫盖满镜头 → 毛发 | 爪子扑上镜头，画面被黑色爪垫盖满，接着在毛发上横移 | 无 | 用黑色做遮挡转场 |
| 9 | 24.0–29.9 s | 大全景：全身「葛优瘫」 | 从肚皮特写开始**上摇 + 后拉**，露出全身：猫像人一样靠坐、两腿岔开 | **Mi Duo**<br>小字：松弛，天生专业 | 左侧，大号无衬线品牌名加一行小副标，猫在右侧三分线 |
| 10 | 30.0–33.0 s | 白底 logo | 画面淡到纯白，再淡入 logo | 猫剪影 logo + **Mi Duo** | 画面正中，小尺寸，留大量白 |

**运镜规律**
- **从局部到整体**：眼 → 耳 → 脸 → 嘴 → 爪 → 全身。先吊胃口，最后一次把全身亮出来，这就是笑点。
- **全程慢、稳、浅景深**：模仿产品广告的机械臂微距（慢推、慢环绕、跟焦），唯一的快动作是两次转场（第 6、8 镜）。
- **转场都借主体完成**：用毛发做 whip pan、用爪垫遮住镜头，没有 PPT 式的特效转场。
- **背景恒定**：纯白 / 浅灰无缝影棚，柔光、没有硬阴影，调色偏干净的冷白。

### 0.2 文案规律

- **结构**：「一本正经的参数词」+「猫的真实毛病」。例如：极差视力范围、双耳传感/随时监听、抓人不卡顿/咬人不掉帧。
- **句式**：四到五个字一行，常用对仗（双耳传感｜随时监听、超大火气｜满嘴芬芳、抓人不卡顿｜咬人不掉帧）。
- **字体**：细到中等粗细的无衬线黑体。白底画面用深灰字，画在猫身上时用白字。字很小很克制，没有描边和花字，只有第 5 镜用了弧形排字。
- **节奏**：每镜只出现一组字；在主体动作到位之后才出字，大约慢 0.3–0.5 秒；两行字之间错开半拍。
- **品牌收尾**：品牌名配一句「反差 slogan」（松弛，天生专业），然后白底 logo。

---

## 1. 文案总结：产品功能 × 猫的天性

### 1.1 产品功能（帮助文档 llms.txt 归纳）

**小黑 OmniBox：AI 驱动的一站式知识管理工具，你的 AI 知识伙伴。** 覆盖「收集、整理、应用、分享」四个环节，解决「收藏多、消化少」的问题。

| 环节 | 能力（只写文档里有的） |
|---|---|
| **收集** | **浏览器插件**（Chrome / Edge / Firefox / Safari，一键收藏整页或选区）；**微信助手**、QQ 助手、Telegram（转发文字、语音、图片、文件、链接即入库，末尾加 `#标签` 直接打标签）；微信 ClawBot；iOS / macOS 快捷指令；移动端 App（录音、拍照、链接）；**RSS 文件夹**（订阅后新内容自动入库）；上传本地文档、PDF、音视频 |
| **理解** | 网页和上传的文件**自动解析为可编辑文档**；**图片 OCR** 把图片变成可编辑文字；音视频转写 |
| **整理** | 文件夹、**标签**、批量管理；**智能文件夹**：按标题、标签、网页链接、正文、日期等规则自动汇集，不移动原文件 |
| **找** | **智能搜索**：关键词 + 语义搜索，「只记得大概意思」时输入一段自然语言描述也能找到；打开结果后自动滚到命中处并高亮；快捷键 ⌘J |
| **用** | **AI 问答 & 写作**：基于知识库回答并**附带引用**，点引用能定位到原文，也能联网搜索；**Agent 2.1**：查资料、读文档，提炼待办、结论、风险点和时间线，生成摘要、清单、报告和方案；能创建、编辑、移动、重命名知识库资源，管理标签和智能文件夹；**关键操作执行前先请求确认** |
| **分享** | 分享链接、邀请协作者进入团队空间 |
| **开放** | 开放 API；**开源**，支持 Docker **本地部署** |
| **价格** | 基础版免费，高级版按需升级 |

> 注意：微信助手只负责收藏，**不支持问答，收藏成功后也不回复**，片中不能画小黑在微信里回消息。

### 1.2 文案公式

参考片的公式是「参数词 + 猫的毛病」，小黑版改成 **「猫的天性 → 产品功能」**：
- **主标**：一句猫腔的四到七字短句，字面上说猫，其实说的是功能。可以对仗，也可以反差（猫做不到的，小黑做得到）。
- **副标**：一行小字，直接写真实功能名和它能做什么，保证每一镜都有产品事实。
- 顺序按产品链路走：**看（OCR）→ 听（转写）→ 收（微信助手）→ 找（搜索）→ 吃（收集）→ 抓（问答）→ 扒拉（Agent 整理）→ 躺（品牌）**。

### 1.3 文案映射表

| 镜 | 部位 / 动作 | 猫的天性 | 产品功能 | 主标 | 副标 |
|---|---|---|---|---|---|
| 1 | 眼睛 | 瞳孔会缩放，暗处也看得清 | 图片解析 OCR | **一眼识字** | 图片 OCR · 扫描件、截图秒变可编辑文字 |
| 2 | 耳朵 | 耳朵能转向声源，什么都听得见 | 音视频转写 | **竖耳听写** | 录音、音视频自动转写 · 一键摘要 |
| 3 | 正脸，喵一声 | 猫一向叫不来（反差） | 微信 / QQ 助手 | **随叫随到**　｜　**随发随存** | 微信 · QQ 助手：文字、语音、图片、文件、链接，转发即入库 |
| 4 | 侧脸眯眼 | 眯眼盯梢，藏起来的零食总能找到 | 智能搜索 | **记个大概　照样找到** | 关键词 + 语义搜索 · 打开自动定位高亮 |
| 5 | 收东西 + wink | 猫出了名的挑食（反差） | 全渠道收集 | **从不挑食　照单全收**（弧形） | 浏览器插件 · 本地上传 · RSS 订阅，网页、PDF、音视频全收 |
| 7 | 伸爪 ① | 爱抓东西 | AI 问答带引用 | **抓重点不卡顿**（左上） | AI 问答带引用，一点跳回原文 |
| 7 | 伸爪 ② | 爱把桌上的东西扒拉下去（反差） | Agent 2.1 整理 | **扒拉东西不添乱**（右下） | Agent 建文件夹、移动、打标签，改动前先问你 |
| 9 | 全身葛优瘫 | 一天睡十几个小时 | 品牌 | **小黑 OmniBox** | 松弛，天生好记性 |
| 10 | logo | — | 行动号召 | **小黑 OmniBox** | 你的 AI 知识伙伴<br>免费开始 · 开源可私有部署 · omnibox.pro |

**备选**（审片时可换）：
- 第 1 镜：过目成文 / 猫眼识图
- 第 2 镜：顺风耳，听完就成文
- 第 3 镜：一叫就到　｜　一发就存
- 第 4 镜：眯眼一找　一找就准
- 第 5 镜：来者不拒　统统收下
- 第 7 镜：抓重点不卡顿　｜　理资料不掉帧
- 第 9 镜：你负责躺平，小黑负责记住

---

## 2. 角色设定：小黑（补全身体）

### 2.1 头部（严格照参考图，不许改）
- 纯黑圆脑袋（#141414），下半部比上半部略宽，像一个圆润的饭团；两只尖耳，耳尖圆钝。
- 两只大眼睛：奶油色圆环（#FBF3E4）里一个纯黑实心瞳孔，瞳孔略偏向眼眶内侧。
- **全片没有嘴**（任何镜头都不张嘴，表情靠眼睛和耳朵，见 2.4 节），**没有鼻子、胡须和眉毛**，也没有腮红和高光描边。侧面只露一只眼，3/4 侧面时远处那只眼变成窄椭圆（按六视图）。

### 2.2 身体（新设计，需要和头部一样简洁）
- **比例**：头身比约 1 : 1，Q 版。身体是一颗圆润的梨形「豆袋」，肚子圆、坐下时往两边摊开，方便做第 9 镜的「葛优瘫」。
- **四肢**：短、粗、末端圆，像软糖条，没有关节线。爪子是圆头，**爪垫**比身体浅一档，用深炭灰（#2B2B2B），三颗小垫加一颗大垫（第 7、8 镜要靠它读出「爪子」）。
- **尾巴**：细长，末端略粗且圆，平时自然弯成问号形。
- **颜色**：全身纯黑，和头部一体，接缝处看不出任何分界。全片唯一的亮色只有眼圈的奶油色。
- **材质**（为了能拍微距）：**哑光植绒（flocked vinyl）的潮玩手办**质感。远看是一整块纯黑剪影，近看能看出极细的绒面颗粒和柔和的轮廓光，不要真实猫毛，也不要塑料反光。
- **嘴**：永远没有。需要表情时用 wink、眯眼、歪头和耳朵动作来演，见 2.4 节。

### 2.3 设定图提示词（建议 Nano Banana 2，参考图喂 `小黑参考图.jpg`）

```text
Character turnaround sheet of "Xiaohei", a minimalist black cartoon cat mascot, keep the head EXACTLY as the reference image:
pure matte black round head (#141414), two pointed ears with soft rounded tips, two large cream-colored ring eyes (#FBF3E4)
with solid black pupils, NO mouth, NO nose, NO whiskers.
Add a full body: chibi proportions, head-to-body ratio 1:1, soft pear-shaped bean-bag body, short stubby rounded limbs
like gummy candy, round paws with dark charcoal paw pads (#2B2B2B, three small pads + one large pad), a long thin tail
curling into a question-mark shape. The whole body is the same pure black as the head, seamless.
Material: matte flocked vinyl designer toy, very fine velvet texture visible up close, soft rim light, no fur, no gloss.
Views: front, left profile, right profile, left 3/4, right 3/4, back — plus 3 pose studies:
(1) standing, (2) raising one paw toward the viewer showing paw pads, (3) lazily slouching like a human on the floor,
back leaning, legs splayed, belly out.
Seamless white studio background, soft shadowless light, clean product-photo look, no text.
```

**验收**：六个视图的头部轮廓和眼睛与参考图重合；全身只有黑色和奶油色两个色块（爪垫的深炭灰除外）；看不出任何嘴线或鼻子。设定图定稿后，后面每个镜头都用它当参考图。

### 2.4 Wink 设定（全片无嘴，第 5 镜用 wink 代替张嘴）

小黑**全片都没有嘴**，没有嘴线，也不会临时张开。参考片里张嘴的那一镜（哈气），小黑版改成**朝镜头 wink**：表情全靠眼睛和耳朵来演。

**Wink 规则**
- **哪只眼**：正脸时闭**右眼**（画面左侧那只）；3/4 侧脸时闭离镜头近的那只，远处那只保持睁开。
- **闭眼的形状**：奶油色眼圈收成一条**向上拱的弯弧（^）**，线宽和眼圈的环宽一样，两端圆头；黑瞳孔跟着消失。不画睫毛，也不画眼皮。
- **另一只眼**：保持完整的眼圈加瞳孔，瞳孔看向镜头，大小不变。
- **节奏**：从圆环压扁成弧 4 帧，停 8 帧，弹回圆环 4 帧，共 16 帧（约 0.7 s）。弹回时带一点过冲，眼圈先略大一圈再回到原大小，显得俏皮。
- **配合动作**：闭眼的同时，头朝闭眼那一侧歪约 8°，同侧的耳朵往下一压；睁开时头回正，耳朵弹回。
- **禁止**：出现嘴、嘴线、腮红、星星特效、爱心贴纸；两只眼同时闭上（那是眨眼，不是 wink）。

**Wink 表情设定图提示词**（和 2.3 节的设定图一起出，参考图喂已定稿的全身设定图）

```text
Expression sheet of the same character Xiaohei (use the approved character sheet as reference, keep head shape, ears,
cream ring eyes and matte black flocked vinyl material exactly). Xiaohei has NO mouth in every frame — no mouth line,
no opening, no blush.
Show a WINK in front view and 3/4 view, 4 stages each:
(1) both eyes open, neutral;
(2) one eye squashing, the cream ring flattening;
(3) full wink: one eye becomes a single upward-curved cream arc (^) with rounded ends, same thickness as the eye ring,
no pupil, no eyelashes; the other eye stays a full open cream ring with black pupil looking at the viewer; head tilted
about 8 degrees toward the winking side, the ear on that side slightly lowered;
(4) eye popping back open slightly larger than normal (overshoot).
Seamless white studio background, soft shadowless light, no text, no sparkles, no hearts.
```

**验收**：每一格都没有嘴；wink 那只眼是一条干净的奶油色弯弧，另一只眼完整；头部轮廓和眼圈与设定图一致。定稿后导出关键帧 `小黑_wink.png`（第 5 镜用）。

---

## 3. 分镜与文案（对位参考片，逐镜替换）

> 文案见第 1.3 节。主标说猫、暗指功能，副标写真实功能。除了两个转场镜头，每一镜都讲一个功能。

| # | 时间 | 画面（小黑版） | 运镜（照参考片） | 主标 | 副标 / 小字 | 对应功能 |
|---|---|---|---|---|---|---|
| 1 | 0.0–3.0 s | 小黑一只眼的极近特写。奶油色眼圈占满半个画面，瞳孔像镜头光圈一样收缩一下；瞳孔表面倒映出一张扫描件，上面的文字逐行被细线框出（OCR 框） | 从黑色绒面虚焦里横移进来，焦点落到眼圈上，慢推 | **一眼识字** | 图片 OCR · 扫描件、截图秒变可编辑文字 | 图片解析 |
| 2 | 3.0–5.5 s | 小黑一只尖耳的微距，绒面颗粒可见。一圈圈奶油色细声波从画面外涌向耳朵，耳朵朝声源一转、抖一下，声波进耳后在耳边排成一行转写文字 | 绕耳朵慢速环绕约 30°，浅景深，焦点从耳根扫到耳尖 | **竖耳听写** | 录音、音视频自动转写 · 一键摘要 | 音视频转写 |
| 3 | 5.5–9.8 s | 正脸近景，小黑盯着镜头眨一次眼。7.0 s 它「喵」一声（只有声音，没有嘴）：头往上一点，双耳往上一抖，像被叫到名字，一条奶油色声波线从两侧横穿画面；8.0 s 线上依次滑过文字、语音条、图片、文件、链接五个小图标，从两边流进小黑的脑袋 | 固定机位，极轻的呼吸感推近 | **随叫随到**　｜　**随发随存** | 微信 · QQ 助手：文字、语音、图片、文件、链接，转发即入库 | 微信 / QQ 助手 |
| 4 | 9.9–12.0 s | 3/4 侧脸特写，小黑慢慢转头看向画面左侧，眼睛眯成两条细线，像猫盯梢。左侧浮出一个搜索框，逐字打出「上次那篇讲定价的文章」，随即弹出一张结果卡，其中一行被高亮 | 固定机位 | **记个大概　照样找到** | 关键词 + 语义搜索 · 打开自动定位高亮 | 智能搜索 |
| 5 | 12.0–14.4 s | 小黑 3/4 侧脸近景，全程没有嘴。聊天气泡、网页卡片、PDF 图标、RSS 图标、视频播放图标从画面四边一个接一个飞来，碰到小黑的黑色绒面身体就像落进墨水一样沉进去，只在接触点泛起一圈奶油色光纹，化成一粒光点。最后一个收完，小黑转向镜头，**wink 一下**（见 2.4 节）：闭上的那只眼变成奶油色弯弧，头歪向同侧，耳朵一压，然后弹回 | 轻微推近；wink 那一刻停一拍 | **从不挑食　照单全收**（弧形排字，沿头部下沿轮廓） | 浏览器插件 · 本地上传 · RSS 订阅，网页、PDF、音视频全收 | 收集 |
| 6 | 14.4–15.3 s | 黑色绒面身体的极近特写 | 快速下摇，拉出运动模糊（全黑画面上只看到绒面纹理在流动） | 无 | 无 | 转场 |
| 7 | 15.4–22.3 s | 小黑坐着，朝镜头一下一下出爪，深炭灰爪垫冲到镜头前失焦、再收回。**前半段（抓）**：一爪抓住一张浮在空中的答案卡，卡上带 ①②③ 引用角标，其中一个角标一闪，连出一条细线指向一份原文卡。**后半段（扒拉）**：小黑像猫扒拉桌上东西那样，用爪把几张散落的文件卡一张张往旁边拨，卡片没有掉下去，而是整齐滑进一个文件夹，文件夹上贴出一枚标签 | 固定机位，焦点在爪和脸之间来回 | **抓重点不卡顿**（左上）<br>**扒拉东西不添乱**（右下，晚半拍） | 左上小字：AI 问答带引用，一点跳回原文<br>右下小字：Agent 建文件夹、移动、打标签，改动前先问你 | AI 问答 & Agent 2.1 |
| 8 | 22.4–24.0 s | 爪垫扑上镜头，画面被黑色盖满；随后镜头在黑色绒面上横移 | 遮挡转场 + 横移 | 无 | 无 | 转场 |
| 9 | 24.0–30.0 s | 从小黑圆滚滚的肚皮特写开始，露出全身：它像人一样靠坐在白色地面上，背微微后仰，两条短腿岔开，一只爪搭在肚子上，尾巴平铺在地上，眼睛半眯（葛优瘫）。27.5 s 慢慢眨一次眼 | 上摇 + 后拉，从特写拉到大全景，小黑落在画面右三分线 | **小黑 OmniBox** | 松弛，天生好记性 | 品牌 |
| 10 | 30.0–33.0 s | 画面淡到纯白，淡入 logo：小黑头部的正面剪影（黑头 + 奶油眼圈） | 固定 | **小黑 OmniBox** | 你的 AI 知识伙伴<br>免费开始 · 开源可私有部署 · omnibox.pro | 行动号召 |

**UI 元素原则**：搜索框、答案卡、引用角标、文件卡、文件夹、标签都用极简扁平矢量画，奶油白底、深灰字、电光蓝 #2E7CF6 做唯一强调色，不贴真实截图。它们一律在后期合成，视频模型只负责小黑的动作。

---

## 4. 逐镜视频生成提示词（建议 Seedance 2.5 图生视频）

**通用前缀**（每条都拼在前面）：

```text
Reference: the approved Xiaohei character sheet. Xiaohei is a minimalist pure matte black cartoon cat mascot made of
flocked vinyl, cream ring eyes with black pupils, no nose, no whiskers — keep the design exactly. Xiaohei has NO mouth
in every shot — no mouth line, no opening, no smile; expressions come only from the eyes and ears.
Style: premium consumer-electronics product commercial, seamless white studio background (#F4F4F2), soft shadowless
light, gentle rim light on the black silhouette, macro lens, very shallow depth of field, slow and precise
motion-control camera, clean cool-white grade. No text, no captions, no logos, no humans, no real cat fur.
```

| # | 时长 | 提示词 |
|---|---|---|
| 1 | 3 s | Extreme macro close-up of one of Xiaohei's cream ring eyes. Camera slides laterally in from an out-of-focus black velvet surface, focus racks onto the eye, then a slow push-in. The black pupil contracts slightly like a camera aperture; a tiny reflection of a photo of a printed page appears on the pupil, with thin glowing rectangles outlining lines of text one by one. |
| 2 | 2.5 s | Macro shot of Xiaohei's pointed black ear, fine flocked velvet texture visible. Slow 30-degree orbit around the ear, focus sweeps from base to tip. The ear rotates toward an off-screen sound and twitches once. White background, leave empty space beside the ear. |
| 3 | 4.5 s | Medium close-up, Xiaohei's front face centered and staring at the camera, locked-off camera with an almost imperceptible push-in. It blinks once. At the midpoint it reacts to a "meow" sound: its head gives a small upward bob and both ears flick up attentively, like a cat that actually came when called. No mouth appears at any time. Leave clear empty space on the left and right of the head. |
| 4 | 2 s | Close-up of Xiaohei in 3/4 view, slowly turning its head toward the empty left side of the frame, eyes narrowing into two focused cream slits like a cat stalking something. Locked-off camera, keep the left 40% of the frame empty. |
| 5 | 2.5 s | Close-up of Xiaohei in 3/4 view, no mouth at any time. Small flat UI objects — a chat bubble, a web page card, a PDF icon, an RSS icon, a video play icon — fly in one by one from the frame edges and sink into Xiaohei's black velvet body like drops falling into ink, each leaving a soft cream ripple of light at the contact point. After the last one, Xiaohei turns to the camera and WINKS: one cream ring eye flattens into a single upward-curved cream arc while the other eye stays fully open, head tilts about 8 degrees toward the winking side, that ear dips, then the eye pops back open with a slight overshoot. Slight push-in, brief hold on the wink. Leave space below the head for curved text. |
| 6 | 1 s | Extreme close-up of Xiaohei's black velvet body, fast whip pan downward with heavy motion blur. |
| 7 | 7 s | Medium close-up, Xiaohei sitting, repeatedly swiping one round paw toward the lens; the dark charcoal paw pads come very close to the camera and go out of focus, then pull back; focus shifts between the paw and the face. In the second half it casually bats sideways at the air, one swipe after another, like a cat knocking things off a table. Locked-off camera. Leave empty space at top-left and bottom-right. |
| 8 | 1.5 s | Xiaohei's paw pad slams onto the lens, the frame goes fully black, then the camera slides sideways across black velvet texture. |
| 9 | 6 s | Starts on an extreme close-up of Xiaohei's round black belly, camera tilts up and pulls back to a wide shot revealing Xiaohei lazily slouching on the white floor like a human: back leaning, short legs splayed, one paw resting on its belly, tail lying flat, eyes half-closed. It slowly blinks once. Xiaohei ends on the right third of the frame, the left half is empty white. |
| 10 | — | 不用生成。后期用纯白底 + logo 矢量完成。 |

**Wink 镜头的生成方式**：第 5 镜用**首尾帧 / 关键帧模式**：首帧为 3/4 侧脸双眼睁开，中间关键帧用 `小黑_wink.png`，尾帧回到双眼睁开。模型很容易把 wink 画成双眼一起眨，或者顺手补出一张嘴，抽卡时重点检查这两点。万一 wink 始终不对，退路是后期用矢量遮罩直接替换那只眼：眼圈本来就是扁平的奶油色圆环，换成弯弧很好合成。所有镜头都在负面提示里写上 `mouth, lips, teeth, tongue, smile line`。

**抽卡建议**：每镜至少出 4 条，优先挑头部轮廓和眼睛没有跑形的那条。第 5 镜（wink）和第 7 镜（卡片）最容易翻车：如果卡片画不好，就只生成小黑的动作，卡片、气泡和图标都改在后期用矢量素材合成。

---

## 5. 后期规格

**字体**：思源黑体 / Noto Sans SC（OFL），主标 Medium，副标 Regular；英文和数字用 Inter。不要描边和投影。
**字色**：压在小黑身上用奶油白 #FBF3E4，放在白底上用深灰 #3A3A3A，副标降到 60% 不透明度。
**字号（1080p）**：主标 64–72 px，副标 26–28 px，第 9 镜品牌名 110 px；字距 +2%。
**出字**：主体动作到位后 0.3–0.5 s 出字，用 8 帧淡入加 12 px 上移；双行字的第二行晚 12 帧（半拍）；随镜头切换直接切掉，不做淡出。
**特殊排字**：
- 第 2 镜：声波进耳后，在耳边逐字打出一行转写文字「周三下午三点，产品评审……」，20 px 奶油白，打完 0.4 s 后收成一张「摘要」小卡。
- 第 3 镜：声波线用奶油色 #FBF3E4（参考片是黄色，这里换成小黑的眼圈色），1.5 px 细线，跟着「喵」跳动；8.0 s 起线上依次滑过文字、语音、图片、文件、链接五个小图标，从两侧流进小黑的脑袋。
- 第 4 镜：搜索框在画面左侧，打字速度每字 2 帧，打完后结果卡弹出，命中的那行用电光蓝底高亮。
- 第 5 镜：主标沿小黑头部的下沿轮廓排成一道弧，左半句「从不挑食」在左，右半句「照单全收」在右；wink 的那一帧整行出齐，保留到切镜。
- 第 7 镜：对角线排布，和参考片一致。左上主标配左上小字，在「抓」的段落出；右下主标配右下小字，在「扒拉」的段落出（约 19.0 s）。
- 第 10 镜：logo 宽度约占画面 8%，下方「小黑 OmniBox」28 px，再下面「你的 AI 知识伙伴」20 px，最底「免费开始 · 开源可私有部署 · omnibox.pro」18 px。

**调色**：干净冷白，保证小黑的黑色落在 RGB 20 左右，不要死黑，保留绒面层次。
**声音**：轻快、带一点冷幽默的极简电子乐（参考片是一条连续的音乐床），加拟音点缀：第 1 镜光圈「咔哒」、第 2 镜耳朵抖动「噗」加打字声、第 3 镜一声短促可爱的「喵」（和抬头、耳朵一抖对齐）加五声「嘀」、第 4 镜键盘打字声和结果弹出「啵」、第 5 镜图标沉进身体的「咕咚」×5，wink 时一声清脆的「叮～」、第 6 镜 whoosh、第 7 镜每次出爪一个「啪」，抓住答案卡「叮」，卡片滑进文件夹「嗖」、第 8 镜闷声「噗」、第 10 镜收尾一个清脆的「叮」。混音 −14 LUFS。
**交付**：`小黑 duo/out/xiaohei-duo.mp4`（H.264，CRF 18，1920×1080，24 fps）、设定图 `小黑 duo/assets/小黑全身设定.png`、字幕工程文件、音乐与音效的 CREDITS。

---

## 6. 红线

- 小黑的头部设计不许改：不加鼻子、胡须和腮红，眼睛不许变成别的颜色。
- **全片不出现嘴**：不张嘴，不画嘴线，不画笑脸。第 5 镜用 wink 代替张嘴，严格按 2.4 节，只闭一只眼。
- 只写帮助文档里有的功能，副标里写的都要能在第 1.1 节找到出处。
- 微信助手不回复消息，片中不画小黑在微信里回话；Agent 的改动要体现「先问你」，不画它擅自删除东西。
- 不出现真实猫、真人和手，不出现第三方平台的 logo（微信、RSS 只用通用图标，不用官方商标）。
- 不照抄参考片的文案原句（「极差视力范围」「孜然妙脆角」「抓人不卡顿 / 咬人不掉帧」「双耳传感 / 随时监听」「松弛，天生专业」），只借结构和句式。
