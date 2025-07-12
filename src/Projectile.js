import gameConfig from './gameConfig.json' assert { type: "json" };
import { Graphics } from 'pixi.js';

export class Projectile {
  constructor(projectileLayer, player, direction) {
    this.player = player
    this.projectileLayer = projectileLayer;
    this.range = gameConfig.player.projectileRange;
    this.speed = gameConfig.player.projectileSpeed;
    const { x, y } = player.getPosition();
    this.direction = direction;

    this.x = x;
    this.y = y;
    this.destination_x = this.x;
    this.destination_y = this.y;
    switch (direction) {
      case "right":
        this.destination_x += this.range;
        break;
      case "left":
        this.destination_x -= this.range;
        break;
      case "up":
        this.destination_y -= this.range;
        break;
      case "down":
        this.destination_y += this.range;
        break;
    }
  }

  render() {
    this.sprite = new Graphics()
      .circle(0, 0, 10)
      .fill('0xb3372e');  // Just the color number, no braces

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
  move() {
    switch(this.direction){
      case "up":
        this.y -= this.speed;
        this.sprite.y = this.y;
        if(this.y < this.destination_y){
          this.destroy();
        }
        break;
      case "down":
        this.y += this.speed;
        this.sprite.y = this.y;
        if(this.y > this.destination_y){
          this.destroy();
        }
        break;
      case "left":
        this.x -= this.speed;
        this.sprite.x = this.x;
        if(this.x < this.destination_x){
          this.destroy();
        }
        break;
      case "right":
        this.x += this.speed;
        this.sprite.x = this.x;
        if(this.x > this.destination_x){
          this.destroy();
        }
        break;
    }
  }

}