import { Player } from "../Player.js";
import { Graphics } from "pixi.js";
import gameConfig from "/src/gameConfig.json" assert { type: "json" };

export class Laser {
  constructor(layer, fromX, fromY, toX, toY) {
    this.layer = layer;
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.damagedPlayer = false;
  }

  init() {
    this.graphics = new Graphics();
    this.layer.addChild(this.graphics)
  }

  checkPlayerHit(player) {
    //if (this.damagedPlayer) return false;
    const dx = this.toX - this.fromX;
    const dy = this.toY - this.fromY;

    const length = Math.sqrt(dx * dx + dy * dy);

    const dirX = dx / length;
    const dirY = dy / length;

    const px = player.x - this.fromX;
    const py = player.y - this.fromY;

    // distance along beam
    const projection = px * dirX + py * dirY;

    if (projection < 0) return false;

    // perpendicular distance to beam
    const perpX = px - projection * dirX;
    const perpY = py - projection * dirY;

    const distance = Math.sqrt(perpX * perpX + perpY * perpY);
    if (distance < gameConfig.player.radius) {
      this.damagedPlayer = true;
    }
    return distance < gameConfig.player.radius;

  }

  render() {

    this.graphics.clear();

    // direction vector
    const dx = this.toX - this.fromX;
    const dy = this.toY - this.fromY;

    // normalize direction
    const length = Math.sqrt(dx * dx + dy * dy);

    const dirX = dx / length;
    const dirY = dy / length;

    // extend beam far outside screen
    const beamLength = 2000;

    const endX = this.fromX + dirX * beamLength;
    const endY = this.fromY + dirY * beamLength;

    this.graphics
      .moveTo(this.fromX, this.fromY)
      .lineTo(endX, endY)
      .stroke({ width: 6, color: 0xff0000 });

  }

  destroy() {
    if (this.graphics) {
      this.graphics.removeFromParent(); // removes from layer
      this.graphics.destroy();
      this.graphics = null;
    }
  }
}