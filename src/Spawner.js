import { Bat } from './npc/Bat.js';
import { Turret } from './npc/Turret.js';
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
    this.npcs.push(new Bat(this.player, this.layer));
    this.npcs.push(new Turret(this.player, this.layer))
  }

  removeDestroyedNpcs() {
    this.npcs = this.npcs.filter(npc => !npc.isDestroyed);
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