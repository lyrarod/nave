export class Enemy {
  constructor(game) {
    this.game = game;
    this.size = 64;
    this.w = this.size;
    this.h = this.size;
    this.x = Math.random() * (game.cw - this.w);
    this.y = -this.h;
    this.xSpeed = Math.random() * 0.5 + 0.1;
    this.ySpeed = Math.random() * 0.5 + 0.2;
    this.dx = Math.random() < 0.33 ? -0.3 : Math.random() < 0.66 ? 0.3 : 0;
    this.hitbox = {};
    this.life = 10;
    this.maxLife = this.life;
    this.enemies = [];
    this.timerToNextEnemy = 0;

    this.images = ["enemy1.png", "enemy2.png", "enemy3.png", "enemy4.png"];
    this.randomImg =
      this.images[Math.floor(Math.random() * this.images.length)];

    this.enemyImg = new Image();
    this.enemyImg.src = `assets/${this.randomImg}`;

    this.explosion = new Audio("./assets/explosion.ogg");
    this.explosion.volume = 0.2;
    this.explosion.loop = false;
  }

  takeDamage(damage) {
    if (this.life > 0 && this.hitbox.y > 0) {
      this.life -= damage;
      this.y -= this.hitbox.h * 0.1;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = "#fff0";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.drawImage(this.enemyImg, this.x, this.y, this.w, this.h);

    // draw hitbox
    ctx.strokeStyle = "#f000";
    ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);

    // draw life
    ctx.fillStyle = "goldenrod";
    if (this.life <= this.maxLife * 0.3) {
      ctx.fillStyle = "crimson";
    }
    for (let i = 0; i < this.life; i++) {
      ctx.fillRect(this.hitbox.x - 3 + 3.2 * i, this.hitbox.y - 8, 3, 6);
    }
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(this.hitbox.x - 3, this.hitbox.y - 8, this.hitbox.w + 6, 6);
  }

  update(ctx) {
    if (this.enemies.length < 8) {
      this.timerToNextEnemy++;

      if (this.timerToNextEnemy % 100 === 0) {
        this.enemies.push(new Enemy(this.game));
        this.timerToNextEnemy = 0;
      }
    }

    this.enemies.forEach((enemy, index) => {
      enemy.draw(ctx);
      enemy.x += enemy.xSpeed * enemy.dx;
      enemy.y += enemy.ySpeed;

      enemy.hitbox = {
        x: enemy.x + enemy.w * 0.5 - 13,
        y: enemy.y + 16,
        w: 26,
        h: 22,
      };

      if (this.game.collisionDetection(enemy.hitbox, this.game.player.hitbox)) {
        this.enemies.splice(index, 1);
        if (this.game.player.lives >= 0) {
          this.game.player.lives--;
          this.game.score--;
          this.explosion.currentTime = 0;
          this.explosion.play();
        }
      }

      if (
        enemy.hitbox.x < 0 ||
        enemy.hitbox.x + enemy.hitbox.w > this.game.cw
      ) {
        enemy.dx *= -1;
      }

      if (enemy.hitbox.y > this.game.ch) {
        this.enemies.splice(index, 1);
        if (this.game.player.lives >= 0) {
          this.game.player.lives--;
        }
      }

      if (enemy.life < 1) {
        this.enemies.splice(index, 1);
        this.game.score++;
        this.explosion.currentTime = 0;
        this.explosion.play();
      }
    });
  }
}
