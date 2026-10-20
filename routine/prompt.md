# 每日速读 · 定时任务

你正在**无人值守**地生成今天的「每日速读」，并发布到一个固定的网页 app。必须在本次会话中一次性完成：发现 → 核查 → 写成 JSON → 配图 → 自检 → 发布 → 一条极简通知。

**不要向用户提问。** 遇到判断分歧，自行做出最保守的决策，并在最后的通知里用一句话说明。全程简体中文，所有时间一律用太平洋时间（PT）。

- 网页 app（固定地址，绝不新建）：https://claude.ai/artifact/BVXAJfsgjVPQaf4TbfDaYZ
- 读者：在硅谷工作的机器学习研究员，**通勤路上用手机刷**，关心**商业、科技、娱乐**，尤其是**中国**。讨厌长文、废话和看不懂的政治新闻。

---

## 0. 准备

1. 运行 `TZ=America/Los_Angeles date '+%Y-%m-%d %H:%M %Z'`，记为 **NOW**；日期部分记为 **DATE**。覆盖窗口 = NOW 前 24 小时 → NOW。
2. 建立 `workspace/`。
3. 若工具未加载，用一次 ToolSearch 加载：`select:WebSearch,WebFetch`（Artifact 工具通常已可用）。

## 时间纪律（强制）

严格区分：**事件实际发生时间 / 首次报道时间 / 最新实质性更新时间**。一篇今天发布的报道，如果没有新的实质性发展（新数据、新财报、新发布、新决定、新裁决、新公告、新票房/销量数字、新阶段），**不算今天的新闻**。综述、回顾、分析稿、周年稿、榜单盘点一律排除。

---

## 1. 发现（scout）

**选题范围**（按优先级）：
- **商业 = 商业动态 / 资讯早知道**（参考 36氪「8点1氪」、晚点 LatePost、虎嗅、界面新闻的写法）：公司做了什么新动作——新业务、新产品、新门店/关店、战略调整、组织架构和高管变动、融资和并购背后的业务逻辑、平台规则变化、价格战、出海、品牌合作、消费和零售新趋势。读者关心的是"这家公司在干什么、为什么、会影响谁"，**不是股价**。
- **不要股市内容**：个股涨跌、大盘和指数、板块异动、券商研报评级、IPO 认购和打新、小市值公司的业绩预告数字罗列、宏观经济数据（PPI/CPI/GDP 等）一律不收。财报只在知名公司**披露了业务层面的新变化**时收（比如外卖单量、新业务亏损收窄、用户数），并且要写业务，不写股价反应。
- **科技**：AI 模型与产品发布、芯片与算力、手机与汽车智能化、互联网平台、开源、网络安全。
- **娱乐**：票房、剧集/综艺/游戏的重大数据与发行、流媒体、音乐与演出、明星相关的**商业**事件（代言、合约、公司层面），不要八卦。
- **政治与宏观**：只在**直接改变商业或市场**时收录（关税、出口管制、行业监管、利率、汇率），并从"对生意的影响"角度写。纯政治、外交、战争新闻不收。

**条数**：质量都过关的话 **12–20 条**最好，上限 20 条；合格的少就少放（宁缺毋滥），但别因为偷懒只放几条。**比例**：中国 : 海外 ≈ 7 : 3；分类大致 **商业 40% / 科技 30% / 娱乐 30%**，科技不超过 40%（科技最好找，不能挤掉商业和娱乐）；娱乐里中国的至少占一半，好莱坞不能占满娱乐名额。商业指的是具体公司的动态，不是股市和宏观数据。"中国"包括中国大陆、港澳台的公司、市场和监管，以及海外事件对中国企业的直接影响。合格新闻不够就少放，**宁缺毋滥**，不为凑比例降低标准。

**来源**：优先第一方——公司公告、交易所公告（港交所披露易、上交所、深交所、SEC 8-K）、IR 页面、监管机构（证监会、工信部、国家统计局、市场监管总局、国家电影局）、官方发布会；票房/收视用猫眼专业版、灯塔专业版、国家电影局等。中文主流财经与科技媒体（财新、第一财经、界面、36氪、晚点LatePost、21世纪经济报道、澎湃）和国际媒体（Reuters、Bloomberg、FT、Nikkei、The Information、Variety、Hollywood Reporter）用于补充与交叉确认。热度和"刷屏"不是重要性依据。

**搜索广度（硬性要求，不得提前收工）**：至少做 **25 次** WebSearch，覆盖下面每一格，每格至少 2 次，中文和英文查询都要有：

| | 商业 | 科技 | 娱乐 |
|---|---|---|---|
| 中国 | 大厂新业务和组织调整、新消费品牌、车企新车与销量、融资并购、出海 | 大模型、芯片、手机、互联网平台 | 票房（猫眼/灯塔）、剧集游戏、流媒体 |
| 海外 | 科技和消费公司的战略动作、并购、对华业务 | AI 公司、半导体、苹果/谷歌/微软/Meta | 好莱坞票房、流媒体、音乐游戏 |

**先搜商业和娱乐，再搜科技。** 商业优先找：阿里、腾讯、字节、美团、拼多多、京东、小米、比亚迪等大厂的新业务、组织调整和高管变动；新消费品牌（茶饮、咖啡、零售、潮玩）的开店、关店、融资、出海；车企新车发布和交付；即时零售、外卖、电商平台的规则和补贴变化；重要融资和并购的业务逻辑。先浏览 36氪快讯/8点1氪、晚点、虎嗅、界面的当日内容找线索；娱乐优先找：电影票房（日票房、周末票房、档期累计）、定档和撤档、热门剧集和综艺的平台数据、游戏版号和新游上线成绩、演唱会和音乐节票务、影视公司财报和人事。

**娱乐类的来源标准**：片方、平台或艺人工作室的官方账号公告，猫眼专业版、灯塔专业版、国家电影局的数据（可以通过主流媒体的转述引用），Variety、Deadline、The Hollywood Reporter、新浪娱乐、澎湃、界面文娱、娱乐资本论等专业媒体，都算合格来源；两家互相独立的专业媒体报道一致，就可以评为 HIGHLY_CREDIBLE。不要因为没有政府或交易所公告就把娱乐新闻全部刷掉，但"知情人士""据传"类的八卦仍然不收。

再用 WebFetch 打开至少 3 个汇总页（如新浪财经/第一财经/36氪的当日快讯页、Reuters/Bloomberg 的科技或中国版块）逐条筛。**候选少于 20 个就继续搜索，不要进入下一步。**

找 20–35 个候选，存 `workspace/candidates.json`（每条：标题、地区、分类、发生了什么、三个时间、过去 24 小时新增了什么、第一方来源 URL、媒体来源 URL）。

## 2. 核查（fact-checker）

默认立场是**怀疑**，目标是推翻候选。逐条检查：

1. 事件是否真实存在（不是误读、翻译错误、讽刺、AI 生成内容或旧闻重发）。
2. 事件实际发生时间是否在覆盖窗口内。
3. 今天是否真有新进展，而不是旧闻再报道。
4. 是否有第一方来源；只有媒体转述时，可信度下调。
5. 多家媒体是否只是转载同一通讯社稿件或同一份声明——**转载不是独立确认**。
6. 日期、数字、人名、公司名在各来源之间是否一致；不一致要记录。
7. 研究类内容是否经过同行评审；预印本不得写成定论。
8. 相关性是否被写成因果。
9. 数字是否被四舍五入、换算或夸大（对照原始文件）。

重要条目必须实际 **WebFetch 第一方页面**核验，不能只看搜索摘要。

**来源硬门槛（每条都要满足其一，否则 REJECT）**：(a) 至少一个第一方来源；或 (b) 至少两家互相独立的专业媒体。**博客、内容农场、SEO 汇总站、"今日科技新闻汇总"类页面、自媒体转载都不算来源**，只能当线索，必须顺藤摸瓜找到原始出处。**只有一家媒体报道、又没有第一方来源的，一律 REJECT**（不论哪个分类）。官方新闻稿被转载站转发时，要找到公司官网或交易所的原文链接放进 sources。

**分级**：CONFIRMED（第一方直接证实，或多个真正独立来源一致）/ HIGHLY_CREDIBLE（强证据但缺最终官方确认）/ DEVELOPING（事件本身已被第一方或多个独立来源证实，只是细节仍在变化）/ UNCONFIRMED（单一来源、匿名消息或来源冲突）。**凡是依据"知情人士""据传""消息称"、且当事方未确认的消息，一律是 UNCONFIRMED，不能标成 DEVELOPING 绕过准入。**

**准入**：APPROVE / HOLD / REJECT。只有 APPROVE 能进入下一步。**UNCONFIRMED 一律不得 APPROVE。不得为了增加条数降低证据标准。** 存 `workspace/verified.json`，每条附：可信度、准入决定与理由、已核实事实清单、已核实数字（每个数字带出处 URL）、实际打开过的链接。

**进入下一步前先数一数**：APPROVE 里商业不足 2 条或娱乐不足 2 条时，针对缺的类别再做至少 6 次定向搜索、补充核查。补完仍不够才算数，并在最后的通知里写明缺哪一类。

## 3. 写成 JSON（editor）

只能用 APPROVE 的条目和 `verified.json` 里的事实与数字。**禁止重新搜索、禁止补充未核实的背景、禁止编造数字或图表数据。**

写入 `workspace/DATE.json`（文件名用真实日期，如 `2026-10-14.json`），格式严格如下。带 `?` 的字段可省略——没有核实过的数据就**省略整个字段**，页面会自动隐藏。

```json
{
  "date": "YYYY-MM-DD",
  "window_pt": "MM-DD HH:MM → MM-DD HH:MM PT",
  "cutoff_pt": "YYYY-MM-DD HH:MM PT",
  "tldr": ["≤30字", "≤30字", "≤30字"],
  "takeaway?": "今天最值得记住的一句话，≤40字",
  "hero?": {
    "label": "指标名", "value": "≤12字符，如 5,820", "unit?": "点", "change?": "+1.8%", "dir?": "up|down|flat",
    "series?": [{"x": "10-08", "y": 5600}, {"x": "10-09", "y": 5650}],
    "source": {"name": "来源名", "url": "https://..."}
  },
  "stories": [{
    "id": "s1",
    "region": "cn|global",
    "category": "business|tech|ent",
    "importance": "high|medium",
    "credibility": "confirmed|credible|developing",
    "title": "≤22字",
    "hook": "≤40字，一句话说清最关键的一点",
    "headline_number?": {"value": "≤10字，如 +38%", "label": "同比"},
    "chart?": {"type": "line|bar", "unit?": "万辆", "points": [{"x": "Q1", "y": 30}, {"x": "Q2", "y": 36}], "source_url": "https://..."},
    "points": ["≤35字", "≤35字", "≤35字"],
    "why": "≤50字，写影响机制：谁的成本/收入/竞争格局变了",
    "image?": {"src": "img/DATE/s1.jpg", "credit": "≤20字，图片来源媒体名"},
    "sources": [{"name": "来源名", "url": "https://..."}]
  }],
  "upcoming?": [{"when": "≤12字，如 10-15 周三", "what": "≤30字，已确定的日程"}]
}
```

写作规则：
- 字数上限是硬限制（按字符计）。宁短勿长，每条读完不超过 20 秒。
- `credibility` 映射：CONFIRMED→confirmed，HIGHLY_CREDIBLE→credible，DEVELOPING→developing。
- `importance: "high"` 每期最多 5 条。stories 按重要性排序。
- `sources` 的**第一个链接必须是最值得点开读的原文报道或官方公告**（页面上的"阅读原文"按钮就指向它），不要放首页、搜索页或汇总页。
- **可视化优先**：有核实过的关键数字就给 `headline_number`；有至少 2 个可比数据点（如季度销量、逐日票房、同比对比）就给 `chart`。目标是至少三分之一的条目带数字或图表。数据必须来自已核实页面，不得编造。
- `why` 必须写影响机制，不写"意义重大""影响深远"这类空话。
- `tldr` 正好 3 条，是今天最重要的三件事，不是标题复读。
- **hero**：优先用当天头条新闻里已核实的关键数字；用业务数字（如交付量、门店数、用户数、票房、融资额），**不要用股价、指数或宏观数据**，每个点都必须来自你实际打开过的页面。拿不到可靠序列就省略 `series`，拿不到可靠数值就省略整个 `hero`。有 `change` 时必须同时给出 `dir`，且 `change` 必须是同一指标相对上一期的变化，并能在已核实数字里找到（不要把环比数字当成同比变化）；`change` 里必须写明比较口径，如 "同比 +41%" 或 "环比 +16%"，不能只写 "+16%"。
- **markets**：**不要输出这个字段**（读者不看股市）。
- **upcoming**：未来 72 小时已确定的日程（新品发布会、上映、开售、财报日），不得把预测写成事实。
- 不使用 emoji。`dir` 表示涨跌方向；页面按美股习惯显示（绿涨红跌，带 ▲▼）。

## 3.5 配图

给每条 APPROVE 的新闻尝试配一张原文配图（报道页面的 og:image）。先把下面的脚本写到 `workspace/grab_img.py`：

```python
#!/usr/bin/env python3
"""Fetch an article's og:image, shrink it to <=800px wide JPEG, save to OUT.
Usage: python3 grab_img.py ARTICLE_URL OUT.jpg   -> prints OK <bytes> or SKIP <reason>; exit 0 either way."""
import html, io, re, subprocess, sys, urllib.parse

UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"


def get(url, limit):
    r = subprocess.run(["curl", "-sSL", "--max-time", "20", "--max-filesize", str(limit), "-A", UA, url],
                       capture_output=True)
    return r.stdout if r.returncode == 0 else b""


def main(article, out):
    page = get(article, 4_000_000).decode("utf-8", "ignore")
    m = (re.search(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)(?::src)?["\'][^>]*content=["\']([^"\']+)', page, re.I)
         or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\'](?:og:image|twitter:image)', page, re.I))
    if not m:
        return print("SKIP no og:image")
    src = urllib.parse.urljoin(article, html.unescape(m.group(1).strip()))
    data = get(src, 15_000_000)
    if not data:
        return print("SKIP download failed")
    from PIL import Image
    try:
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGB")
    except Exception as e:
        return print("SKIP not an image:", e)
    w, h = im.size
    if w < 400 or h < 200 or w / h > 3 or h / w > 2:
        return print(f"SKIP bad size {w}x{h} (likely a logo)")
    if w > 800:
        im = im.resize((800, round(h * 800 / w)))
    im.save(out, "JPEG", quality=72, optimize=True, progressive=True)
    import os
    print("OK", os.path.getsize(out))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

然后对每条新闻，用它 `sources` 里第一个链接（原文）运行：

```bash
mkdir -p workspace/img/DATE
python3 workspace/grab_img.py "<原文 URL>" "workspace/img/DATE/<id>.jpg"
```

输出 `OK` 就在该条加 `"image": {"src": "img/DATE/<id>.jpg", "credit": "<原文媒体名>"}`；输出 `SKIP` 就不加 `image`，也不要换别的图源或自己生成图片。用 Read 工具打开下载到的图片看一眼：是 logo、二维码、纯文字海报或与新闻无关的图就删掉、不加 `image`。

## 4. 自检（QA）

逐条核对：每条都来自 APPROVE；没有 `verified.json` 之外的事实；日期正确；没有把旧闻写成新变化；数字与已核实数字完全一致；链接真实、可访问、对应这条新闻（所有 `importance: high` 的链接要 WebFetch 抽查）；没有把 developing 写成 confirmed；没有重复；没有过度推断；**没有股价、指数、宏观数据类条目**。发现问题就删除或改写，**QA 不得为了完整而加新事实**。任何条目里出现"未核对""待确认""据报道称"之类自我声明没核实的文字，要么现在 WebFetch 原文核对后删掉这句话，要么整条删除——不允许把"未核实"写给读者看。

然后做格式校验：

1. 用 Artifact 工具 `action: "read"`，`url` 为上面的固定地址，`path: "lib.js"`。结果会告诉你文件保存在哪里，记为 **LIB**。
2. 运行：
   ```bash
   node -e 'const L=require(process.argv[1]);const r=L.validateIssue(JSON.parse(require("fs").readFileSync(process.argv[2],"utf8")));console.log(r.ok?"OK":r.errors.join("\n"));process.exit(r.ok?0:1)' "LIB" "workspace/DATE.json"
   ```
3. 输出不是 `OK` 就按提示修改（通常是缩短文字），重新校验，直到 `OK`。

## 5. 发布

这个 Artifact 工具**不能只上传数据文件**：每次发布都必须同时带上页面文件（`file_path`），而且发布前必须先"查看"过线上最新版本。按下面顺序做：

1. Artifact `action: "read"`，只传 `url`（不传 `path`）——这一步是"查看"线上版本，返回内容不用细读。
2. Artifact `action: "list"`，`url` 为固定地址，`scope: "files"`，把列出的所有已发布路径写进 `workspace/published.txt`（一行一个）。然后 Artifact `action: "read"`，同一 `url`，`paths: ["index.html", "data/index.json", "data/DATE.json"]`。记下 `index.html` 的保存位置 **PAGE**、`data/index.json` 的保存位置 **IDX**。`data/DATE.json` 不存在是正常的（今天第一次运行）。若 `data/index.json` 不存在，在 `workspace/index.json` 写入 `{"issues":[]}` 作为 IDX。
3. 更新索引（headline 用第一条新闻的标题）：
   ```bash
   node -e 'const L=require(process.argv[1]);const fs=require("fs");const idx=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));const is=JSON.parse(fs.readFileSync(process.argv[3],"utf8"));const out=L.upsertIndex(idx,{date:is.date,count:is.stories.length,headline:(is.stories[0]||{}).title||""});fs.writeFileSync("workspace/index.json",JSON.stringify(out));console.log(out.issues.length,"issues")' "LIB" "IDX" "workspace/DATE.json"
   ```
4. 算出要清理的旧图（只保留最近 14 天的配图）：
   ```bash
   node -e 'const L=require(process.argv[1]);const fs=require("fs");const p=fs.readFileSync("workspace/published.txt","utf8").split("\n").map(s=>s.trim()).filter(Boolean);console.log(JSON.stringify(L.staleImages(p,process.argv[2],14)))' "LIB" "DATE"
   ```
5. Artifact `action: "publish"`：`url` = 固定地址，`file_path` = **PAGE**（原样，不改内容），`files` = `{"data/DATE.json": "workspace/DATE.json", "data/index.json": "workspace/index.json"}`，再加上今天每张配图 `"img/DATE/<id>.jpg": "workspace/img/DATE/<id>.jpg"`，以及上一步列出的每个旧图路径 `"<旧图路径>": null`（删除）。不要动 `lib.js`，不要新建 artifact。
   - 若被拒且提示有更新的版本：从第 1 步重来（重新查看、重新下载 PAGE 和 IDX、重做第 3 步），再发布。不要原样重发被拒的内容。
   - 若以"未读取过该路径"为由拒绝：把被拒路径加入 `overwrite_unread` 重试。
6. 仍失败就再试一次；还失败，把 `workspace/DATE.json` 全文输出到会话里，并在通知中写明"发布失败"及原因。
7. 发布成功后，用 Artifact `action: "read"`、`path: "data/index.json"` 确认第一项是今天的日期。

## 6. 通知（最后一条消息）

你的最后一条消息会作为手机推送发给用户，**只写 3 行**，不复述内容：

```
今日速读 · MM-DD · N 条（中国 a / 海外 b）
头条：<第一条新闻标题>
https://claude.ai/artifact/BVXAJfsgjVPQaf4TbfDaYZ
```

如果中外比例明显偏离 7:3、商业或娱乐少于 2 条、没有中国娱乐、条数少于 8、或发布失败，在第二行之后加一行说明原因（≤30 字）。
