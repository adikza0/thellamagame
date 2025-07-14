import gameConfig from './gameConfig.json' assert { type: "json" };
import { Graphics } from 'pixi.js';


export class Projectile {
  constructor(projectile_layer, player, direction) {
    this.player = player
    this.projectile_layer = projectile_layer;
    this.range = gameConfig.player.projectileRange;
    this.speed = gameConfig.player.projectileSpeed;
    const { x, y } = player.getPosition();
    this.direction = direction;
    this.distance_travelled = 0;    
    this.x = x;
    this.y = y;
    this.calculate_movement_per_ticks();
  }

  render() {
    this.sprite = new Graphics()
      .circle(0, 0, 10)
      .fill('0xb3372e');  // Just the color number, no braces

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.projectile_layer.addChild(this.sprite);

  }
  destroy() {
    if (this.sprite) {
      this.projectile_layer.removeChild(this.sprite);
      this.sprite.destroy();
      this.sprite = null;
    }
  }
  calculate_movement_per_ticks() {
    const { velocity_x, velocity_y } = this.player.getVelocity();
    switch (this.direction) {
      case "up":
        this.velocity_x = 0;
        this.velocity_y = -this.speed;
        break;
      case "down":
        this.velocity_x = 0;
        this.velocity_y = this.speed;
        break;
      case "left":
        this.velocity_x = -this.speed;
        this.velocity_y = 0;
        break;
      case "right":
        this.velocity_x = this.speed;
        this.velocity_y = 0;
        break;
      default:
        this.velocity_x = 0;
        this.velocity_y = 0;
        break;
    }
    this.velocity_x += velocity_x;
    this.velocity_y += velocity_y;
  }

 /* move() {
    if (!this.sprite) return;
    this.distance_travelled += Math.sqrt(this.velocity_x ** 2 + this.velocity_y ** 2);
    if (this.distance_travelled > this.range) {
      this.destroy();
      return;
    }
    this.x += this.velocity_x;
    this.y += this.velocity_y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;

  }*/
 _movePosition() {
  this.x += this.velocity_x;
  this.y += this.velocity_y;
  if (this.sprite) {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}
update() {
  if (!this.sprite) return;  // guard
  
  // update travelled distance
  this.distance_travelled += Math.sqrt(this.velocity_x ** 2 + this.velocity_y ** 2);
  
  // destroy if out of range
  if (this.distance_travelled > this.range) {
    this.destroy();
    return;
  }
  
  // update position
  this._movePosition();
}

}