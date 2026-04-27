import { AnimatedSprite, Container, Spritesheet, Assets, Sprite } from "pixi.js";


export class Pickup {
  constructor(player, layer, x, y) {
    this.player = player;
    this.layer = layer;
    this.x = x;
    this.y = y;
  }

  async init(texturePath) {
    this.spriteContainer = new Container();

    const texture = await Assets.load(texturePath);
    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);

    this.spriteContainer.addChild(this.sprite);

    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;

    this.layer.addChild(this.spriteContainer);
  }
}