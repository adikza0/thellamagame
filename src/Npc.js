import { AnimatedSprite, Container, Spritesheet } from "pixi.js";
import batAnimationData from '/src/public/spritesheet/bat.json' assert { type: 'json' };

class Npc {
  constructor(health,) {
    this.health = health;
    
  }

  async init(texture_path, animation_data, animation_name) {
    this.spriteContainer = new Container();

    this.texture = await Assets.load(texture_path);
    this.spritesheet = new Spritesheet(this.texture, animation_data);
    await this.spritesheet.parse();

    const frames = this.spritesheet.animations[animation_name]
    this.animatedSprite = new AnimatedSprite(frames);
    this.animatedSprite.anchor.set(0.5);
    this.spriteContainer.addChild(this.animatedSprite);
  }

  takeDamage(damage) {
    this.health -= damage;
  }
}



export class Bat extends Npc {
  constructor(health) {
    super(health);

  }

  async init() {
    await super.init('public/spritesheet/bat.png', batAnimationData, 'fly')
  }
}