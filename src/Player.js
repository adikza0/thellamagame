import { Sprite, Assets, Spritesheet, AnimatedSprite, Container } from 'pixi.js';
import gameConfig from './gameConfig.json' assert { type: "json" };
import llamaWalkData from '/src/public/spritesheet/llama_movement.json' assert { type: 'json' };

export class Player {

  constructor(playerLayer, walls) {
    this.currentAnimation = 'llama_eat_down'; // default animation on start
    this.playerLayer = playerLayer;
    this.x = 0;
    this.y = 0;
    this.speed = 4;
    this.walls = walls;
    this.velocity_x = 0;
    this.velocity_y = 0;
  }

  async init() {
    const texture = await Assets.load('/src/public/spritesheet/llama_movement.png');
    this.spritesheet = new Spritesheet(texture, llamaWalkData);
    await this.spritesheet.parse();

    this.spriteContainer = new Container();

    this.animatedSprite = new AnimatedSprite(this.spritesheet.animations[this.currentAnimation]);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.x = gameConfig.player.width / 2;
    this.animatedSprite.y = gameConfig.player.height / 2;
    this.animatedSprite.animationSpeed = 0.12;
    this.animatedSprite.play();

    this.spriteContainer.addChild(this.animatedSprite);

    this.playerLayer.addChild(this.spriteContainer);
  }

  render(x, y) {
    this.x = x;
    this.y = y;
    this.sync_position();
  }

  change_animation(animation) {
    if (!this.spritesheet.animations[animation]) {
      console.warn(`Unknown animation: ${animation}`);
      return;
    }

    this.currentAnimation = animation;
    this.animatedSprite.textures = this.spritesheet.animations[animation];
    this.animatedSprite.gotoAndPlay(0);
    this.animatedSprite.animationSpeed = 0.13;
  }

  move(x_offset, y_offset) {
    let movedX = 0;
    let movedY = 0;

    if (!this.checkCollision(x_offset, 0)) {
      this.x += x_offset;
      movedX = x_offset;
    }

    if (!this.checkCollision(0, y_offset)) {
      this.y += y_offset;
      movedY = y_offset;
    }

    this.velocity_x = movedX;
    this.velocity_y = movedY;

    this.sync_position();
  }

  getVelocity() {
    return { velocity_x: this.velocity_x, velocity_y: this.velocity_y };
  }

  sync_position() {
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

  getBounds(x_offset = 0, y_offset = 0) {
    return {
      x: Math.round(this.x + x_offset),
      y: Math.round(this.y + y_offset),
      width: gameConfig.player.width,
      height: gameConfig.player.height
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
        return true; // Collision detected
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
