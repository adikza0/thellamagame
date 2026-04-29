import gameConfig from './gameConfig.json' assert { type: "json" };
import { Text, Assets, Container, Sprite } from "pixi.js";
import { Slot } from './Slot';

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
    this.slotTexture = await Assets.load('/src/public/img/slot.png');
    this.bannerTexture = await Assets.load('/src/public/img/banner.png');
  }

  calculateWidths() {
    const healthWidth = this.width / 5;
    const hearthWidth = healthWidth / this.maxHearth;
    const slotWidth = this.width * 0.5;
    const coinWidth = this.width * 0.3;
    return { healthWidth, hearthWidth, slotWidth, coinWidth }
  }

  render() {
    this.renderCoins();
    this.renderHealth();
    this.renderSlot();
  }

  renderHealth() {
    this.healthContainer.removeChildren();

    const textAreaHeight = this.height * 0.3;
    const heartsAreaHeight = this.height - textAreaHeight;

    const sectionWidth = this.widths.healthWidth;

    // ---------------- TEXT ----------------
    const healthText = new Text({
      text: "Health",
      style: {
        fill: 0xffffff,
        fontSize: textAreaHeight * 0.7
      }
    });

    healthText.anchor.set(0.5);
    healthText.x = sectionWidth / 2;
    healthText.y = textAreaHeight / 2;

    this.healthContainer.addChild(healthText);

    // ---------------- HEARTS ----------------
    const { hearthWidth } = this.widths;

    const totalHeartsWidth = this.maxHearth * hearthWidth;

    // center horizontally inside health section
    const startX = (sectionWidth - totalHeartsWidth) / 2;

    // center vertically inside remaining area
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

  renderSlot() {
    if (!this.slotTexture) {
      console.warn("slotTexture not loaded yet");
      return;
    }

    this.slotContainer.removeChildren();

    const slotSprite = new Sprite(this.slotTexture);
    this.slotContainer.addChild(slotSprite);
    this.slotContainer.width = this.widths.slotWidth * 0.8;
    this.slotContainer.x += this.widths.slotWidth * 0.1;
    this.slotContainer.height = this.height*0.9;
    this.slotContainer.y = this.height*0.05;

  }

  renderCoins() {
    this.coinContainer.removeChildren();

    const rowHeight = this.height * 0.3;
    const labelWidth = this.widths.coinWidth * 0.4;
    const valueWidth = this.widths.coinWidth * 0.6;

    const createRow = (label, y) => {
      const rowContainer = new Container();
      rowContainer.y = y;

      const labelText = new Text({
        text: label,
        style: { fill: 0xffffff, fontSize: rowHeight }
      });

      labelText.anchor.set(1, 0);
      labelText.x = labelWidth;

      const valueText = new Text({
        text: "0",
        style: { fill: 0xffffff, fontSize: rowHeight }
      });

      valueText.anchor.set(0.5, 0);
      valueText.x = labelWidth + valueWidth / 2;

      rowContainer.addChild(labelText, valueText);

      return { rowContainer, valueText };
    };

    const coinsRow = createRow("Coins:", this.height * 0.1);
    const scoreRow = createRow("Score:", this.height * 0.6);

    this.coinsValueText = coinsRow.valueText;
    this.scoreValueText = scoreRow.valueText;

    this.coinContainer.addChild(coinsRow.rowContainer);
    this.coinContainer.addChild(scoreRow.rowContainer);

    this.updateCoins();
    this.updateScore();
  }

  updateCoins() {
    this.coinsValueText.text = this.player.coins;
  }

  updateScore() {
    this.scoreValueText.text = this.player.score;
  }
}