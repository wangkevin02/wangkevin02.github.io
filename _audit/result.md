# 主页优化结果

当前版本：左侧头像、身份、联系方式、Education；移除 Location 和研究标语，CV 与 Scholar 同样式。Education 去掉重复导师、使用学位标签和灰色日期。右侧为 About me、Experience（腾讯官方标识）、News、三篇精选（两篇一作及指定的 MMAPIS）和底部全部五篇论文。All publications 链接只在页内定位，独立 publications 页面继续可访问。站点 favicon 改为酒红底白色 KW 字母标识，采用 SVG 路径避免字体依赖。

News 标签为会议名称与会议年份，或 Preprint 与更新月份；对应日期来自现有动态，未将新闻日期改成正式发表日期。首页两处论文采用不同 ID，检查无重复。左栏不设置独立滚动；桌面高窗口保持可见，小屏自然滚动。已测 1440×820、1280×900、1024×820 下精简左栏可完整显示；1440×700 下不固定左栏。

Experience 使用圆形白底腾讯标识，与机构、职位和摘要并排；保留完整字标、不裁切或拉伸。日期弱化，并在窄屏换行。All publications 按 2026、2025、2024 分组，使用年份节点和细线分隔，年内继续按月份倒序。圆形与图文并排检查在修改前失败，修改后纳入页面检查。

本地改版完成。保留 Jekyll/al-folio 和现有论文、CV 数据入口，重新组织个人资料、研究介绍、新闻、论文与 Education。视觉参考 Ma Duo 主页的学术分区，以及 Laip11 模板的紧凑头像、章节导航、白色内容区与酒红色强调。[^1][^2]

| 检查          | 结果                                                                |
| ------------- | ------------------------------------------------------------------- |
| 生产构建      | Ruby 4.0 / Jekyll 4.4.1 构建成功；未用 Docker                       |
| 格式与改动    | 修改文件通过 Prettier；git diff --check 未发现空白错误              |
| 响应式        | 首页、Publications、CV 在 320、390、768、1440 px 下均无横向溢出     |
| 首页内容      | 首页 3 篇精选、全部页 5 篇按年份分组；3 条最新动态和 2 条可展开动态 |
| 交互          | 键盘展开新闻、章节跳转、深色切换、手机导航均已检查                  |
| CV            | 中英文切换更新嵌入地址和打开链接；两份资源均为有效 PDF              |
| 无 JavaScript | 简介、3 篇精选论文和新闻保留；旧新闻仍可展开                        |
| 页面结构      | 无重复 ID，章节链接均有目标；头像加载成功；未捕获页面脚本异常       |
| 发布内容      | progress.md 和 \_audit/ 不进入生成站点                              |

年份节点进一步优化为放大的年份、空心圆、渐隐横线与组内细竖线。测试检查年份突出程度及列表连接线，修改前能识别旧样式；响应式检查继续覆盖首页与独立论文页。

About me 原有 80ch 段落上限导致宽屏右栏留空，现已移除；页面测试直接比较段落与所属 section 的实际宽度，修改前失败。实习摘要按用户提供文本替换，Publications 的 description 与简介段落删除；CV PDF 内容未修改。

最终视觉统一：浅色改为纸白、深色强调色降低饱和度；正文链接增加细下划线，论文按钮统一背景/边框与悬停状态，所有主内容链接增加键盘聚焦轮廓。右侧区块采用统一顶部分隔线、留白与标题短色线。学校、腾讯、五篇论文图片和资源按钮图标均保留，CV 打开入口补 PDF 图标。BibTeX 支持 Enter/空格并更新 aria-expanded。News、Experience 和论文月份统一为 YYYY.MM，BibTeX 原始月份字段不变。

页面脚本检查深浅色下正文链接、研究标签、资源按钮、作者和会议标签的文字/背景对比（目标至少 4.5）、按钮悬停背景变化及键盘展开；这是所列元素的计算检查，不是全站无障碍认证。区块间分隔与留白有实际渲染断言，所有月级论文日期已检查为数字格式。

资源展示统一为 PDF → Code → Demo/Video → BibTeX。SASLM 的[实际演示页](https://wangkevin02.github.io/SASLM/)使用 demo 字段；MMAPIS 保留 Video，不将视频误标为网页 Demo。论文标题承接官方页面或 arXiv 摘要链接，移除重复 DOI、arXiv 和 Website 按钮，DOI 数据保留。当前五篇未使用的旧资源按钮分支已移除，无新增兼容路径。新增检查确认 SASLM/CATCH 的资源顺序及 CATCH 标题指向 AAAI。PDF 按钮采用主题强调色，悬停使用主题专用反色文字；标题默认正文色，悬停/聚焦时显示强调色与下划线。

链接颜色定稿独立于酒红内容强调：浅色 #245A81，深色 #8AB8DF，悬停分别为 #173E5C / #B6D6F0；PDF 按钮同步使用蓝色浅底与悬停反色。页面测试断言深浅色实际链接颜色并继续计算文字对比。favicon 定稿为海军蓝底、白色几何 KW（前述酒红版已替换），预览保存在 favicon.png。

链接字重最终调整为 400，介于原正文 300 与校名 600 之间；Education 校名保持 600，论文标题继承标题字重。测试比较校名与正文链接的计算颜色，并分别确认 600/400 字重；继续检查手机换行。

截图已人工查看：[桌面](home-desktop.png)、[手机](home-mobile.png)、[深色](home-dark.png)。

核心入口：[首页模板](../_layouts/about.liquid)、[首页样式](../_sass/_home.scss)、[内容](../_pages/about.md)、[新闻](../_includes/updates.liquid)。

已移除旧新闻自动滚动脚本及对应样式，改用浏览器原生 details 展开；可由 Git 恢复。未新增兼容路径，未新增或改变重要 fallback；保留 CV 原有的直接打开 PDF 入口。

复现时在仓库根目录运行：

```bash
BUNDLE_PATH=vendor/bundle JEKYLL_ENV=production bundle exec jekyll build
python3 -m http.server 4000 --bind 127.0.0.1 --directory _site
```

另一个终端运行 [页面检查脚本](check-homepage.cjs)。脚本使用 Playwright 和本机 Chrome；本次复用了环境中已有的 Playwright，不增加网站运行依赖：

```bash
PLAYWRIGHT_MODULE=/Users/ke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node _audit/check-homepage.cjs
```

边界：未推送或发布线上；本次核验了论文作者及排序月份；没有重新核验其余履历事实，没有逐一访问全部外链。仅确认本地 Chromium 渲染与交互，未测试 Safari/Firefox 或真实手机。参考模板仅作为设计参考，未复制其代码。

## 参考文献与来源导读

[^1]: Duo Ma，[Personal Website](https://shanguanma.github.io/)，访问于 2026-09-06，页面未标注版本。用于参考个人资料、论文、教育与经历的分区；不作为本站个人事实来源。

[^2]: Laip11，[Academic Homepage Template](https://laip11.github.io/academic-homepage-template/)，访问于 2026-09-06，当前未固定版本。用于参考页面视觉与布局。用户提供的[源码仓库](https://github.com/Laip11/academic-homepage-template) API 访问遇到限流，本次读取了模板实际部署页面的 HTML/CSS。

图片来源（2026-09-06 下载，未固定源码版本）：[CUHK-Shenzhen 校徽](https://www.cuhk.edu.cn/themes/custom/cuhk_ui/favicon.ico)、[浙江大学校徽](https://www.zju.edu.cn/_upload/tpl/0b/bf/3007/template3007/static/media/icon_mlogo.4f71be0a36fc2a4abfa7.svg)、[SASLM 框架图](https://wangkevin02.github.io/SASLM/framework.jpg)、[USP 框架图](https://raw.githubusercontent.com/wangkevin02/USP/main/assets/framework.png)、[MMAPIS 框架图](https://raw.githubusercontent.com/fjiangAI/MMAPIS/main/assets/arxiv_workflow_v4.5.png)。图片仅用于对应学校或论文的识别与展示，未生成或改写原图。

本次元数据更正：USP 网页作者名单与结构化 CV 数据按 [ACL Anthology](https://aclanthology.org/2025.acl-long.1025/) 更正为六位作者；已有中英文 PDF 未重新生成。排序日期：SASLM 2026-04、CATCH 2026-03、DDTSR 2026-02、USP 2025-07、MMAPIS 2024-01。依据：[SASLM 首次公开](https://arxiv.org/abs/2604.11424)、[CATCH 正式发表](https://ojs.aaai.org/index.php/AAAI/article/view/40406)、[DDTSR](https://arxiv.org/abs/2602.23266)、[MMAPIS](https://arxiv.org/abs/2401.09150)。

腾讯标识来源：[腾讯官网资源](https://www.tencent.com/wp-content/uploads/2024/05/logo@2x-en.png)，仅用于标识对应实习经历。

论文预览新增 CATCH 与 DDTSR 的 Figure 2，均从原 PDF 直接裁出，未重绘，去除图注与正文但保留完整框架。CATCH 使用 [AAAI 正式 PDF](https://ojs.aaai.org/index.php/AAAI/article/download/40406/44367) 第 3 页；DDTSR 使用 [arXiv v1 PDF](https://arxiv.org/pdf/2602.23266v1) 第 4 页。Poppler 按整页长边 2800 px 渲染，裁切参数分别为 x/y/W/H = 180/176/1810/430 和 280/184/1620/900；输出保存在 publication_preview/catch.png 与 ddtsr.png。

CATCH 的 PDF、新闻链接改为 AAAI 官方入口，删除旧 arXiv 按钮，补齐 DOI、卷期页码及[官方代码](https://github.com/SUAT-AIRI/CATCH)。USP 已使用 ACL Anthology，保持不变。其余三篇的 arXiv 页面未标注正式发表入口，本次保留预印本链接，不推断接收状态。DDTSR 原文所列 https://github.com/hlt-cuhksz/DDTSR 在 2026-09-06 返回 HTTP 404，未添加失效入口。未更改历史新闻日期，未重新生成已有 CV PDF。
