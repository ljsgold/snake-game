# 贪吃蛇游戏部署指南

## 🚀 快速部署方案

### 方案一：GitHub Pages（推荐）

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/snake-game.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库设置 → Pages
   - Source选择 "Deploy from a branch"
   - Branch选择 "main"
   - 保存后等待几分钟即可访问

3. **访问地址**
   ```
   https://你的用户名.github.io/snake-game/
   ```

### 方案二：Netlify（免费）

1. **注册Netlify账号**
   - 访问 https://netlify.com
   - 使用GitHub账号登录

2. **部署项目**
   - 点击 "New site from Git"
   - 选择你的GitHub仓库
   - 部署设置保持默认
   - 点击 "Deploy site"

3. **自定义域名（可选）**
   - 在站点设置中可以添加自定义域名

### 方案三：Vercel（免费）

1. **注册Vercel账号**
   - 访问 https://vercel.com
   - 使用GitHub账号登录

2. **部署项目**
   - 点击 "New Project"
   - 导入你的GitHub仓库
   - 保持默认设置
   - 点击 "Deploy"

### 方案四：本地服务器

1. **使用Python**
   ```bash
   python -m http.server 8000
   ```
   然后访问 `http://localhost:8000`

2. **使用Node.js**
   ```bash
   npx serve .
   ```
   然后访问显示的地址

## 📱 移动端优化

### 添加到主屏幕（PWA）

1. **创建manifest.json**
   ```json
   {
     "name": "贪吃蛇游戏",
     "short_name": "贪吃蛇",
     "description": "一个现代化的贪吃蛇游戏",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#1a1a1a",
     "theme_color": "#4CAF50",
     "icons": [
       {
         "src": "icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **在HTML中添加**
   ```html
   <link rel="manifest" href="manifest.json">
   <meta name="theme-color" content="#4CAF50">
   ```

## 🔗 分享方式

### 1. 直接分享链接
部署完成后，直接分享你的网站链接即可。

### 2. 二维码分享
可以使用在线工具生成二维码，方便手机扫描访问。

### 3. 社交媒体分享
游戏内置了分享功能，支持：
- 移动端原生分享API
- 复制链接到剪贴板
- 生成分享文本

## 📊 性能优化建议

1. **压缩文件**
   - 使用在线工具压缩CSS和JS文件
   - 优化图片大小

2. **CDN加速**
   - 使用Cloudflare等CDN服务
   - 启用Gzip压缩

3. **缓存策略**
   - 设置适当的缓存头
   - 使用Service Worker缓存资源

## 🛠️ 故障排除

### 常见问题

1. **游戏无法加载**
   - 检查文件路径是否正确
   - 确认所有文件都已上传

2. **移动端显示异常**
   - 检查viewport设置
   - 测试不同设备尺寸

3. **分享功能不工作**
   - 确认网站使用HTTPS协议
   - 检查浏览器兼容性

## 📞 技术支持

如果遇到问题，可以：
1. 检查浏览器控制台错误信息
2. 确认网络连接正常
3. 尝试清除浏览器缓存
