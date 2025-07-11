import { Sprite, Assets, Spritesheet, AnimatedSprite } from 'pixi.js';

const atlasData = {
  frames: {
    go_up1: {
      frame: { x: 0, y: 0, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_up2: {
      frame: { x: 128, y: 0, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_up3: {
      frame: { x: 256, y: 0, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_up4: {
      frame: { x: 384, y: 0, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_left1: {
      frame: { x: 0, y: 128, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_left2: {
      frame: { x: 128, y: 128, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_left3: {
      frame: { x: 256, y: 128, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_left4: {
      frame: { x: 384, y: 128, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_down1: {
      frame: { x: 0, y: 256, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_down2: {
      frame: { x: 128, y: 256, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_down3: {
      frame: { x: 256, y: 256, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_down4: {
      frame: { x: 384, y: 256, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_right1: {
      frame: { x: 0, y: 384, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_right2: {
      frame: { x: 128, y: 384, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_right3: {
      frame: { x: 256, y: 384, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    },
    go_right4: {
      frame: { x: 384, y: 384, w: 128, h: 128 },
      sourceSize: { w: 128, h: 128 },
      spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
    }
  },
  meta: {
    image: '/src/public/img/llama_walk.png',
    size: { w: 512, h: 512 }
  },
  animations: {
    go_up: ['go_up1', 'go_up2', 'go_up3', 'go_up4'],
    go_left: ['go_left1', 'go_left2', 'go_left3', 'go_left4'],
    go_down: ['go_down1', 'go_down2', 'go_down3', 'go_down4'],
    go_right: ['go_right1', 'go_right2', 'go_right3', 'go_right4']
  }
}


export class Player {

  constructor(app) {
    this.app = app;
    this.x = 0;
    this.y = 0;
    this.speed = 5;
  }

  async init() {
    const texture = await Assets.load(atlasData.meta.image);
    this.spritesheet = new Spritesheet(texture, atlasData);
    await this.spritesheet.parse();
    this.animatedSprite = new AnimatedSprite(this.spritesheet.animations.go_down)
    this.animatedSprite.play();
    this.animatedSprite.animationSpeed = 0.13
  }



  render(x, y) {
    this.animatedSprite.width = 150;
    this.animatedSprite.height = 150;

    this.x = x - this.animatedSprite.width / 2;
    this.y = y - this.animatedSprite.height / 2;

    this.sync_position();


    this.app.stage.addChild(this.animatedSprite);
  }

  change_animation(go_direction) {
  if (!this.spritesheet.animations[go_direction]) {
    console.warn(`Unknown direction: ${go_direction}`);
    return;
  }

  // Remove old sprite from stage
  this.app.stage.removeChild(this.animatedSprite);

  // Create new animated sprite
  this.animatedSprite = new AnimatedSprite(this.spritesheet.animations[go_direction]);
  this.animatedSprite.animationSpeed = 0.13;
  this.animatedSprite.width = 150;
  this.animatedSprite.height = 150;
  this.animatedSprite.play();

  // Keep it at the same position
  this.sync_position();

  // Add the new sprite to the stage
  this.app.stage.addChild(this.animatedSprite);
}
  
  move(x_offset, y_offset) {
    this.x += x_offset;
    this.y += y_offset;
    this.sync_position();
  }

  sync_position() {
    this.animatedSprite.x = this.x;
    this.animatedSprite.y = this.y;
  }
}