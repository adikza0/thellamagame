import gameConfig from './gameConfig.json' assert { type: "json" };
import { Text, Assets, Container, Sprite } from "pixi.js";

export class UI {
  constructor(player, layer, width, height) {
    this.player = player;
    this.layer = layer;
    this.width = width;
    this.height = height;
    this.maxHearth = gameConfig.player.maxHealth;
    this.widths = this.calculateWidths();

    this.healthContainer = new Container();
    this.layer.addChild(this.healthContainer);
    this.healthContainer.x = 0;
    this.healthContainer.y = 0;
    this.healthContainer.width = this.widths.healthWidth;

    this.slotContainer = new Container();
    this.layer.addChild(this.slotContainer);
    this.slotContainer.x = this.widths.healthWidth;
    this.slotContainer.y = 0;

    this.coinContainer = new Container();
    this.layer.addChild(this.coinContainer);
    this.coinContainer.x = this.widths.healthWidth + this.widths.slotWidth;
    this.coinContainer.y = 0;

  }

  async init() {
    this.hearthTexture = await Assets.load('/src/public/img/hearth.png');
    this.emptyHearthTexture = await Assets.load('/src/public/img/empty_hearth.png');
  }

  calculateWidths() {
    const healthWidth = this.width / 5;
    const hearthWidth = healthWidth / this.maxHearth;
    const slotWidth = this.width / 2;
    const coinWidth = this.width / 10 * 3;
    return { healthWidth, hearthWidth, slotWidth, coinWidth }
  }

  renderHealth() {
    this.healthContainer.removeChildren();

    const textAreaHeight = this.height * 0.3;
    const heartsAreaHeight = this.height - textAreaHeight;

    // ---------------- TEXT ----------------
    const healthText = new Text({
      text: "Health",
      style: {
        fill: 0xffffff,
        fontSize: textAreaHeight * 0.7
      }
    });

    healthText.anchor.set(0.5);
    healthText.x = this.widths.healthWidth / 2;
    healthText.y = textAreaHeight / 2;

    this.healthContainer.addChild(healthText);

    // ---------------- HEARTS ----------------
    const { hearthWidth } = this.widths;

    const totalHeartsWidth = this.maxHearth * hearthWidth;

    // center hearts horizontally
    const startX = (this.widths.healthWidth - totalHeartsWidth) / 2;

    // place hearts inside remaining area
    const heartsStartY = textAreaHeight + (heartsAreaHeight - hearthWidth) / 2;

    for (let i = 0; i < this.maxHearth; i++) {
      const isFull = i < this.player.health;

      const sprite = new Sprite(
        isFull ? this.hearthTexture : this.emptyHearthTexture
      );

      sprite.width = hearthWidth;
      sprite.height = hearthWidth;

      sprite.x = startX + i * hearthWidth;
      sprite.y = heartsStartY;

      this.healthContainer.addChild(sprite);
    }
  }
}