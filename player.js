import { Bullet } from "./bullet.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.size = 64;
    this.w = this.size;
    this.h = this.size;
    this.x = game.cw * 0.5 - this.w * 0.5;
    this.y = game.ch;
    this.speed = 5;
    this.lives = 3;
    this.hitbox = {};
    this.playerImg = new Image();
    this.playerImg.src = "assets/player.png";
    this.shootSfx = new Audio("assets/shoot.ogg");
    this.shootSfx.volume = 0.2;

    this.isMoveLeft = false;
    this.isMoveRight = false;
    this.isShoot = false;

    this.lastkey = null;

    window.addEventListener("keydown", ({ code }) => {
      if (this.lastkey === code) return;
      this.lastkey = code;

      if (code === "Enter" && this.lastkey === "Enter") {
        this.shoot();
      }

      if (code === "KeyA" && this.lastkey === "KeyA") {
        this.isMoveLeft = true;
      }
      if (code === "KeyD" && this.lastkey === "KeyD") {
        this.isMoveRight = true;
      }
    });

    window.addEventListener("keyup", ({ code }) => {
      this.lastkey = null;

      if (code === "KeyA" && this.lastkey === null) {
        this.isMoveLeft = false;
      }
      if (code === "KeyD" && this.lastkey === null) {
        this.isMoveRight = false;
      }
    });

    shootBtn.ontouchstart = () => {
      this.isShoot = true;
      if (!this.game.gameover) {
        this.shoot();
      }
    };
    shootBtn.ontouchend = () => {
      this.isShoot = false;
    };

    leftBtn.ontouchstart = () => {
      this.isMoveLeft = true;
    };
    leftBtn.ontouchend = () => {
      this.isMoveLeft = false;
    };

    rightBtn.ontouchstart = () => {
      this.isMoveRight = true;
    };
    rightBtn.ontouchend = () => {
      this.isMoveRight = false;
    };
  }

  reset() {
    this.x = this.game.cw * 0.5 - this.w * 0.5;
    this.y = this.game.ch;
    this.game.bullet.bullets = [];
    this.shootSfx.pause();
    this.shootSfx.currentTime = 0;
    this.lives = 3;
  }

  shoot() {
    let { game } = this;
    let { bullet } = this.game;

    if (bullet.bullets.length < 5 && this.game.running && !this.game.gameover) {
      bullet.add(new Bullet(game));
      this.shootSfx.currentTime = 0;
      this.shootSfx.play();
    }
  }

  draw(ctx) {
    ctx.strokeStyle = "#fff0";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.drawImage(this.playerImg, this.x, this.y, this.w, this.h);

    // draw hitbox
    this.hitbox = {
      x: this.x + this.w * 0.5 - 10,
      y: this.y + 16,
      w: 20,
      h: 32,
    };
    ctx.strokeStyle = "#f000";
    ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);

    ctx.fillStyle = "#fff";
    ctx.font = "400 16px sans-serif";
    for (let i = 0; i < this.lives; i++) {
      ctx.fillText("💖", 10 + 22 * i, this.game.ch - 16);
    }
  }

  update(ctx) {
    this.draw(ctx);

    if (this.lives < 0) {
      this.game.gameover = true;
    }

    if (this.y + this.h > this.game.ch) {
      this.y--;
    }

    if (this.isMoveLeft && this.x > -this.w * 0.5) {
      this.x -= this.speed;
    }
    if (this.isMoveRight && this.x + this.w * 0.5 < this.game.cw) {
      this.x += this.speed;
    }
  }
}
