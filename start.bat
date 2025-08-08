@echo off
echo 正在启动贪吃蛇游戏服务器...
echo.
echo 游戏将在浏览器中打开，地址为：http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo.
echo 正在启动服务器...
python -m http.server 8000
if errorlevel 1 (
    echo 错误：无法启动服务器，请确保已安装Python
    echo 或者尝试使用：python3 -m http.server 8000
    pause
    exit /b 1
)
pause
