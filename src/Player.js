import { Sprite, Assets, Spritesheet, AnimatedSprite, Container } from 'pixi.js';
import gameConfig from './gameConfig.json' assert { type: "json" };
import llamaWalkData from '/src/public/spritesheet/llama_movement.json' assert { type: 'json' };

export class Player {
  constructor(playerLayer, walls) {
    this.currentAnimation = 'llama_eat_down'; // default animation on start
    this.playerLayer = playerLayer;
    this.x = 0;
    this.y = 0;
    this.speed = gameConfig.player.speed;
    this.walls = walls;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = gameConfig.player.health;
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
    this.syncPosition();
  }

  changeAnimation(animation) {
    if (!this.spritesheet.animations[animation]) {
      console.warn(`Unknown animation: ${animation}`);
      return;
    }

    this.currentAnimation = animation;
    this.animatedSprite.textures = this.spritesheet.animations[animation];
    this.animatedSprite.gotoAndPlay(0);
    this.animatedSprite.animationSpeed = 0.13;
  }

  move(xOffset, yOffset) {
    let movedX = xOffset;
    let movedY = yOffset;

    // Normalize diagonal movement
    if (xOffset !== 0 && yOffset !== 0) {
      movedX /= Math.SQRT2;
      movedY /= Math.SQRT2;
    }

    let actualMovedX = 0;
    let actualMovedY = 0;

    if (!this.checkCollision(movedX, 0)) {
      this.x += movedX;
      actualMovedX = movedX;
    }

    if (!this.checkCollision(0, movedY)) {
      this.y += movedY;
      actualMovedY = movedY;
    }

    this.velocityX = actualMovedX;
    this.velocityY = actualMovedY;

    this.syncPosition();
  }

  getVelocity() {
    return { velocityX: this.velocityX, velocityY: this.velocityY };
  }

  syncPosition() {
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

  getBounds(xOffset = 0, yOffset = 0) {
    return {
      x: Math.round(this.x + xOffset),
      y: Math.round(this.y + yOffset),
      width: gameConfig.player.width,
      height: gameConfig.player.height
    };
  }

  checkCollision(xOffset, yOffset) {
    const playerBounds = this.getBounds(xOffset, yOffset);
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

  takeDamage(){
    this.health -= 1;
    if (this.health <= 0) {
      console.log("You DIED")
    }
  }
}
