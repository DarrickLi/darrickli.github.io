# 主页维护指南

## 日常内容更新

中英文各维护一份，避免只改一个语言：

- `content/zh/profile.md` / `content/en/profile.md`：个人介绍与 AI 工作方式。
- `content/zh/projects.md` / `content/en/projects.md`：项目卡片，每个 `## 项目名` 开始一张卡片。第一段是简短类别 / 状态，随后写介绍，最后放项目链接或公开状态。
- `content/zh/notes.md` / `content/en/notes.md`：学习入口、写作与其他研究经历。

支持普通段落、`##` / `###` 标题、`-` 列表、粗体、行内代码和 `[标题](https://...)` 链接。不支持内嵌 HTML。文件通过 HTTP 加载，请使用本地服务器预览，不要直接双击 HTML。

## 首屏与毕设

首屏、年龄节点、精选毕设和页脚的中文在 `index.html`；对应英文在 `assets/site.js` 的 `translations.en`。

更新毕设数据时，核对公开仓库结果，并同时更新两种语言。`23 / 24` 指二十四个场景—环境组合中有二十三个保持部分披露利润最高的排序；不要写成一般性定理或真实市场表现。

- 毕设仓库：https://github.com/DarrickLi/auction-exchange-resale-thesis
- 论文：https://github.com/DarrickLi/auction-exchange-resale-thesis/blob/main/paper/joint-mechanism-design-thesis.pdf

## 图片与简历

- 头像：`assets/photos/avatar.jpeg`。
- 生活照：`assets/photos/life1.jpeg` 至 `life4.jpeg`。
- 简历：`assets/cv-zh.pdf` / `assets/cv-en.pdf`。

本次仅保留原简历下载，未更新 PDF 内容；有新版简历时再替换对应文件。

## 预览与发布

在仓库目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，访问 http://127.0.0.1:8765。

检查中文 / 英文、浅色 / 深色、手机布局、项目链接和简历下载。提交并推送到 `main` 后，GitHub Actions 自动部署。维护源码保存在本仓库，不放入 Nash 记忆目录。
