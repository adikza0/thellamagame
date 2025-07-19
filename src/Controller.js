import { Projectile } from "./Projectile";

export class Controller {
  constructor(document, player, projectiles, projectileLayer) {
    this.projectileLayer = projectileLayer;
    this.projectiles = projectiles;
    this.document = document;
    this.player = player;
    this.pressedKeys = [];
    this.movementKeys = ["W", "A", "S", "D"];
    this.shootKeys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    this.lastPlayerMovement = "";
  }

  addEventListeners() {
    this.document.addEventListener('keydown', (event) => {
      const key = event.key.toUpperCase();
      if (this.movementKeys.includes(key) && !this.pressedKeys.includes(key)) {
        this.pressedKeys.push(key);
        this.player.changeAnimation(this.calculateAnimationDirection());
      } else if (this.shootKeys.includes(event.key)) {
        let projectile;
        switch (event.key) {
          case "ArrowUp":
            projectile = new Projectile(this.projectileLayer, this.player, "up");
            break;
          case "ArrowDown":
            projectile = new Projectile(this.projectileLayer, this.player, "down");
            break;
          case "ArrowLeft":
            projectile = new Projectile(this.projectileLayer, this.player, "left");
            break;
          case "ArrowRight":
            projectile = new Projectile(this.projectileLayer, this.player, "right");
            break;
        }
        if (projectile) {
          this.projectiles.push(projectile);
          projectile.render();
        }
      }
    });

    this.document.addEventListener('keyup', (event) => {
      const key = event.key.toUpperCase();
      if (this.movementKeys.includes(key)) {
        this.pressedKeys = this.pressedKeys.filter(item => item !== key);
        this.player.changeAnimation(this.calculateAnimationDirection());
      }
    });
  }

  calculateMovement() {
    let x = 0;
    let y = 0;
    const speed = this.player.speed;

    this.pressedKeys.forEach(key => {
      switch (key) {
        case "A":
          x -= speed;
          break;
        case "W":
          y -= speed;
          break;
        case "S":
          y += speed;
          break;
        case "D":
          x += speed;
      }
    });

    return { x, y };
  }

  calculateAnimationDirection() {
    const movement = this.calculateMovement();
    if (movement.x === 0 && movement.y === 0) {
      switch (this.lastPlayerMovement) {
        case "llama_walk_left":
          return "llama_eat_left";
        case "llama_walk_right":
          return "llama_eat_right";
        case "llama_walk_up":
          return "llama_eat_up";
        case "llama_walk_down":
          return "llama_eat_down";
      }
      return "llama_eat_down";
    } else if (movement.x < 0) {
      this.lastPlayerMovement = "llama_walk_left";
      return "llama_walk_left";
    } else if (movement.x > 0) {
      this.lastPlayerMovement = "llama_walk_right";
      return "llama_walk_right";
    } else if (movement.y > 0) {
      this.lastPlayerMovement = "llama_walk_down";
      return "llama_walk_down";
    } else {
      this.lastPlayerMovement = "llama_walk_up";
      return "llama_walk_up";
    }
  }

  update() {
    const movement = this.calculateMovement();
    this.player.move(movement.x, movement.y);

    const newAnimation = this.calculateAnimationDirection();
    if (this.player.currentAnimation !== newAnimation) {
      this.player.changeAnimation(newAnimation);
      this.player.currentAnimation = newAnimation;
    }
  }
}
