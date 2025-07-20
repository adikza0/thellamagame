import { Bat } from './Npc.js';
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };

export class Spawner {
  constructor(player, layer) {
    this.player = player;
    this.layer = layer;
    this.npcs = [];
    this.ready = true;
    this.spawnInterval = gameConfig.spawner.spawnInterval;
  }

  spawn() {
    const position = this.generateRandomPosition();
    this.npcs.push(new Bat(this.player, this.layer, position.x, position.y));
  }

  removeDestroyedNpcs() {
    this.npcs = this.npcs.filter(npc => !npc.isDestroyed);
  }

  generateRandomPosition() {
    const width = gameConfig.game.width;
    const height = gameConfig.game.height;
    const uiHeight = gameConfig.game.UIHeight;
    const totalHeight = height + uiHeight;
    const spawnBuffer = 50; // How far off-screen to spawn

    let side = Math.floor(Math.random() * 4); // 0 = left, 1 = right, 2 = top, 3 = bottom
    ;

    let x, y;

    switch (side) {
      case 0: // Left
        x = -spawnBuffer;
        y = Math.random() * totalHeight;
        break;
      case 1: // Right
        x = width + spawnBuffer;
        y = Math.random() * totalHeight;
        break;
      case 2: // Top
        x = Math.random() * width;
        y = -spawnBuffer;
        break;
      case 3: // Bottom
        x = Math.random() * width;
        y = totalHeight + spawnBuffer;
        break;
    }

    return { x, y };
  }

  action() {
    this.removeDestroyedNpcs();
    if (this.ready) {
      for (let i = 0; i < gameConfig.spawner.spawnCount; i++) {
        this.spawn();
      }
      this.ready = false;
      setTimeout(() => {
        this.ready = true;
      }, this.spawnInterval);
    }
  }
}