# AGENTS.md — 昆明学院国防先锋队官网

## 项目概览

一个纯静态单页网站，使用 Bootstrap 5.3 + 原生 HTML/CSS/JS 实现，展示昆明学院国防先锋队社团的形象与活动。
设计风格：军事风（墨绿 #2c5e2e + 暗金 #d4af37）、硬切角、纸张肌理、铜质金属感。

## 技术栈

- **模板**：Coze native-static（`coze init . --template native-static`）
- **后端**：无（纯静态文件，由 Python http.server 提供静态服务）
- **前端**：HTML5 + CSS3 + JavaScript ES6
- **UI 框架**：Bootstrap 5.3.3（CDN 引入）+ Bootstrap Icons 1.11.3
- **字体**：Oswald + Inter + Noto Serif SC + Noto Sans SC（fonts.googleapis.cn）
- **服务**：`python -m http.server ${DEPLOY_RUN_PORT}`（5000 端口）
- **包管理**：无 npm 依赖（CDN 加载）

## 目录结构

```
/workspace/projects/
├── index.html              # 单页应用入口（含所有页面模块）
├── styles/
│   └── main.css            # 自定义主题样式（军事风、动画、响应式、暗色模式）
├── scripts/
│   └── main.js             # 交互逻辑（导航、暗色、轮播、计数、模态框）
├── DESIGN.md               # 设计规范（配色、字体、动效、禁忌）
├── AGENTS.md               # 本文件
├── .coze                   # 启动配置（python -m http.server）
└── .gitignore
```

## 启动与开发

### 本地开发（PyCharm 预览）
1. 在 PyCharm 中打开 `/workspace/projects/` 目录
2. 右键 `index.html` → Open in Browser
3. 或运行简易 HTTP 服务器：
   ```bash
   cd /workspace/projects
   python -m http.server 5000
   # 浏览器访问 http://localhost:5000
   ```

### 沙箱预览
- 沙箱启动后 `python -m http.server 5000` 已在后台运行
- 访问 `${COZE_PROJECT_DOMAIN_DEFAULT}`（如 `https://xxx.coze.site`）

### 生产构建
本项目无构建步骤，`index.html` 即为生产产物。直接部署整个目录即可。

## 核心功能模块（index.html 中的 section）

| 模块 | 位置 | 关键文件/类 |
|------|------|------------|
| 1. 固定导航栏 | `<nav class="military-nav">` | `scripts/main.js` → `initNav()` |
| 2. Hero 轮播 | `<section class="hero-carousel">` | `initHeroCarousel()` 自动播放+圆点 |
| 3. 统计条 | `<section class="stat-bar">` | `initCountUp()` 数字滚动动画 |
| 4. 社团简介 | `<section class="about-section">` | 纯展示 |
| 5. 活动预告 | `<section class="events-section">` | 3 列响应式卡片网格 |
| 6. 核心成员 | `<section class="members-section">` | **Flex 布局** (`member-flex-container`) |
| 7. 发展历程 | `<section class="timeline-section">` | 垂直时间线（左右交替） |
| 8. 加入我们 | `<section class="cta-section">` | 触发模态框 |
| 9. 页脚 | `<footer class="site-footer">` | 3 列响应式 |
| 10. 返回顶部 | `<button id="backToTop">` | 滚动 300px 后出现 |
| 11. 报名模态框 | `<div id="joinModal">` | `initJoinModal()` 表单验证+模拟提交 |

## 设计语言

详见 `DESIGN.md`。**核心规则**：
- 主色：墨绿 `#2c5e2e` + 暗金 `#d4af37`
- 字体：标题 Oswald/Noto Serif SC，正文 Inter/Noto Sans SC
- 卡片：使用 `clip-path` 硬切角，**禁止**使用 `border-radius` 大圆角
- 悬停：金属光泽扫过（`::before` + `skewX`），不用柔光阴影
- 装饰：罗马数字、斜条纹臂章、纸张肌理噪点

## 已知约定

1. **CDN 加载**：Bootstrap/Bootstrap Icons/字体都通过 CDN 引入，无 `node_modules`
2. **响应式断点**：使用 Bootstrap 默认断点（`576/768/992/1200`）
3. **暗色模式**：通过 `data-bs-theme="dark"` + localStorage 持久化
4. **数据来源**：图片使用 Unsplash 占位 URL（`images.unsplash.com`），头像使用 `i.pravatar.cc`
5. **表单提交**：当前为前端模拟（800ms 延迟 + 成功提示），如需真实后端可对接 Formspree / 自建 API

## 常见问题

### 端口被占用
```bash
# 检查 5000 端口
ss -tuln | grep 5000
# 杀掉占用的进程（仅限自己的 worktree）
ss -lptn 'sport = :5000'
```

### 修改后样式未生效
- 浏览器硬刷新（Ctrl+Shift+R）清除缓存
- python http.server 不会缓存，但浏览器会

### 字体加载慢
- 沙箱已使用 `fonts.googleapis.cn` 镜像
- 如需替换，编辑 `styles/main.css` 第 18 行 `@import`

## 测试与验证

- **接口**：无后端 API，无需冒烟测试
- **静态检查**：无 TypeScript / ESLint 配置，原生 HTML/CSS/JS
- **手动验证**：浏览器 DevTools 切换暗色模式、滚动观察入场动画、点击模态框与表单

## 部署上线

详见 README 部署章节（推荐平台：Vercel / Netlify / GitHub Pages / 阿里云 OSS / 腾讯云 COS）。

- **Vercel**：推 GitHub → vercel.com 导入 → 自动部署
- **GitHub Pages**：仓库 Settings → Pages → 选择 main 分支根目录
- **对象存储**：上传 `index.html`、`styles/`、`scripts/` 到 OSS，开启静态网站托管
