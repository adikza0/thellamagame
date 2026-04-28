import { Npc } from "./Npc";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import trumpAnimationData from '/src/public/spritesheet/trump.json' assert { type: 'json' };
import { Laser } from "./Laser";
import { Graphics, Container, Spritesheet } from "pixi.js";

export class
  Trump extends Npc {
  constructor(player, layer, x = 0, y = 0) {
    const randomPosition = Trump.generateRandomPosition();
    super(player, layer, gameConfig.trump.health, randomPosition.x, randomPosition.y);
    this.fireRate = gameConfig.trump.fireRate;


  }

  async init() {
    await super.init('/src/public/spritesheet/trump.png', trumpAnimationData, 'looking');

    this.animatedSprite.stop();
    this.animatedSprite.loop = false;

    this.animatedSprite.width = 70;
    this.animatedSprite.height = 90;

    this.animatedSprite.anchor.set(0.6);
    this.spriteContainer.pivot.set(0, 0);
    this.animatedSprite.gotoAndStop(0);

    this.phase = "idling";
    this.tick = 0;

    this.laser = null;
    this.laserToX = 0;
    this.laserToY = 0;


    this.animatedSprite.gotoAndStop(0);
  }
  static generateRandomPosition() {
    const width = gameConfig.game.width;
    const height = gameConfig.game.height;
    const uiHeight = gameConfig.game.UIHeight;
    const totalHeight = height + uiHeight;
    const spawnBuffer = 50;

    const minX = spawnBuffer;
    const maxX = width - spawnBuffer;
    const minY = uiHeight + spawnBuffer;
    const maxY = height - spawnBuffer;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    return { x, y };
  }


  destroy() {
    super.destroy();
    if (this.laser) {
      this.laser.destroy();
    }
  }
  
  action() {
    if (this.isDestroyed || !this.spriteContainer) return;
    this.tick++;

    this.managePhases();

    if (this.calculateDistanceFromPlayer() < gameConfig.trump.destroyRange) {
      if (this.laser) {
        this.laser.destroy();
      }
      this.destroy();

    }
  }


  rotateTowardsPlayer() {
    const dx = this.player.x - this.spriteContainer.x;
    const dy = this.player.y - this.spriteContainer.y;

    const angle = Math.atan2(dy, dx);

    // rotate container
    this.spriteContainer.rotation = angle;

    // flip sprite depending on direction
    if (Math.cos(angle) < 0) {
      this.animatedSprite.scale.y = -1;
    } else {
      this.animatedSprite.scale.y = 1;
    }
  }

  managePhases() {
    if (this.phase === "idling") {
      this.rotateTowardsPlayer();
      if (this.tick >= gameConfig.trump.idleDuration) {
        this.phase = "aiming";
        this.tick = 0;
        this.animatedSprite.gotoAndStop(1);
      }

    } else if (this.phase === "aiming") {
      this.rotateTowardsPlayer();
      if (this.tick >= gameConfig.trump.aimDuration) {
        this.phase = "preparing";
        this.tick = 0;
        this.animatedSprite.gotoAndStop(2);
        this.laserToX = this.player.x;
        this.laserToY = this.player.y;
      }

    } else if (this.phase === "preparing") {

      if (this.tick >= gameConfig.trump.preparingDuration) {
        this.phase = "firing";
        this.tick = 0;

        this.animatedSprite.textures = this.spritesheet.animations.firing;
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = 0.2;
        this.animatedSprite.play();

        this.laser = new Laser(this.layer, this.spriteContainer.x, this.spriteContainer.y, this.laserToX, this.laserToY);
        this.laser.init();
        this.laser.render();

      }

    } else if (this.phase === "firing") {
      if (this.laser.checkPlayerHit(this.player)) {
        this.player.takeDamage();
      }
      if (this.tick >= gameConfig.trump.firingDuration) {
        this.animatedSprite.stop();

        this.animatedSprite.textures = this.spritesheet.animations.looking;
        this.animatedSprite.gotoAndStop(0);

        this.phase = "idling";
        this.tick = 0;
        this.laser.destroy();
      }
    }
  }
}