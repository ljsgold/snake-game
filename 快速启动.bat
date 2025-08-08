@echo off
chcp 65001 >nul
echo.
echo ========================================
echo           贪吃蛇游戏启动器
echo ========================================
echo.
echo 正在启动游戏服务器...
echo.
echo 游戏地址：http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.
python -m http.server 8000
pause
