import { Bat } from './npc/Bat.js';
import { Trump } from './npc/Trump.js';
import { Coin } from './pickup/Coin.js';
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };

export class Spawner {
  constructor(player, layer) {
    this.player = player;
    this.layer = layer;

    this.npcs = [];
    this.pickups = [];

    this.spawnInterval = gameConfig.spawner.spawnInterval;
    this.spawnTimer = 0;
  }

  async spawn() {

    const bat = new Bat(this.player, this.layer);
    await bat.init();
    this.npcs.push(bat);

    const trump = new Trump(this.player, this.layer);
    await trump.init();
    this.npcs.push(trump);

    const coin = new Coin(this.player, this.layer);
    await coin.init();
    this.pickups.push(coin);
  }

  removeDestroyed() {
    this.npcs = this.npcs.filter(npc => !npc.isDestroyed);
    this.pickups = this.pickups.filter(p => !p.isDestroyed);
  }

  updateEntities() {
    this.npcs.forEach(npc => npc.update?.());
    this.pickups.forEach(p => p.update?.());
  }

  update(delta, player) {

    this.spawnTimer -= delta;

    if (this.spawnTimer <= 0) {
      for (let i = 0; i < gameConfig.spawner.spawnCount; i++) {
        this.spawn();
      }
      this.spawnTimer = this.spawnInterval;
    }

    // NPC update
    this.npcs.forEach(npc => npc.action(player.getPosition()));

    // PICKUP UPDATE
    this.pickups.forEach(pickup => pickup.update());

    // cleanup
    this.npcs = this.npcs.filter(n => !n.isDestroyed);
    this.pickups = this.pickups.filter(p => !p.isDestroyed);
  }
}