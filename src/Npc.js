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
    this.sync_position();
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
    this.speed = gameConfig.bat.speed;
    this.current_animation = 'right';
  }
  async init() {
    await super.init('/src/public/spritesheet/bat.png', batAnimationData, 'fly')
  }

  action(player_position){
    this.move(player_position);
    this.sync_position();
  }


  move(player_position){
    const velocity = this.calculate_velocity(player_position);
    this.x += velocity.x;
    this.y += velocity.y;
  }

  calculate_velocity(player_position){
    const distance_x = player_position.x - this.spriteContainer.x;
    const distance_y = player_position.y - this.spriteContainer.y;
    const distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
    const velocity_x = this.speed * (distance_x / distance);
    const velocity_y = this.speed * (distance_y / distance);
    if(velocity_x < 0 && this.current_animation === 'right'){
      this.switch_animation_side()
    }else if(velocity_x >= 0 && this.current_animation === 'left'){
      this.switch_animation_side()
    }
    return { x: velocity_x, y: velocity_y };
  }

  switch_animation_side() {
    if(this.current_animation === 'left'){
      this.current_animation = 'right';
      this.animatedSprite.scale.x = 1;
    }else if(this.current_animation === 'right'){
      this.current_animation = 'left';
      this.animatedSprite.scale.x = -1;
    }
  }
  sync_position(){
    this.spriteContainer.x = this.x;
    this.spriteContainer.y = this.y;
  }

  
  
}


//todo: explode on contact with player + deal dmg to player, spawner