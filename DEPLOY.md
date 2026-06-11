# 部署上线教程

> 本项目是**纯静态网站**（无后端、无构建步骤），部署极其简单。下面按 **从易到难** 给出 4 种主流方案。

---

## 方案一：GitHub Pages（推荐，免费且稳定）

适合：学生作业、个人项目，国内外都能访问。

### 1. 准备 GitHub 仓库
```bash
# 进入项目目录
cd /workspace/projects

# 初始化 git（如果还没有）
git init
git add .
git commit -m "feat: 国防先锋队官网"

# 在 GitHub 网页上创建新仓库（如 defense-vanguard）
# 然后关联并推送
git remote add origin https://github.com/你的用户名/defense-vanguard.git
git branch -M main
git push -u origin main
```

### 2. 开启 Pages 服务
1. 进入 GitHub 仓库页面 → **Settings** → **Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，目录 `/ (root)`，点 **Save**
4. 等待 1-2 分钟，刷新页面会显示：
   ```
   Your site is live at https://你的用户名.github.io/defense-vanguard/
   ```

### 3. 自定义域名（可选）
- 在仓库根目录新建 `CNAME` 文件，内容写你的域名（如 `defense.kmun.edu.cn`）
- 在域名服务商处添加 CNAME 解析指向 `你的用户名.github.io`

---

## 方案二：Vercel（最快，自动部署）

适合：希望「push 即部署」+ 全球 CDN 加速。

### 步骤
1. 访问 [vercel.com](https://vercel.com) 并用 GitHub 账号登录
2. 点击 **Add New Project** → 导入你的仓库
3. 框架预设选 **Other**（因为是纯静态）
4. 点击 **Deploy**，30 秒后即可获得一个 `xxx.vercel.app` 域名
5. 以后每次 `git push` 都会自动触发部署

---

## 方案三：Netlify（拖拽即可部署）

适合：不想折腾 Git 的同学。

### 步骤
1. 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
2. **直接把整个项目文件夹** 拖到网页上
3. 几秒后即可得到一个公开 URL
4. 可在 Netlify 控制台绑定自定义域名

---

## 方案四：云服务器 / 校园服务器（最灵活）

适合：要部署在校园内网或自有服务器。

### 用 Nginx
```bash
# 1. 把项目文件传到服务器
scp -r ./* user@server:/var/www/defense/

# 2. 配置 Nginx（/etc/nginx/sites-available/defense）
server {
    listen 80;
    server_name defense.kmun.edu.cn;  # 你的域名
    root /var/www/defense;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 3. 启用配置
sudo ln -s /etc/nginx/sites-available/defense /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 用 Apache
```bash
# 1. 上传文件到 /var/www/html/defense/
# 2. 确保加载了 mod_rewrite（如需）
# 3. 浏览器访问 http://服务器IP/defense/
```

---

## 方案五：对象存储（国内访问快）

适合：阿里云 OSS / 腾讯云 COS / 七牛云。

### 阿里云 OSS 步骤
1. 创建 Bucket，开启 **静态网站托管**，默认首页设为 `index.html`
2. 把项目所有文件上传到 Bucket 根目录
3. 通过 Bucket 域名访问（如 `https://xxx.oss-cn-zhangjiakou.aliyuncs.com`）
4. 绑定自定义域名 + CDN 加速

### 腾讯云 COS 步骤
1. 创建存储桶，开启 **静态网站**
2. 上传文件，设置 CDN 加速
3. 绑定自定义域名

---

## 方案六：PyCharm 本地预览（不联网）

适合：纯本地开发调试，不希望部署。

### 最简单的方法
1. PyCharm 打开项目根目录
2. 在 `index.html` 上点右键 → **Open in Browser**
3. 浏览器直接打开文件即可查看
   - 缺点：路径会是 `file:///...`，某些资源可能受同源策略限制

### 推荐方法（起一个本地服务器）
1. PyCharm 底部 **Terminal** 标签
2. 输入：
   ```bash
   python -m http.server 5000
   ```
3. 浏览器访问 `http://localhost:5000`
4. 停止服务：`Ctrl + C`

> 注：PyCharm Professional 版自带 **Run/Debug Configuration** 模板，可视化启动。

---

## 上线后必做清单

- [ ] **替换占位图片**：把 Unsplash / Pravatar 的图片替换成真实的社团照片
- [ ] **修改联系方式**：邮箱、电话、地址更新为真实信息
- [ ] **对接报名表单**：把 `initJoinModal()` 中的 `setTimeout(..., 800)` 替换为真实 API 调用
  - 简单方案：[Formspree](https://formspree.io) / [Tally](https://tally.so) 接收邮件
  - 进阶方案：自建后端 API
- [ ] **SEO 优化**：在 `<head>` 添加 OG meta、站点地图
- [ ] **添加备案号**（如果服务器在中国大陆）
- [ ] **配置 HTTPS**（Vercel/Netlify/GitHub Pages 都自动提供）

---

## 常见问题

### Q1：部署后图片加载慢？
- 把 Unsplash 链接下载到本地 `/images/` 目录
- 或用 WebP/AVIF 格式压缩
- 或使用 CDN（如 [七牛云](https://www.qiniu.com)）

### Q2：暗色模式切换有闪烁？
- 把 `data-bs-theme` 持久化到 localStorage
- 首次加载时根据本地存储立即设置（不要等 JS 加载完才设置）
- 本项目已经在 `DOMContentLoaded` 之前通过 `<html data-bs-theme="light">` 设置了初始值

### Q3：移动端显示错位？
- 浏览器 DevTools → 切到手机模式调试
- 修改 `styles/main.css` 中 `@media (max-width: ...)` 断点
- Bootstrap 默认断点：576 / 768 / 992 / 1200

### Q4：表单提交后无反应？
- 当前为前端模拟，会在 800ms 后显示「提交成功」提示
- 如需真实提交，参考上文「对接报名表单」

---

## 推荐的部署组合

| 场景 | 推荐方案 | 预计耗时 |
|------|----------|----------|
| 期末作业交差 | GitHub Pages | 10 分钟 |
| 个人作品集 | Vercel | 5 分钟 |
| 不想用 Git | Netlify Drop | 3 分钟 |
| 国内访问快 | 阿里云 OSS + CDN | 30 分钟 |
| 校园内网 | Nginx 反向代理 | 1 小时 |

---

**祝部署顺利！如有问题随时问我。** 🎖️
