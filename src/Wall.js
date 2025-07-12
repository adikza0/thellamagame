import { Graphics } from "pixi.js";
export class Wall {
  constructor(app, min_x, max_x, min_y, max_y) {
    this.min_x = min_x;
    this.max_x = max_x;
    this.min_y = min_y;
    this.max_y = max_y;
    this.app = app;
  }
  render() {
    this.wall = new Graphics().rect(this.min_x, this.min_y, this.max_x - this.min_x, this.max_y - this.min_y);
    this.wall.fill(({ color: 0xb3372e }));
    this.app.stage.addChild(this.wall);
  }
  getBounds() {
    return {
      x: this.min_x,
      y: this.min_y,
      width: this.max_x - this.min_x,
      height: this.max_y - this.min_y
    };
  }
}