let game_W = 20; // 游戏画布的宽度
let game_H = 20; // 游戏画布的高度
let XXX = 0, YYY = 0, Xh = 0, Yh = 0; // 各种坐标变量
let MaxLeng = 0; // 最大长度
let speedReturn = 0; // 返回速度
let speedReturnRank = 2; // 返回速度等级
let R = 0, r = 0; // 半径变量
let drag = false; // 拖拽状态
let d = false; // 拖拽方向
let ok = false; // 是否成功抓取
let angle = 90; // 角度
let ChAngle = -0.5; // 角度变化
let dynamiteNumber = 0; // 是否拥有炸药
index = -1; // 当前抓取的金块索引
level = -1; // 当前关卡
time = 60; // 剩余时间
tager = 0; // 目标分数
timeH = 0; // 时间变量
vlH = 0; // 分数变量
var bg = new Image(); // 背景图片
bg.src="images/background.jpg";
var hook = new Image(); // 钩子图片
hook.src="images/hook.png";

let N = -10; // 金块数量

const failPopup = document.getElementById('failPopup');
const restartBtn = document.getElementById('restartBtn');

const rockSound = document.getElementById('rockSound'); // 获取音效元素
const failSound = document.getElementById('failSound'); // 获取音效元素
const winningSound = document.getElementById('winningSound'); // 获取音效元素
const shineSound = document.getElementById('shineSound'); // 获取音效元素
const blastSound = document.getElementById('blastSound'); // 获取音效元素
restartBtn.addEventListener('click', () => {
    failPopup.style.display = 'none';
    //reload
    location.reload();
});
class game {
    constructor() {
        this.canvas = null; // 画布元素
        this.context = null; // 画布上下文
        this.score = 0; // 当前分数
        this.init(); // 初始化游戏
    }

    init() {
        this.canvas = document.createElement("canvas"); // 创建画布
        this.canvas.id = "gameBoard"; // 设置画布ID
        this.context = this.canvas.getContext("2d"); // 获取2D上下文
        document.body.appendChild(this.canvas); // 将画布添加到页面
        this.render(); // 渲染画布
        this.newGold(); // 生成新金块
        this.initGold(); // 初始化金块
        this.loop(); // 开始游戏循环
        this.listenKeyboard(); // 监听键盘事件
        this.listenMouse(); // 监听鼠标事件
        this.listenTouch(); // 监听触摸事件
        //监听炸药使用
        document.addEventListener("click", evt => {
            let x = evt.clientX;
            let y = evt.clientY;
            let dynamiteX = (game_W + 6 * this.getWidth())/2;
            let dynamiteY = this.getWidth() * 0.5;
            if (x >= dynamiteX && x <= game_W && y >= dynamiteY && y <= dynamiteY + this.getWidth()) {
                if (dynamiteNumber>0) {
                    this.useDynamite();
                }
            }

        });

    }

    newGold() {
        ok = false; // 重置抓取状态
        index = -1; // 重置抓取索引
        Xh = XXX; // 重置钩子坐标
        Yh = YYY;
        r = R; // 重置半径
        drag = false; // 重置拖拽状态
        timeH = -1; // 重置时间变量
        vlH = 0; // 重置分数变量
        time = 60; // 重置时间
        level ++; // 增加关卡
        tager = (level + 1) * 1000 + level * level * 120; // 计算目标分数
        this.initGold(); // 初始化金块
    }

    listenKeyboard() {
        document.addEventListener("keydown", key => {
            this.solve(); // 处理键盘事件
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            this.solve(); // 处理鼠标事件
        })
    }
    listenTouch() {
        document.addEventListener("touchstart", evt => {
            this.solve(); // 处理触摸事件
        });
        document.addEventListener("touchend", evt => {
            this.solve(); // 处理触摸事件
        });
        document.addEventListener("touchmove", evt => {
            this.solve(); // 处理触摸事件
        });
    }
    solve() {
        if (!drag) {
            drag = true; // 开始拖拽
            d = true; // 设置拖拽方向
            speedReturn = this.getWidth() / speedReturnRank; // 设置返回速度
            index = -1; // 重置抓取索引
        }
    }

    loop() {
        this.update(); // 更新游戏状态
        this.draw(); // 绘制游戏画面
        if (time > 0) {
            setTimeout(() => this.loop(), 10); // 循环调用
        } else {
            if (this.score >= tager || this.checkWin()) {
                this.showResult(true); // 显示成功图片
                winningSound.play();
                setTimeout(() => {
                    document.getElementById("successPopup").style.display = "none";
                    this.newGold();
                    this.loop();
                }, 4000); // 4秒后生成新金块
            } else {
                this.showResult(false); // 显示失败图片
                failSound.play();
            }
        }
    }

    update() {
        this.render(); // 渲染画布
        time -= 0.01; // 减少时间
        Xh = XXX + r * Math.cos(this.toRadian(angle)); // 计算钩子X坐标
        Yh = YYY + r * Math.sin(this.toRadian(angle)); // 计算钩子Y坐标
        if (!drag) {
            angle += ChAngle; // 改变角度
            if (angle >= 165 || angle <= 15)
                ChAngle = -ChAngle; // 反转角度变化
        } else {
            if (r < MaxLeng && d && !ok)
                r += this.getWidth() / 5; // 增加半径
            else {
                d = false; // 停止增加半径
                r -= speedReturn / 2.5; // 减少半径
            }
            if (r < R) {//抓取完毕，结算
                r = R; // 重置半径
                drag = false; // 停止拖拽
                ok = false; // 重置抓取状态
                index = -1; // 重置抓取索引
                for (let i = 0; i < N; i++)
                if (this.gg[i].alive && this.range(Xh, Yh, this.gg[i].x, this.gg[i].y) <= 2 * this.getWidth()) {
                    this.gg[i].alive = false; // 设置金块为死亡状态
                    this.score += this.gg[i].score; // 增加分数
                    shineSound.play();
                    timeH = time - 0.7; // 设置时间变量
                    vlH = this.gg[i].score; // 设置分数变量
                    //如果是随机包，增加炸药
                    if (this.gg[i].type == 6) {
                        dynamiteNumber ++;
                    }
                    //如果是毒品，则速度变慢
                    if (this.gg[i].type == 11) {
                        speedReturnRank = 4;
                    }
                }
            }
        }
        if (drag && index == -1) {
            for (let i = 0; i < N; i++)
                if (this.gg[i].alive && this.range(Xh, Yh, this.gg[i].x, this.gg[i].y) <= this.gg[i].size()) {
                    ok = true; // 设置抓取成功
                    rockSound.play();
                    index = i; // 设置抓取索引
                    break;
                }
        }
        if (index != -1) {
            this.gg[index].x = Xh; // 更新金块X坐标
            this.gg[index].y = Yh + this.gg[index].height / 3; // 更新金块Y坐标
            speedReturn = this.gg[index].speed/speedReturnRank; // 设置返回速度
        }
    }

    render() {
        if (game_W != document.documentElement.clientWidth || game_H != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth; // 设置画布宽度
            this.canvas.height = document.documentElement.clientHeight; // 设置画布���度
            game_W = this.canvas.width; // 更新游戏宽度
            game_H = this.canvas.height; // 更新游戏高度
            XXX = game_W / 2; // 更新钩子X坐标
            YYY = game_H * 0.18; // 更新钩子Y坐标
            R = this.getWidth() * 2; // 更新半径
            if (!drag)
                r = R; // 重置半径
            MaxLeng = this.range(XXX, YYY, game_W - 2 * this.getWidth(), game_H - 2 * this.getWidth()); // 计算最大长度
            if (N < 0)
                N = game_W * game_H / (20 * this.getWidth() * this.getWidth()); // 计算金块数量
        }
    }

    draw() {
        this.clearScreen(); // 清空画布
        for (let i = 0; i < N; i++)
            if (this.gg[i].alive) {
                this.gg[i].update(time); // 更新金块状态
                this.gg[i].draw(); // 绘制金块
            }

        this.context.beginPath();
        this.context.strokeStyle  = "#FF0000"; // 设置线条颜色
        this.context.lineWidth = Math.floor(this.getWidth() / 10); // 设置线条宽度
        this.context.moveTo(XXX, YYY); // 移动画笔到钩子位置
        this.context.lineTo(Xh, Yh); // ��线到钩子末端

        this.context.stroke();
        this.context.beginPath();
        this.context.arc(XXX, YYY, 3, 0, 2 * Math.PI); // 画钩子圆圈
        this.context.stroke();

        this.context.save();
        this.context.translate(Xh, Yh); // 平移到钩子末端
        this.context.rotate(this.toRadian(angle - 90)); // 旋转钩子
        this.context.drawImage(hook, - this.getWidth() / 4,- this.getWidth() / 8, this.getWidth() / 2, this.getWidth() / 2); // 绘制钩子图片
        this.context.restore();

        this.drawText(); // 绘制文本
    }

    drawText() {
        //绘制炸药道具
        if (dynamiteNumber>0) {
            for (let i = 0; i < dynamiteNumber; i++) {
                this.context.drawImage(dynamiteIm, (game_W + 6 * this.getWidth())/2+i*100, this.getWidth() * 0.5, this.getWidth()/2, this.getWidth());
            }
        }
        // this.context.drawImage(dolarIM, this.getWidth() / 2, this.getWidth() / 2, this.getWidth(), this.getWidth()); // 绘制金币图片
        this.context.fillStyle = "red"; // 设置文本颜色
        if (this.score > tager)
            this.context.fillStyle = "#FF6600"; // 设置目标分数颜色
        this.context.font = this.getWidth() + 'px Stencil'; // 设置字体
        this.context.fillText("💰"+ this.score, this.getWidth() , this.getWidth() * 1.1); // 绘制当前分数

        // this.context.drawImage(targetIM, this.getWidth() / 2, this.getWidth() / 2 + this.getWidth(), this.getWidth(), this.getWidth()); // 绘制目标图片
        this.context.fillStyle = "#FF6600"; // 设置目标分数颜色
        this.context.font = this.getWidth() + 'px Stencil'; // 设置字体
        this.context.fillText("🎯"+ tager, this.getWidth(), this.getWidth() * 2.1); // 绘制目标分数

        // this.context.drawImage(levelIM, game_W - 3 * this.getWidth(), this.getWidth() / 2, this.getWidth(), this.getWidth()); // 绘制关卡图片
        this.context.fillStyle = "#FFFFCC"; // 设置关卡颜色
        this.context.font = this.getWidth() + 'px Stencil'; // 设置字体
        this.context.fillText("🏆"+(level + 1), game_W - 3 * this.getWidth(), this.getWidth() * 1.1); // 绘制关卡

        // this.context.drawImage(clockIM, game_W - 3 * this.getWidth(), this.getWidth() / 2 + this.getWidth(), this.getWidth(), this.getWidth()); // 绘制时钟图片
        this.context.fillStyle = "#FF00FF"; // 设置时间颜色
        this.context.font = this.getWidth() + 'px Stencil'; // 设置字体
        let timeTxt = time.toFixed(0);
        if (time<=0){
            timeTxt = 0;
        }
        this.context.fillText("⏱️"+ timeTxt, game_W - 3 * this.getWidth(), this.getWidth() * 2.1); // 绘制剩余时间

        if (Math.abs(timeH - time) <= 0.7) {
            this.context.fillStyle = "red"; // 设置分数颜色
            this.context.fillText("+" + vlH, XXX, YYY * 0.8); // 绘制增加的分数
        }
    }
    useDynamite() {
        console.log("use dynamite",dynamiteNumber);
        dynamiteNumber --; // 使用炸药
        const blastSoundClone = blastSound.cloneNode(); // 克隆音效
        blastSoundClone.play();
        if (index != -1) {
            this.gg[index].alive = false; // 抓到的物体消失
            index = -1; // 重置抓取索引
            drag = false; // 停止拖拽
            ok = false; // 重置抓取状态
        }
    }
    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H); // 清空画布
        this.context.drawImage(bg, (bg.width - game_W * (bg.height / game_H)) / 2, 0, game_W * (bg.height / game_H), bg.height, 0, 0, game_W, game_H); // 绘制背景图片
    }

    checkWin() {
        let check = true; // 检查是否胜利
        for (let i = 0; i < N; i++)
            if (this.gg[i].alive == true)
                check = false; // 如果有金块存活则未胜利
        return check;
    }
    showResult(success) {
        if (success) {
            document.getElementById("successPopup").style.display = "block";
        } else {
            document.getElementById("failPopup").style.display = "block";
            document.getElementById("score").innerText = "得分: " + this.score;
        }
    }
    initGold() {
        this.gg = []; // 初始化金块数组
        for (let i = 0; i < N; i++)
            this.gg[i] = new gold(this); // 创建金块实例
        while (true) {
            let check = true; // 检查金块位置
            for (let i = 0; i < N - 1; i++)
                for (let j = i + 1; j < N; j++)
                    while (this.range(this.gg[i].x, this.gg[i].y, this.gg[j].x, this.gg[j].y) < 2 * this.getWidth()) {
                        check = false; // 如果金块重叠则重新生成位置
                        this.gg[j].randomXY();
                    }
            if (check)
                    break; // 如果所有金块位置合法则退出循环
        }
    }

    getWidth() {
        var area = document.documentElement.clientWidth * document.documentElement.clientHeight; // 计算画布面积
        return Math.sqrt(area / 300); // 计算宽度
    }

    toRadian(angle) {
        return (angle / 180) * Math.PI; // 角度转弧度
    }

    range(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); // 计算两点距离
    }
}

new game(); // 创建游戏实例