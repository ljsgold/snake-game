@echo off
chcp 65001 >nul
echo.
echo ========================================
echo        贪吃蛇游戏一键部署工具
echo ========================================
echo.
echo 此工具将帮助你将游戏部署到GitHub Pages
echo 部署后可以直接分享链接给朋友使用
echo.
echo 请确保你已经：
echo 1. 注册了GitHub账号
echo 2. 安装了Git
echo 3. 配置了Git用户信息
echo.
pause

echo.
echo 正在检查Git环境...
git --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到Git，请先安装Git
    echo 下载地址：https://git-scm.com/
    pause
    exit /b 1
)

echo Git环境检查通过！
echo.
echo 请输入你的GitHub用户名：
set /p github_username=

echo.
echo 请输入仓库名称（建议使用：snake-game）：
set /p repo_name=

echo.
echo 正在初始化Git仓库...
git init
git add .
git commit -m "Initial commit: 贪吃蛇游戏"

echo.
echo 正在创建GitHub仓库...
echo 请按照以下步骤操作：
echo 1. 访问 https://github.com/new
echo 2. 仓库名称填写：%repo_name%
echo 3. 选择Public（公开）
echo 4. 不要勾选任何选项
echo 5. 点击"Create repository"
echo.
pause

echo.
echo 正在连接远程仓库...
git remote add origin https://github.com/%github_username%/%repo_name%.git
git branch -M main
git push -u origin main

echo.
echo 正在启用GitHub Pages...
echo 请按照以下步骤操作：
echo 1. 访问你的仓库页面
echo 2. 点击Settings（设置）
echo 3. 左侧菜单选择Pages
echo 4. Source选择"Deploy from a branch"
echo 5. Branch选择"main"
echo 6. 点击Save
echo.
pause

echo.
echo ========================================
echo           部署完成！
echo ========================================
echo.
echo 你的游戏链接：
echo https://%github_username%.github.io/%repo_name%/
echo.
echo 现在你可以将这个链接分享给朋友了！
echo 朋友可以在任何设备上直接访问游戏
echo.
pause
