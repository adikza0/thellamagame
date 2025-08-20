import { Wall } from "./Wall"

export class WallManager {
  constructor(app) {
    this.app = app;
    this.walls = []
  }
  create(minX, maxX, minY, maxY) {
    this.walls.push(new Wall(this.app, minX, maxX, minY, maxY))
  }
  render() {
    this.walls.forEach((wall) => {
      wall.render();
    })
  }
  isThereWall(x, y) {
    return this.walls.some((wall) =>
      wall.minX <= x &&
      wall.maxX >= x &&
      wall.minY <= y &&
      wall.maxY >= y
    );
  }
  intersects(bounds) {
    return this.walls.some((wall) => {
      const wallBounds = wall.getBounds();
      return (
        bounds.x < wallBounds.x + wallBounds.width &&
        bounds.x + bounds.width > wallBounds.x &&
        bounds.y < wallBounds.y + wallBounds.height &&
        bounds.y + bounds.height > wallBounds.y
      );
    });
  }


}
