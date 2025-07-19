import { AnimatedSprite, Container, Spritesheet, Assets } from "pixi.js";
import batAnimationData from '/src/public/spritesheet/bat.json' assert { type: 'json' };
import gameConfig from '/src/gameConfig.json' assert { type: 'json' };

class Npc {
  constructor(layer, health, x, y) {
    this.layer = layer;
    this.health = health;
    this.x = x;
    this.y = y;
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
    this.layer.addChild(this.spriteContainer);
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
    this.spriteContainer.width = 40;
    this.spriteContainer.height = 40;
    this.animatedSprite.width = 40;
    this.animatedSprite.height = 40;
    
    this.animatedSprite.animationSpeed = 0.1;
    this.animatedSprite.play();
  }

  takeDamage(damage) {
    this.health -= damage;
    if( this.health <= 0) {
      this.destroy();
    }
  }

  getBounds() {
  if (!this.spriteContainer || !this.animatedSprite) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return {
    x: this.spriteContainer.x - this.animatedSprite.width / 2,
    y: this.spriteContainer.y - this.animatedSprite.height / 2,
    width: this.animatedSprite.width,
    height: this.animatedSprite.height
  };
}

  destroy() {
    this.layer.removeChild(this.spriteContainer);
    this.animatedSprite.destroy();
    this.animatedSprite = null;
    this.spriteContainer.destroy();
    this.spriteContainer = null;
  }

  update(){
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }
}



export class Bat extends Npc {
  constructor(layer, x = 0, y = 0) {
    super(layer, gameConfig.bat.health, x, y);
    
  }

  action(){
    this.move();
  }


  move(){

  }

  
  async init() {
    await super.init('/src/public/spritesheet/bat.png', batAnimationData, 'fly')
  }
}