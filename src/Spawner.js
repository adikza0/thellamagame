import { Bat } from './npc/Bat.js';
import { Trump } from './npc/Trump.js';
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };

export class Spawner {
  constructor(player, layer) {
    this.player = player;
    this.layer = layer;
    this.npcs = [];
    this.ready = true;
    this.spawnInterval = gameConfig.spawner.spawnInterval;
  }

  async spawn() {
    /*
    const bat = new Bat(this.player, this.layer);
    await bat.init();
    this.npcs.push(bat);
    */

    const trump = new Trump(this.player, this.layer);
    await trump.init();
    this.npcs.push(trump);
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