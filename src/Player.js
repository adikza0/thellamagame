import { Sprite, Assets, Spritesheet, AnimatedSprite, Container } from 'pixi.js';
import gameConfig from './gameConfig.json' assert { type: "json" };
import llamaWalkData from '/src/public/spritesheet/llama_movement.json' assert { type: 'json' };


export class Player {

  constructor(playerLayer, walls) {
    this.playerLayer = playerLayer;
    this.x = 0;
    this.y = 0;
    this.speed = 5;
    this.walls = walls;
  }

  async init() {
    const texture = await Assets.load('/src/public/spritesheet/llama_movement.png');
    this.spritesheet = new Spritesheet(texture, llamaWalkData);
    await this.spritesheet.parse();
    this.animatedSprite = new AnimatedSprite(this.spritesheet.animations.llama_eat_down)
    this.animatedSprite.play();
    this.animatedSprite.animationSpeed = 0.12
  }

  render(x, y) {

    this.spriteContainer = new Container();
    this.x = x - this.animatedSprite.width / 2;
    this.y = y - this.animatedSprite.height / 2;

    this.sync_position();

    this.spriteContainer.addChild(this.animatedSprite);
    this.playerLayer.addChild(this.spriteContainer);
  }

  change_animation(animation) {

    if (!this.spritesheet.animations[animation]) {
      console.warn(`Unknown animation: ${animation}`);
      return;
    }

    // Remove old sprite
    this.playerLayer.removeChild(this.spriteContainer);

    this.spriteContainer = new Container();
    this.animatedSprite = new AnimatedSprite(this.spritesheet.animations[animation]);
    this.spriteContainer.addChild(this.animatedSprite);

    //total bshit to shift animation little bit down because it would teleport
    if (animation === "llama_eat_left" || animation === "llama_eat_right") {
      this.animatedSprite.y += 25;
    }

    this.animatedSprite.animationSpeed = 0.13;
    this.animatedSprite.play();
    // Restore position


    this.playerLayer.addChild(this.spriteContainer);
    this.sync_position();
  }

  move(x_offset, y_offset) {
    // Try moving on X axis
    if (!this.checkCollision(x_offset, 0)) {
      this.x += x_offset;
    }

    // Try moving on Y axis
    if (!this.checkCollision(0, y_offset*2)) {
      this.y += y_offset;
    }

    this.sync_position();
  }

  sync_position() {
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

  getBounds(x_offset = 0, y_offset = 0) {
    return {
      x: this.x + x_offset,
      y: this.y + y_offset,
      width: this.animatedSprite.width,
      height: this.animatedSprite.height
    };
  }

  checkCollision(x_offset, y_offset) {
    const playerBounds = this.getBounds(x_offset, y_offset);
    for (const wall of this.walls) {
      const wallBounds = wall.getBounds();
      if (
        playerBounds.x < wallBounds.x + wallBounds.width &&
        playerBounds.x + playerBounds.width > wallBounds.x &&
        playerBounds.y < wallBounds.y + wallBounds.height &&
        playerBounds.y + playerBounds.height > wallBounds.y
      ) {
        return true; // Collision
      }
    }
    return false;
  }

  getPosition() {
  return {
    x: this.spriteContainer.x + this.spriteContainer.width / 2,
    y: this.spriteContainer.y + this.spriteContainer.height / 2
  };
}
}