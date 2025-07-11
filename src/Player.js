import { Sprite, Assets, Spritesheet, AnimatedSprite } from 'pixi.js';
import gameConfig from './gameConfig.json' assert { type: "json" };
import llamaWalkData from '/src/public/spritesheet/llama_walk.json' assert { type: 'json' };

/*const atlasData = {
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
*/



export class Player {

  constructor(app, walls) {
    this.app = app;
    this.x = 0;
    this.y = 0;
    this.speed = 5;
    this.walls = walls;
  }

  async init() {
    const texture = await Assets.load('/src/public/spritesheet/llama_walk.png');
    this.spritesheet = new Spritesheet(texture, llamaWalkData);
    await this.spritesheet.parse();
    this.animatedSprite = new AnimatedSprite(this.spritesheet.animations.go_down)
    this.animatedSprite.play();
    this.animatedSprite.animationSpeed = 0.13
  }



  render(x, y) {
    this.animatedSprite.width = gameConfig.player.width;
    this.animatedSprite.height = gameConfig.player.height;

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

  // Save current dimensions
  const { width, height } = this.animatedSprite;

  // Remove old sprite
  this.app.stage.removeChild(this.animatedSprite);

  // Create new sprite with the correct animation
  this.animatedSprite = new AnimatedSprite(this.spritesheet.animations[go_direction]);
  
  this.animatedSprite.animationSpeed = 0.13;

  // Reapply previous size
  this.animatedSprite.width = width;
  this.animatedSprite.height = height;

  this.animatedSprite.play();

  // Restore position
  this.sync_position();

  this.app.stage.addChild(this.animatedSprite);
}
  
  move(x_offset, y_offset) {
  // Try moving on X axis
  if (!this.checkCollision(x_offset, 0)) {
    this.x += x_offset;
  }

  // Try moving on Y axis
  if (!this.checkCollision(0, y_offset)) {
    this.y += y_offset;
  }

  this.sync_position();
}

  sync_position() {
    this.animatedSprite.x = this.x;
    this.animatedSprite.y = this.y;
  }

  getBounds(x_offset = 0, y_offset = 0) {
    return {
      x: this.x + x_offset,
      y: this.y + y_offset,
      width: this.animatedSprite.width,
      height: this.animatedSprite.height
    };
  }

  checkCollision(x_offset, y_offset) {
    const playerBounds = this.getBounds(x_offset, y_offset);
    for (const wall of this.walls) {
      const wallBounds = wall.getBounds();
      if (
        playerBounds.x < wallBounds.x + wallBounds.width &&
        playerBounds.x + playerBounds.width > wallBounds.x &&
        playerBounds.y < wallBounds.y + wallBounds.height &&
        playerBounds.y + playerBounds.height > wallBounds.y
      ) {
        return true; // Collision
      }
    }
    return false;
  }
}