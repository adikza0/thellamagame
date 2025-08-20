import { Npc } from "./Npc";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import { Graphics, Container } from "pixi.js";

export class
  Turret extends Npc {
  constructor(player, layer, x = 0, y = 0) {
    const randomPosition = Turret.generateRandomPosition();
    super(player, layer, gameConfig.turret.health, randomPosition.x, randomPosition.y);
    this.fireRate = gameConfig.turret.fireRate;
  }

  init() {
    this.spriteContainer = new Container();
    this.layer.addChild(this.spriteContainer);

    // Draw the turret base
    this.base = new Graphics();
    this.base.beginFill(0x555555);
    this.base.drawCircle(0, 0, 15);
    this.base.endFill();

    this.spriteContainer.addChild(this.base);

    this.syncPosition();
  }
  static generateRandomPosition() {
    const width = gameConfig.game.width;
    const height = gameConfig.game.height;
    const uiHeight = gameConfig.game.UIHeight;
    const totalHeight = height + uiHeight;
    const spawnBuffer = 50;

    const minX = spawnBuffer;
    const maxX = width - spawnBuffer;
    const minY = uiHeight + spawnBuffer;
    const maxY = height - spawnBuffer;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    return {x, y};
  }

  action() {

  }
}