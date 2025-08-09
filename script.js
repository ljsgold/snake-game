class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameLoop = null;
        this.speed = 150;
        this.isPaused = false;
        this.isGameOver = false;
        this.isMobile = this.detectMobile();

        // 设置画布大小
        this.setCanvasSize();

        // 绑定事件处理器
        this.bindEvents();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setCanvasSize() {
        try {
            if (this.isMobile) {
                // 移动端优化
                const vw = Math.min(window.innerWidth, window.screen.width);
                const vh = Math.min(window.innerHeight, window.screen.height);
                const maxSize = Math.min(vw * 0.9, vh * 0.5);
                const size = Math.min(maxSize, 350);
                this.canvas.width = size;
                this.canvas.height = size;
                this.gridSize = Math.floor(size / 18);
            } else {
                // 桌面端
                const maxSize = Math.min(window.innerWidth - 100, window.innerHeight - 300);
                const size = Math.min(maxSize, 400);
                this.canvas.width = size;
                this.canvas.height = size;
                this.gridSize = Math.floor(size / 20);
            }
            
            // 确保网格大小至少为10
            if (this.gridSize < 10) {
                this.gridSize = 10;
            }
        } catch (error) {
            console.error('设置画布大小失败:', error);
            // 使用默认大小
            this.canvas.width = this.isMobile ? 300 : 400;
            this.canvas.height = this.isMobile ? 300 : 400;
            this.gridSize = this.isMobile ? 15 : 20;
        }
    }

    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });

        // 移动端触摸控制
        if (this.isMobile) {
            this.bindTouchControls();
        }

        // 按钮控制
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        const shareBtn = document.getElementById('shareBtn');

        if (startBtn) startBtn.addEventListener('click', () => this.start());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restart());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareGame());

        // 窗口大小改变时重新设置画布
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.draw();
        });
    }

    bindTouchControls() {
        try {
            const buttons = [
                { id: 'upBtn', direction: 'up', blocked: 'down' },
                { id: 'downBtn', direction: 'down', blocked: 'up' },
                { id: 'leftBtn', direction: 'left', blocked: 'right' },
                { id: 'rightBtn', direction: 'right', blocked: 'left' }
            ];

            buttons.forEach(btn => {
                const element = document.getElementById(btn.id);
                if (element) {
                    // 同时绑定 touchstart 和 click 事件以提高兼容性
                    const handleDirection = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.direction !== btn.blocked && !this.isGameOver) {
                            this.direction = btn.direction;
                        }
                    };

                    element.addEventListener('touchstart', handleDirection, { passive: false });
                    element.addEventListener('click', handleDirection);
                    
                    // 防止默认行为
                    element.addEventListener('touchend', (e) => {
                        e.preventDefault();
                    }, { passive: false });
                }
            });

            // 防止页面滚动和缩放
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });

            document.addEventListener('touchmove', (e) => {
                e.preventDefault();
            }, { passive: false });

            // 防止双击缩放
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });

        } catch (error) {
            console.error('绑定触摸控制失败:', error);
        }
    }

    generateFood() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格背景
        this.drawGrid();

        // 绘制蛇
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
                // 蛇头眼睛
                this.ctx.fillStyle = '#fff';
                const eyeSize = Math.max(2, this.gridSize / 8);
                this.ctx.fillRect(
                    segment.x * this.gridSize + this.gridSize / 4,
                    segment.y * this.gridSize + this.gridSize / 4,
                    eyeSize,
                    eyeSize
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + this.gridSize * 3 / 4 - eyeSize,
                    segment.y * this.gridSize + this.gridSize / 4,
                    eyeSize,
                    eyeSize
                );
            } else {
                // 蛇身
                this.ctx.fillStyle = '#45a049';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });

        // 绘制食物
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // 添加食物光晕效果
        this.ctx.strokeStyle = '#ff6666';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2,
            0,
            Math.PI * 2
        );
        this.ctx.stroke();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    move() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.food = this.generateFood();
            // 加快速度
            if (this.speed > 50) {
                this.speed -= 5;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // 检查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    update() {
        if (!this.isPaused && !this.isGameOver) {
            this.move();
            this.draw();
        }
    }

    start() {
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.update(), this.speed);
            document.getElementById('startBtn').style.display = 'none';
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '继续' : '暂停';
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
        
        // 添加震动反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    }

    restart() {
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.speed = 150;
        this.isPaused = false;
        this.isGameOver = false;
        document.getElementById('score').textContent = '0';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('pauseBtn').textContent = '暂停';
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.draw();
    }

    shareGame() {
        const shareData = {
            title: '贪吃蛇游戏',
            text: '来玩这个超好玩的贪吃蛇游戏吧！我的最高分是 ' + this.score + ' 分！',
            url: window.location.href
        };

        if (navigator.share && this.isMobile) {
            // 移动端使用原生分享API
            navigator.share(shareData).catch(err => {
                this.fallbackShare();
            });
        } else {
            this.fallbackShare();
        }
    }

    fallbackShare() {
        // 复制链接到剪贴板
        const url = window.location.href;
        const shareText = `🎮 贪吃蛇游戏\n\n来玩这个超好玩的贪吃蛇游戏吧！\n我的最高分是 ${this.score} 分！\n\n游戏链接：${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('游戏链接已复制到剪贴板！\n\n分享文本：\n' + shareText);
            }).catch(() => {
                this.showShareDialog(shareText);
            });
        } else {
            this.showShareDialog(shareText);
        }
    }

    showShareDialog(shareText) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
            <div class="share-content">
                <h3>分享游戏</h3>
                <p>复制以下内容分享给朋友：</p>
                <textarea readonly>${shareText}</textarea>
                <div class="share-buttons">
                    <button onclick="navigator.clipboard.writeText(this.previousElementSibling.value).then(() => alert('已复制到剪贴板！'))">复制文本</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }
}

// 初始化游戏
const initGame = () => {
    try {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        // 检查Canvas API支持
        if (!canvas.getContext) {
            throw new Error('Canvas API not supported');
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('2D context not supported');
        }
        
        const game = new Snake(canvas);
        game.draw();
        
        // 添加加载完成提示
        console.log('贪吃蛇游戏已加载完成！');
        
        // 在移动端显示简化的提示
        if (game.isMobile) {
            setTimeout(() => {
                try {
                    // 使用更友好的提示方式
                    const welcomeDiv = document.createElement('div');
                    welcomeDiv.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(76, 175, 80, 0.9);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 20px;
                        text-align: center;
                        z-index: 1000;
                        font-size: 14px;
                        animation: fadeInOut 3s ease-in-out;
                    `;
                    welcomeDiv.innerHTML = '🎮 使用下方按钮控制蛇的移动';
                    document.body.appendChild(welcomeDiv);
                    
                    // 3秒后自动移除提示
                    setTimeout(() => {
                        if (welcomeDiv.parentNode) {
                            welcomeDiv.parentNode.removeChild(welcomeDiv);
                        }
                    }, 3000);
                } catch (alertError) {
                    console.log('🎮 游戏已就绪！使用下方按钮控制蛇的移动。');
                }
            }, 1000);
        }
        
        return game;
    } catch (error) {
        console.error('游戏初始化失败:', error);
        showErrorMessage(error.message);
        return null;
    }
};

const showErrorMessage = (errorDetails) => {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.95);
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        z-index: 9999;
        max-width: 90%;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    errorMessage.innerHTML = `
        <h3 style="margin-top: 0; color: #ffebee;">🚫 游戏加载失败</h3>
        <p style="margin: 15px 0; font-size: 14px;">请尝试以下解决方案：</p>
        <ul style="text-align: left; margin: 15px 0; padding-left: 20px; font-size: 13px;">
            <li>刷新页面重试</li>
            <li>清除浏览器缓存</li>
            <li>使用Chrome、Safari或Firefox浏览器</li>
            <li>确保开启了JavaScript</li>
            <li>检查网络连接</li>
        </ul>
        <div style="margin-top: 20px;">
            <button onclick="location.reload()" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">🔄 刷新页面</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">关闭</button>
        </div>
        <p style="font-size: 11px; color: #ffcdd2; margin-top: 15px;">错误详情: ${errorDetails}</p>
    `;
    document.body.appendChild(errorMessage);
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// 等待DOM完全加载
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// 兼容旧式加载方式
window.onload = initGame;
