import { Graphics } from "pixi.js";

export class Wall {
  constructor(app, minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.app = app;
  }

  render() {
    this.wall = new Graphics()
      .rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY)
      .fill({ color: 0xb3372e });

    this.app.stage.addChild(this.wall);
  }

  getBounds() {
    return {
      x: this.minX,
      y: this.minY,
      width: this.maxX - this.minX,
      height: this.maxY - this.minY
    };
  }
}
