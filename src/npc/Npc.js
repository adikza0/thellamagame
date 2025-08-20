import { AnimatedSprite, Container, Spritesheet, Assets, Sprite } from "pixi.js";

export class Npc {
  constructor(player, layer, health, x, y) {
    this.player = player;
    this.layer = layer;
    this.health = health;
    this.x = x;
    this.y = y;
    this.init(); // This may be overridden by subclasses
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
    if (this.health <= 0) this.destroy();
  }

  getBounds() {
  if (!this.spriteContainer) return { x: this.x, y: this.y, width: 0, height: 0 };

  if (this.animatedSprite) {
    return {
      x: this.spriteContainer.x - this.animatedSprite.width / 2,
      y: this.spriteContainer.y - this.animatedSprite.height / 2,
      width: this.animatedSprite.width,
      height: this.animatedSprite.height
    };
  }

  if (this.base) { // For graphics-based NPCs like Turret
    return {
      x: this.spriteContainer.x - this.base.width / 2,
      y: this.spriteContainer.y - this.base.height / 2,
      width: this.base.width,
      height: this.base.height
    };
  }

  return { x: this.spriteContainer.x, y: this.spriteContainer.y, width: 0, height: 0 };
}


  destroy() {
    if (this.spriteContainer) {
      this.layer.removeChild(this.spriteContainer);
      this.animatedSprite?.destroy();
      this.animatedSprite = null;
      this.spriteContainer.destroy();
      this.spriteContainer = null;
      this.dynamiteSprite?.destroy();
      this.dynamiteSprite = null;
      this.isDestroyed = true;
    }
  }

  update() {
    if (this.spriteContainer) {
      this.spriteContainer.x = this.x;
      this.spriteContainer.y = this.y;
    }
  }

  syncPosition() {
    if (this.isDestroyed || !this.spriteContainer) return;
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }
}
