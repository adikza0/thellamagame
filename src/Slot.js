import { Assets, Sprite } from "pixi.js";

export class Slot {
  constructor(layer){
    this.layer = layer;
    this.isRunning = false;
  }

  async init(){
    

    this.hearthTexture = await Assets.load('/src/public/img/hearth.png');
    this.nukeTexture = await Assets.load('/src/public/img/nuke.png');
    this.goldTexture = await Assets.load('/src/public/img/gold.png');
  }

  async spin(){
    if(this.isRunning) return;

    this.isRunning = true;
    console.log('spin');
    const result = this.generateResult();
    this.isRunning = false;
  }

  generateResult(){
    const result = [];
    for(let i = 0; i < 3; i++){
      result.push(Math.floor(Math.random()*3));
    }
    return result;
  }

}