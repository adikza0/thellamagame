import { AnimatedSprite, Container, Spritesheet, Assets, Sprite } from "pixi.js";
import batAnimationData from '/src/public/spritesheet/bat.json' assert { type: 'json' };
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };

class Npc {
  constructor(player, layer, health, x, y) {
    this.player = player;
    this.layer = layer;
    this.health = health;
    this.x = x;
    this.y = y;
  }

  async init(texturePath, animationData, animationName) {
    this.spriteContainer = new Container();

    this.texture = await Assets.load(texturePath);
    this.spritesheet = new Spritesheet(this.texture, animationData);
    await this.spritesheet.parse();

    const frames = this.spritesheet.animations[animationName];
    this.animatedSprite = new AnimatedSprite(frames);
    this.animatedSprite.anchor.set(0.5);

    this.spriteContainer.addChild(this.animatedSprite);
    this.layer.addChild(this.spriteContainer);

    this.spriteContainer.width = 40;
    this.spriteContainer.height = 40;
    this.animatedSprite.width = 40;
    this.animatedSprite.height = 40;
    this.animatedSprite.animationSpeed = 0.1;
    this.animatedSprite.play();

    this.syncPosition();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  getBounds() {
    if (!this.spriteContainer || !this.animatedSprite) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    return {
      x: this.spriteContainer.x - this.animatedSprite.width / 2,
      y: this.spriteContainer.y - this.animatedSprite.height / 2,
      width: this.animatedSprite.width,
      height: this.animatedSprite.height
    };
  }

  destroy() {
    if (this.spriteContainer) {
      this.layer.removeChild(this.spriteContainer);
      this.animatedSprite.destroy();
      this.animatedSprite = null;
      this.spriteContainer.destroy();
      this.spriteContainer = null;
      if(this.dynamiteSprite){
        this.dynamiteSprite.destroy();
        this.dynamiteSprite = null;
      }
      this.isDestroyed = true; // mark it destroyed
    }
  }


  update() {
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

  syncPosition() {
    if (this.isDestroyed || !this.spriteContainer) return;
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

}

export class Bat extends Npc {
  constructor(player, layer, x = 0, y = 0) {
    super(player, layer, gameConfig.bat.health, x, y);
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

  action(playerPosition) {
    this.move(playerPosition);
    this.syncPosition();
  }

  move(playerPosition) {
    const velocity = this.calculateVelocity(playerPosition);
    this.x += velocity.x;
    this.y += velocity.y;
    if (this.calculateDistanceFromPlayer() < gameConfig.bat.attackRange) {
      
      this.destroy();
      //todo: add code to damage player
      //todo: add explosion animation
    }
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
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1; // prevent divide by 0

    const velocityX = this.speed * (distanceX / distance);
    const velocityY = this.speed * (distanceY / distance);

    if (velocityX < 0 && this.currentAnimation === 'right') {
      this.switchAnimationSide();
    } else if (velocityX >= 0 && this.currentAnimation === 'left') {
      this.switchAnimationSide();
    }

    return { x: velocityX, y: velocityY };
  }

  switchAnimationSide() {
    if (this.currentAnimation === 'left') {
      this.currentAnimation = 'right';
      this.animatedSprite.scale.x = 1;
      this.dynamiteSprite.x = 0;
      this.dynamiteSprite.y = 10
      this.dynamiteSprite.rotation = 4.5;
    } else if (this.currentAnimation === 'right') {
      this.currentAnimation = 'left';
      this.animatedSprite.scale.x = -1;
      this.dynamiteSprite.x = 0;
      this.dynamiteSprite.y = 10
      this.dynamiteSprite.rotation = 4.5;
    }
  }
}
