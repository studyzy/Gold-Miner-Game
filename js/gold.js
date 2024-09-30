var goldIm = new Image();
goldIm.src="images/gold.png";
var rockIm = new Image();
rockIm.src="images/rock.png";
var diamondIM = new Image();
diamondIM.src="images/diamond.png";
var randomIm = new Image();
randomIm.src="images/random.png";
var bitcoinIm = new Image();
bitcoinIm.src="images/bitcoin.png";
class gold {
    constructor(game) {
        // 保存游戏实例
        this.game = game;
        // 初始化金块
        this.init();
    }

    init() {
        // 随机生成金块类型
        this.type = Math.floor(Math.random() * 100000) % 9;
        // 随机生成金块的 x 坐标
        this.x = 2 * this.game.getWidth() + Math.random() * (game_W - 4 * this.game.getWidth());
        // 随机生成金块的 y 坐标
        this.y = 2 * this.game.getWidth() + game_H / 3 + Math.random() * (2 * game_H / 3 - 4 * this.game.getWidth());
        // 设置金块为存活状态
        this.alive = true;
        // 更新金块属性
        this.update();
    }

    update() {
        // 根据金块类型设置不同的属性
        switch (this.type) {
            case 0:
                // 小金块
                this.speed = this.game.getWidth() / 5;
                this.width = this.game.getWidth();
                this.height = this.game.getWidth() ;
                this.IM = goldIm;
                this.score = 50;
                break;
            case 1:
                // 中金块
                this.speed = this.game.getWidth() / 8;
                this.width = 1.5 * this.game.getWidth();
                this.height = 1.5 * this.game.getWidth();
                this.IM = goldIm;
                this.score = 100;
                break;
            case 2:
                // 大金块
                this.speed = this.game.getWidth() / 20;
                this.width = 2.5 * this.game.getWidth();
                this.height = 2.5 * this.game.getWidth() ;
                this.IM = goldIm;
                this.score = 500;
                break;
            case 3:
                // 小石块
                this.speed = this.game.getWidth() / 15;
                this.width = 1.5 * this.game.getWidth();
                this.height = 1.5 * this.game.getWidth();
                this.IM = rockIm;
                this.score = 11;
                break;
            case 4:
                // 中石块
                this.speed = this.game.getWidth() / 40;
                this.width = 1.8 * this.game.getWidth();
                this.height = 1.8 * this.game.getWidth();
                this.IM = rockIm;
                this.score = 20;
                break;
            case 5:
                // 大石块
                this.speed = this.game.getWidth() / 65;
                this.width = 2 * this.game.getWidth();
                this.height = 2 * this.game.getWidth();
                this.IM = rockIm;
                this.score = 30;
                break;
            case 6:
                //随机包
                this.speed = this.game.getWidth() / 8;
                this.width = 1 * this.game.getWidth();
                this.height = 1 * this.game.getWidth();
                this.IM = randomIm;
                this.score = Math.floor(Math.random() * 1000);
                break;
            case 7:
                // 钻石
                this.speed = this.game.getWidth() / 2.5;
                this.width = this.game.getWidth() / 2;
                this.height = this.game.getWidth() / 2.5;
                this.IM = diamondIM;
                this.score = 600;
                break;
            case 8:
                // 比特币
                this.speed = this.game.getWidth() / 30;
                this.width = this.game.getWidth() * 2;
                this.height = this.game.getWidth() * 2;
                this.IM = bitcoinIm;
                this.score = 999;
                break;
        }
    }

    randomXY() {
        // 随机生成金块的 x 坐标
        this.x = 2 * this.game.getWidth() + Math.random() * (game_W - 4 * this.game.getWidth());
        // 随机生成金块的 y 坐标
        this.y = 2 * this.game.getWidth() + game_H / 3 + Math.random() * (2 * game_H / 3 - 4 * this.game.getWidth());
    }

    draw() {
        // 绘制金块
        this.game.context.drawImage(this.IM, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    size() {
        // 计算金块的大小
        return Math.sqrt(this.width * this.width + this.height * this.height) / 2;
    }
}