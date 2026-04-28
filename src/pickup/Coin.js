import { Sprite, Assets } from "pixi.js";
import { Pickup } from "./Pickup";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import { Player } from "../Player";

export class Coin extends Pickup {
  constructor(player, layer) {
    const randomPosition = Coin.generateRandomPosition();
    super(player, layer, randomPosition.x, randomPosition.y);

  }

  async init() {
    await super.init('/src/public/img/coin.png');

    this.spriteContainer.width = 20;
    this.spriteContainer.height = 20;
  }

  pickUp(){
    this.player.pickupCoin();
    super.pickUp();
  }


}