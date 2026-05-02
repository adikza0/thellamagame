import { Assets, Sprite } from "pixi.js";
import gameConfig from './gameConfig.json' assert { type: "json" };

export class Slot {
  constructor(layer, ui) {
    this.layer = layer;
    this.ui = ui;

  }

  async init() {


    this.hearthTexture = await Assets.load('/src/public/img/hearth.png');
    this.nukeTexture = await Assets.load('/src/public/img/nuke.png');
    this.goldTexture = await Assets.load('/src/public/img/gold.png');
    this.newSymbols = [];
    this.spawnInitialSymbols();
  }

  async spin() {
    // staré symboly → dolů
    for (let sprite of this.oldSymbols) {
      sprite.targetY = this.ui.slotSprites[1].height * 0.7;
    }

    const result = [
      this.generateResult(),
      this.generateResult(),
      this.generateResult()
    ];

    this.newSymbols = [
      this.spawnSymbol(result[0], 1),
      this.spawnSymbol(result[1], 2),
      this.spawnSymbol(result[2], 3)
    ];

    // nové symboly → střed
    for (let sprite of this.newSymbols) {
      sprite.targetY = this.ui.slotSprites[1].height * 0.45;
    }
  }

  generateResult() {
    const result = Math.floor(Math.random() * 3);
    switch (result) {
      case 0:
        return "hearth";
      case 1:
        return "nuke";
      case 2:
        return "gold";
    }
  }

  spawnSymbol(symbol, reel) {
    let symbolSprite;
    switch (symbol) {
      case "hearth":
        symbolSprite = new Sprite(this.hearthTexture);
        break;
      case "nuke":
        symbolSprite = new Sprite(this.nukeTexture);
        break;
      case "gold":
        symbolSprite = new Sprite(this.goldTexture);
        break;
    }

    symbolSprite.width = this.ui.slotSprites[1].width * 0.7;
    symbolSprite.height = this.ui.slotSprites[1].height * 0.2;
    this.ui.slotContainer.addChild(symbolSprite);

    switch (reel) {
      case 1:
        symbolSprite.x = this.ui.slotSprites[1].x + (this.ui.slotSprites[1].width - symbolSprite.width) / 2;
        symbolSprite.y = this.ui.slotSprites[1].height * 0.2;
        //y= *0.45 is center, 0.7 is bottom, 0.2 is top
        break;
      case 2:
        symbolSprite.x = this.ui.slotSprites[2].x + (this.ui.slotSprites[2].width - symbolSprite.width) / 2;
        symbolSprite.y = this.ui.slotSprites[2].height * 0.2;
        break;
      case 3:
        symbolSprite.x = this.ui.slotSprites[3].x + (this.ui.slotSprites[3].width - symbolSprite.width) / 2;
        symbolSprite.y = this.ui.slotSprites[1].height * 0.2;
        break;
    }
    return symbolSprite;
  }
  moveToCenter(symbolSprite) {
    symbolSprite.y += gameConfig.slot.slotSpeed;
  }

  moveToBottom(symbolSprite) {
    symbolSprite.y += gameConfig.slot.slotSpeed;
  }

  destroyOldSymbols(){
    for (let sprite of this.oldSymbols) {
      this.ui.slotContainer.removeChild(sprite);
      sprite.destroy();
    }
    this.oldSymbols = [];
  }

  

  update() {
    const speed = gameConfig.slot.slotSpeed;

    const all = [...this.oldSymbols, ...this.newSymbols];

    for (let sprite of all) {
      if (sprite.targetY === undefined) continue;

      if (sprite.y < sprite.targetY) {
        sprite.y += speed;

        if (sprite.y >= sprite.targetY) {
          sprite.y = sprite.targetY;
          sprite.targetY = undefined;
        }
      }
    }

    // když nové dojedou → swap
    const allStopped = this.newSymbols.every(s => s.targetY === undefined);

    if (allStopped && this.newSymbols.length > 0) {
      this.destroyOldSymbols();
      this.oldSymbols = this.newSymbols;
      this.newSymbols = [];
      this.isRunning = false;
    }
  }

  spawnInitialSymbols() {
    const symbols = ["hearth", "nuke", "gold"];

    this.oldSymbols = symbols.map((sym, i) => {
      const sprite = this.spawnSymbol(sym, i + 1);

      sprite.y = this.ui.slotSprites[1].height * 0.45;
      sprite.targetY = undefined;

      return sprite;
    });
  }

}