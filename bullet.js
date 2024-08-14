export class Bullet {
  constructor(game) {
    this.game = game;
    this.w = 2;
    this.h = 18;
    this.x = game.player.x + game.player.w * 0.5 - this.w * 0.5;
    this.y = game.player.y;
    this.speed = 18;
    this.color = "cyan";
    this.remove = false;
    this.bullets = [];
  }

  add(bullet) {
    this.bullets.push(bullet);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  update(ctx) {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.draw(ctx);
      bullet.y -= bullet.speed;

      this.game.enemy.enemies.forEach((enemy, index) => {
        if (this.game.collisionDetection(bullet, enemy.hitbox)) {
          enemy.takeDamage(1);
          bullet.remove = true;
        }
      });

      return bullet.y > -bullet.h && !bullet.remove;
    });
  }
}
