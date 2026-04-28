import { Assets, Sprite } from "pixi.js";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };



export class Pickup {
  constructor(player, layer, x, y) {
    this.player = player;
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.pickupRange = gameConfig.player.radius;
    this.isDestroyed = false;
  }

  async init(texturePath) {

    const texture = await Assets.load(texturePath);
    this.spriteContainer = new Sprite(texture);

    this.spriteContainer.anchor.set(0.5);

    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;

    this.layer.addChild(this.spriteContainer);
  }

  destroy() {
    if (this.spriteContainer) {
      this.layer.removeChild(this.spriteContainer);
      this.spriteContainer.destroy();
      this.spriteContainer = null;
    }
    this.isDestroyed = true;
  }

  pickUp() {
    this.destroy();
    console.log('vzals coin')
  }

  calculateDistanceFromPlayer() {
    if (!this.spriteContainer) return Infinity;

    const position = this.player.getPosition();

    return Math.sqrt(
      (this.spriteContainer.x - position.x) ** 2 +
      (this.spriteContainer.y - position.y) ** 2
    );
  }

  checkIfPickedUp() {
    if (!this.spriteContainer) return;

    if (this.calculateDistanceFromPlayer() < this.pickupRange) {
      this.pickUp();
    }
  }

  static generateRandomPosition() {
    const width = gameConfig.game.width;
    const height = gameConfig.game.height;
    const uiHeight = gameConfig.game.UIHeight;
    const spawnBuffer = 50;

    const minX = spawnBuffer;
    const maxX = width - spawnBuffer;
    const minY = uiHeight + spawnBuffer;
    const maxY = height - spawnBuffer;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    return { x, y };
  }

  update() {
    if (this.isDestroyed) return;

    this.checkIfPickedUp();
  }

}