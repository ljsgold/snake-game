# 游戏图标说明

## 📱 添加游戏图标

为了让游戏在移动端有更好的体验，建议添加以下图标：

### 需要的图标尺寸

1. **icon-192.png** (192x192像素)
2. **icon-512.png** (512x512像素)

### 图标制作建议

1. **设计风格**
   - 使用游戏主题色 #4CAF50
   - 简洁明了，易于识别
   - 建议使用蛇或游戏元素的图形

2. **制作工具**
   - 在线工具：Canva, Figma
   - 设计软件：Photoshop, GIMP
   - 图标生成器：Favicon.io

3. **图标要求**
   - 格式：PNG
   - 背景：透明或深色
   - 清晰度：高分辨率

### 添加图标步骤

1. 制作图标文件
2. 将图标文件放在项目根目录
3. 在 `index.html` 中添加以下代码：

```html
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">
<link rel="apple-touch-icon" href="icon-192.png">
```

4. 创建 `manifest.json` 文件（参考 DEPLOY.md）

### 图标效果

添加图标后，游戏将支持：
- 浏览器标签页显示图标
- 移动端添加到主屏幕
- PWA（渐进式Web应用）功能
- 更好的品牌识别度
