import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";

export class Game {
  constructor(context) {
    this.ctx = context;
    this.cw = context.canvas.width = 600;
    this.ch = context.canvas.height = 794;
    this.lt = 0;
    this.score = 0;

    this.player = new Player(this);
    this.bullet = new Bullet(this);
    this.enemy = new Enemy(this);

    this.gameObjects = [this.bullet, this.enemy, this.player];

    this.bgImg = new Image();
    this.bgImg.src = "assets/bg_blue.png";
    this.loadMusic();

    this.running = false;
    this.gameover = false;
  }

  loadMusic() {
    this.track =
      Math.random() < 0.33
        ? "ryu.mp3"
        : Math.random() < 0.66
        ? "guile.mp3"
        : "topgear.mp3";
    this.music = new Audio();
    this.music.src = `assets/${this.track}`;
    this.music.volume = this.track === "topgear.mp3" ? 0.2 : 1;
    this.music.loop = true;
  }

  update() {
    let { gameObjects, ctx } = this;

    gameObjects.forEach((object) => {
      object.update(ctx);
    });

    this.drawScore(ctx);
  }

  loop = (ts = 0) => {
    let dt = ts - this.lt;
    this.lt = ts;

    let { ctx, cw, ch, loop } = this;

    if (this.gameover) {
      this.music.pause();
      this.music.currentTime = 0;
      playagainbtn.style.display = "flex";

      ctx.save();
      ctx.font = "900 48px Sans-Serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowOffsetY = 6;
      ctx.shadowColor = "#0005";
      ctx.fillStyle = "white";
      ctx.fillText("GAME OVER!", this.cw * 0.5, this.ch * 0.5);
      ctx.restore();

      return;
    }

    this.drawBackground(ctx);
    this.update();
    requestAnimationFrame(loop);
  };

  start() {
    this.loop();
    this.running = true;
    this.music.play();
  }

  drawScore(ctx) {
    ctx.fillStyle = "#fff";
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "#0003";
    ctx.font = "900 20px Sans-Serif";
    ctx.fillText(`SCORE: ${this.score}`, 10, 30);
  }

  drawBackground(ctx) {
    ctx.drawImage(this.bgImg, 0, 0, this.cw, this.ch);
  }

  reset() {
    this.gameover = false;
    this.score = 0;
    this.loadMusic();
    this.music.play();
    this.player.reset();
    this.enemy.enemies = [];
    this.loop();
  }

  collisionDetection(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  }
}
