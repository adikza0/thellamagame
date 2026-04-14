import { Npc } from "./Npc";
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };
import trumpAnimationData from '/src/public/spritesheet/trump.json' assert { type: 'json' };
import { Graphics, Container, Spritesheet } from "pixi.js";

export class
  Trump extends Npc {
  constructor(player, layer, x = 0, y = 0) {
    const randomPosition = Trump.generateRandomPosition();
    super(player, layer, gameConfig.trump.health, randomPosition.x, randomPosition.y);
    this.fireRate = gameConfig.trump.fireRate;
    this.currentAnimation = 'right';


  }

  async init() {
    await super.init('/src/public/spritesheet/trump.png', trumpAnimationData, 'looking');

    this.animatedSprite.stop();
    this.animatedSprite.loop = false;

    this.animatedSprite.width = 70;
    this.animatedSprite.height = 90;

    this.animatedSprite.gotoAndStop(0);

    this.phase = "idling";
    this.tick = 0;

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



  action() {

    this.tick++;

    this.manageAnimations();

    if (this.calculateDistanceFromPlayer() < gameConfig.trump.destroyRange) {
      this.destroy();
    }
  }
  manageSwitchingSides() {
    if (this.currentAnimation === 'right' && this.player.x < this.spriteContainer.x) {
      this.switchAnimationSide();
      this.currentAnimation = 'left';

    } else if (this.currentAnimation === 'left' && this.player.x > this.spriteContainer.x) {
      this.switchAnimationSide();
      this.currentAnimation = 'right';

    }
    console.log(this.spriteContainer.x)
  }
  manageAnimations() {

    if (this.phase === "idling") {
      this.manageSwitchingSides();

      if (this.tick >= gameConfig.trump.idleDuration) {
        this.phase = "aiming";
        this.tick = 0;
        this.animatedSprite.gotoAndStop(1);
      }

    } else if (this.phase === "aiming") {

      this.manageSwitchingSides();
      if (this.tick >= gameConfig.trump.aimDuration) {
        this.phase = "preparing";
        this.tick = 0;
        this.animatedSprite.gotoAndStop(2);

      }

    } else if (this.phase === "preparing") {

      if (this.tick >= gameConfig.trump.preparingDuration) {
        this.phase = "firing";
        this.tick = 0;

        this.animatedSprite.textures = this.spritesheet.animations.firing;
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = 0.2;
        this.animatedSprite.play();
      }

    } else if (this.phase === "firing") {

      if (this.tick >= gameConfig.trump.firingDuration) {
        this.animatedSprite.stop();

        this.animatedSprite.textures = this.spritesheet.animations.looking;
        this.animatedSprite.gotoAndStop(0);

        this.phase = "idling";
        this.tick = 0;
      }
    }
  }
}