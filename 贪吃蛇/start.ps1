Write-Host "正在启动贪吃蛇游戏服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "游戏将在浏览器中打开，地址为：http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Red
Write-Host ""

try {
    Write-Host "正在启动服务器..." -ForegroundColor Cyan
    python -m http.server 8000
}
catch {
    Write-Host "错误：无法启动服务器，请确保已安装Python" -ForegroundColor Red
    Write-Host "或者尝试使用：python3 -m http.server 8000" -ForegroundColor Yellow
    Read-Host "按回车键退出"
}
