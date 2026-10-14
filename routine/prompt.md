# 每日速读 · 定时任务

你正在**无人值守**地生成今天的「每日速读」，并发布到一个固定的网页 app。必须在本次会话中一次性完成：发现 → 核查 → 写成 JSON → 自检 → 发布 → 一条极简通知。

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
- **商业**：财报与业绩预告、并购融资、IPO、重大订单、价格战、裁员扩张、监管处罚、供应链变化。
- **科技**：AI 模型与产品发布、芯片与算力、手机与汽车智能化、互联网平台、开源、网络安全。
- **娱乐**：票房、剧集/综艺/游戏的重大数据与发行、流媒体、音乐与演出、明星相关的**商业**事件（代言、合约、公司层面），不要八卦。
- **政治与宏观**：只在**直接改变商业或市场**时收录（关税、出口管制、行业监管、利率、汇率），并从"对生意的影响"角度写。纯政治、外交、战争新闻不收。

**配额**：最多 **10 条**；目标 **中国 7 条 / 海外 3 条**。"中国"包括中国大陆、港澳台的公司、市场和监管，以及海外事件对中国企业的直接影响。合格新闻不够就少放，**宁缺毋滥**，不为凑比例降低标准。

**来源**：优先第一方——公司公告、交易所公告（港交所披露易、上交所、深交所、SEC 8-K）、IR 页面、监管机构（证监会、工信部、国家统计局、市场监管总局、国家电影局）、官方发布会；票房/收视用猫眼专业版、灯塔专业版、国家电影局等。中文主流财经与科技媒体（财新、第一财经、界面、36氪、晚点LatePost、21世纪经济报道、澎湃）和国际媒体（Reuters、Bloomberg、FT、Nikkei、The Information、Variety、Hollywood Reporter）用于补充与交叉确认。热度和"刷屏"不是重要性依据。

找 15–25 个候选，存 `workspace/candidates.json`（每条：标题、地区、分类、发生了什么、三个时间、过去 24 小时新增了什么、第一方来源 URL、媒体来源 URL）。

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

**分级**：CONFIRMED（第一方直接证实，或多个真正独立来源一致）/ HIGHLY_CREDIBLE（强证据但缺最终官方确认）/ DEVELOPING（仍在变化）/ UNCONFIRMED（单一来源、匿名消息或来源冲突）。

**准入**：APPROVE / HOLD / REJECT。只有 APPROVE 能进入下一步。**UNCONFIRMED 一律不得 APPROVE。不得为了增加条数降低证据标准。** 存 `workspace/verified.json`，每条附：可信度、准入决定与理由、已核实事实清单、已核实数字（每个数字带出处 URL）、实际打开过的链接。

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
    "label": "指标名", "value": "5,820", "unit?": "点", "change?": "+1.8%", "dir?": "up|down|flat",
    "series?": [{"x": "10-08", "y": 5600}, {"x": "10-09", "y": 5650}],
    "source": {"name": "来源名", "url": "https://..."}
  },
  "markets?": [{"label": "恒生指数", "value": "26,100", "change?": "+1.2%", "dir?": "up", "source_url": "https://..."}],
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
    "sources": [{"name": "来源名", "url": "https://..."}]
  }],
  "upcoming?": [{"when": "10-15 周三", "what": "≤30字，已确定的日程"}]
}
```

写作规则：
- 字数上限是硬限制（按字符计）。宁短勿长，每条读完不超过 20 秒。
- `credibility` 映射：CONFIRMED→confirmed，HIGHLY_CREDIBLE→credible，DEVELOPING→developing。
- `importance: "high"` 每期最多 3 条。stories 按重要性排序。
- `why` 必须写影响机制，不写"意义重大""影响深远"这类空话。
- `tldr` 正好 3 条，是今天最重要的三件事，不是标题复读。
- **hero**：优先用当天头条新闻里已核实的关键数字；否则用一个与中国商业/科技相关的市场指标（如恒生科技指数）最近 5 个交易日收盘，每个点都必须来自你实际打开过的页面。拿不到可靠序列就省略 `series`，拿不到可靠数值就省略整个 `hero`。
- **markets**：最多 4 个（如恒生指数、上证指数、纳指、美元/人民币），只放核实过的收盘数据。
- **upcoming**：未来 72 小时已确定的日程（财报、数据发布、发布会、上映），不得把预测写成事实。
- 不使用 emoji。`dir` 表示涨跌方向；页面按美股习惯显示（绿涨红跌，带 ▲▼）。

## 4. 自检（QA）

逐条核对：每条都来自 APPROVE；没有 `verified.json` 之外的事实；日期正确；没有把旧闻写成新变化；数字与已核实数字完全一致；链接真实、可访问、对应这条新闻（所有 `importance: high` 的链接要 WebFetch 抽查）；没有把 developing 写成 confirmed；没有重复；没有过度推断。发现问题就删除或改写，**QA 不得为了完整而加新事实**。

然后做格式校验：

1. 用 Artifact 工具 `action: "read"`，`url` 为上面的固定地址，`path: "lib.js"`。结果会告诉你文件保存在哪里，记为 **LIB**。
2. 运行：
   ```bash
   node -e 'const L=require(process.argv[1]);const r=L.validateIssue(JSON.parse(require("fs").readFileSync(process.argv[2],"utf8")));console.log(r.ok?"OK":r.errors.join("\n"));process.exit(r.ok?0:1)' "LIB" "workspace/DATE.json"
   ```
3. 输出不是 `OK` 就按提示修改（通常是缩短文字），重新校验，直到 `OK`。

## 5. 发布

1. Artifact 工具 `action: "read"`，同一 `url`，`path: "data/index.json"`，记下保存位置 **IDX**。若不存在，在 `workspace/index.json` 写入 `{"issues":[]}` 作为 IDX。
2. 更新索引（headline 用第一条新闻的标题）：
   ```bash
   node -e 'const L=require(process.argv[1]);const fs=require("fs");const idx=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));const is=JSON.parse(fs.readFileSync(process.argv[3],"utf8"));const out=L.upsertIndex(idx,{date:is.date,count:is.stories.length,headline:(is.stories[0]||{}).title||""});fs.writeFileSync("workspace/index.json",JSON.stringify(out));console.log(out.issues.length,"issues")' "LIB" "IDX" "workspace/DATE.json"
   ```
3. Artifact 工具发布（`action: "publish"`）：`url` = 固定地址，`files` = `{"data/DATE.json": "workspace/DATE.json", "data/index.json": "workspace/index.json"}`。**只上传这两个文件，不要改动 `index.html` 和 `lib.js`，不要新建 artifact。**
   - 如果工具要求提供页面文件：先 `action: "read"`、`path: "index.html"` 下载现有页面，把下载到的文件原样作为 `file_path` 再发布一次（不改内容）。
   - 如果因版本冲突被拒绝：按工具返回的最新版本重新读取 `data/index.json`，重做第 2 步，再发布。
4. 发布失败重试一次；仍失败，就把 `workspace/DATE.json` 的完整内容输出到会话里，并在通知中写明"发布失败"及原因。
5. 发布成功后，用 Artifact `action: "read"`、`path: "data/index.json"` 确认第一项是今天的日期。

## 6. 通知（最后一条消息）

你的最后一条消息会作为手机推送发给用户，**只写 3 行**，不复述内容：

```
今日速读 · MM-DD · N 条（中国 a / 海外 b）
头条：<第一条新闻标题>
https://claude.ai/artifact/BVXAJfsgjVPQaf4TbfDaYZ
```

如果比例明显偏离 7:3、条数少于 5、或发布失败，在第二行之后加一行说明原因（≤30 字）。
