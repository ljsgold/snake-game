#!/bin/bash
echo "正在启动贪吃蛇游戏服务器..."
echo ""
echo "游戏将在浏览器中打开，地址为：http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""
python3 -m http.server 8000
