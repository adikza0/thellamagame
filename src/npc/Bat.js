import { AnimatedSprite, Container, Spritesheet, Assets, Sprite } from "pixi.js";
import { Npc } from './Npc.js';
import batAnimationData from '/src/public/spritesheet/bat.json' assert { type: 'json' };
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import explosionData from '/src/public/spritesheet/explosion.json' assert { type: 'json' };

export class Bat extends Npc {
  constructor(player, layer) {
    const randomPosition = Bat.generateRandomPosition(); // ✅ static method
    super(player, layer, gameConfig.bat.health, randomPosition.x, randomPosition.y);
    this.speed = gameConfig.bat.speed;
    this.currentAnimation = 'right';
  }

  async init() {
    await super.init('/src/public/spritesheet/bat.png', batAnimationData, 'fly');

    const texture = await Assets.load('/src/public/img/dynamite.png');
    this.dynamiteSprite = new Sprite(texture);
    this.dynamiteSprite.anchor.set(0.5);
    this.dynamiteSprite.x = 5;
    this.dynamiteSprite.width = 20;
    this.dynamiteSprite.height = 15;
    this.spriteContainer.addChild(this.dynamiteSprite);
    this.switchAnimationSide();
  }

  static generateRandomPosition() {
    const width = gameConfig.game.width;
    const height = gameConfig.game.height;
    const uiHeight = gameConfig.game.UIHeight;
    const totalHeight = height + uiHeight;
    const spawnBuffer = 50;

    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
      case 0: x = -spawnBuffer; y = Math.random() * totalHeight; break;
      case 1: x = width + spawnBuffer; y = Math.random() * totalHeight; break;
      case 2: x = Math.random() * width; y = -spawnBuffer; break;
      case 3: x = Math.random() * width; y = totalHeight + spawnBuffer; break;
    }

    return { x, y };
  }

  action(playerPosition = { x: 0, y: 0 }) {
    this.move(playerPosition);
    this.syncPosition();
  }

  move(playerPosition) {
    const velocity = this.calculateVelocity(playerPosition);
    this.x += velocity.x;
    this.y += velocity.y;

    if (this.calculateDistanceFromPlayer() < gameConfig.bat.attackRange) {
      this.explode();
    }
  }

  async explode() {
    const explosionX = this.spriteContainer.x;
    const explosionY = this.spriteContainer.y;
    this.player.takeDamage();
    this.destroy();

    const explosionTexture = await Assets.load('/src/public/spritesheet/explosion.png');
    const explosionSheet = new Spritesheet(explosionTexture, explosionData);
    await explosionSheet.parse();

    const explosionSprite = new AnimatedSprite(explosionSheet.animations['explosion']);
    explosionSprite.anchor.set(0.5);
    explosionSprite.width = 60;
    explosionSprite.height = 60;
    explosionSprite.x = explosionX + 15;
    explosionSprite.y = explosionY + 15;
    explosionSprite.animationSpeed = 0.2;
    explosionSprite.loop = false;

    this.layer.addChild(explosionSprite);
    explosionSprite.play();
    explosionSprite.onComplete = () => explosionSprite.destroy();
  }

  calculateDistanceFromPlayer() {
    const position = this.player.getPosition();
    return Math.sqrt(
      (this.spriteContainer.x - position.x) ** 2 +
      (this.spriteContainer.y - position.y) ** 2
    );
  }

  calculateVelocity(playerPosition) {
    const distanceX = playerPosition.x - this.spriteContainer.x;
    const distanceY = playerPosition.y - this.spriteContainer.y;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

    const velocityX = this.speed * (distanceX / distance);
    const velocityY = this.speed * (distanceY / distance);

    if (velocityX < 0 && this.currentAnimation === 'right') this.switchAnimationSide();
    else if (velocityX >= 0 && this.currentAnimation === 'left') this.switchAnimationSide();

    return { x: velocityX, y: velocityY };
  }

  switchAnimationSide() {
    if (!this.animatedSprite) return;

    if (this.currentAnimation === 'left') {
      this.currentAnimation = 'right';
      this.animatedSprite.scale.x = 1;
    } else if (this.currentAnimation === 'right') {
      this.currentAnimation = 'left';
      this.animatedSprite.scale.x = -1;
    }

    if (this.dynamiteSprite) {
      this.dynamiteSprite.x = 0;
      this.dynamiteSprite.y = 10;
      this.dynamiteSprite.rotation = 4.5;
    }
  }
}
