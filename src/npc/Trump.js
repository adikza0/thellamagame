import { Npc } from "./Npc";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import trumpAnimationData from '/src/public/spritesheet/trump.json' assert { type: 'json' };
import { Graphics, Container } from "pixi.js";

export class
  Trump extends Npc {
  constructor(player, layer, x = 0, y = 0) {
    const randomPosition = Trump.generateRandomPosition();
    super(player, layer, gameConfig.trump.health, randomPosition.x, randomPosition.y);
    this.fireRate = gameConfig.trump.fireRate;
    this.currentAnimation = 'right';
  }

  async init() {
    await super.init('/src/public/spritesheet/trump.png', trumpAnimationData, 'looking');
    console.log(trumpAnimationData.animations);
    this.spriteContainer.width = 200;
    this.spriteContainer.height = 200;
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
    //preaim -> aimed -> fire -> preaim -> aimed -> fire
    
    
    if(this.calculateDistanceFromPlayer() < gameConfig.trump.destroyRange) {
      this.destroy();
    }
  }
}