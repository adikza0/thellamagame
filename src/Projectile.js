import gameConfig from './gameConfig.json' assert { type: "json" };
import { Graphics } from 'pixi.js';

export class Projectile {
  constructor(projectileLayer, player, direction) {
    this.player = player;
    this.projectileLayer = projectileLayer;
    this.range = gameConfig.player.projectileRange;
    this.speed = gameConfig.player.projectileSpeed;

    const { x, y } = player.getPosition();
    this.x = x;
    this.y = y;

    this.direction = direction;
    this.distanceTravelled = 0;
    this.radius = 10;

    this.calculateMovementPerTick();
  }

  render() {
    this.sprite = new Graphics()
      .circle(0, 0, this.radius)
      .fill('0xb3372e');

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.projectileLayer.addChild(this.sprite);
  }

  destroy() {
    if (this.sprite) {
      this.projectileLayer.removeChild(this.sprite);
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  calculateMovementPerTick() {
    const { velocityX, velocityY } = this.player.getVelocity();

    switch (this.direction) {
      case "up":
        this.velocityX = 0;
        this.velocityY = -this.speed;
        break;
      case "down":
        this.velocityX = 0;
        this.velocityY = this.speed;
        break;
      case "left":
        this.velocityX = -this.speed;
        this.velocityY = 0;
        break;
      case "right":
        this.velocityX = this.speed;
        this.velocityY = 0;
        break;
      default:
        this.velocityX = 0;
        this.velocityY = 0;
        break;
    }

    this.velocityX += velocityX;
    this.velocityY += velocityY;
  }

  _movePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
  }

  update(wallManager, npcs) {
    if (!this.sprite) return;

    this.distanceTravelled += Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
    if (this.distanceTravelled > this.range) {
      this.destroy();
      return;
    }

    this._movePosition();

    if (this._checkCollision(wallManager, npcs)) {
      this.destroy();
    }
  }

  _checkCollision(wallManager, npcs) {
    const projectileBounds = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
    if(wallManager.intersects(projectileBounds)){
      return true
    };


    for (const npc of npcs) {
      const npcBounds = npc.getBounds();
      if (
        projectileBounds.x < npcBounds.x + npcBounds.width &&
        projectileBounds.x + projectileBounds.width > npcBounds.x &&
        projectileBounds.y < npcBounds.y + npcBounds.height &&
        projectileBounds.y + projectileBounds.height > npcBounds.y
      ) {
        npc.takeDamage(1);
        return true;
      }
    }

    return false;
  }
}
