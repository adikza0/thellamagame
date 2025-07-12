import { Projectile } from "./Projectile";

export class Controller {
  constructor(document, player, projectiles, projectileLayer) {
    this.projectileLayer = projectileLayer;
    this.projectiles = projectiles;
    this.document = document;
    this.player = player;
    this.pressed_keys = [];
    this.movement_keys = ["W", "A", "S", "D"];
    this.shoot_keys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]
    this.last_player_movement = "";
  }
  addEventListeners() {
    this.document.addEventListener('keydown', (event) => {
      const key = event.key.toUpperCase();
      if (this.movement_keys.includes(key) && !this.pressed_keys.includes(key)) {
        this.pressed_keys.push(key);
        this.player.change_animation(this.calculate_animation_direction());
      }
      else if (this.shoot_keys.includes(event.key)) {
        let projectile; // declare once
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
      if (this.movement_keys.includes(key)) {
        this.pressed_keys = this.pressed_keys.filter(item => item !== key);
        this.player.change_animation(this.calculate_animation_direction());
      }
    });

  }

  calculate_movement() {
    let x = 0;
    let y = 0;
    const speed = this.player.speed;

    this.pressed_keys.forEach(key => {
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
    })
    return { x, y };
  }

  calculate_animation_direction() {
    const movement = this.calculate_movement();
    if (movement.x === 0 && movement.y === 0) {
      switch (this.last_player_movement) {
        case "llama_walk_left":
          return "llama_eat_left"
        case "llama_walk_right":
          return "llama_eat_right"
        case "llama_walk_up":
          return "llama_eat_up"
        case "llama_eat_down":
          return "llama_eat_down";
      }

      return 'llama_eat_down';
    } else if (movement.x < 0) {
      this.last_player_movement = 'llama_walk_left';
      return 'llama_walk_left';
    } else if (movement.x > 0) {
      this.last_player_movement = 'llama_walk_right';
      return 'llama_walk_right';
    } else if (movement.y > 0) {
      this.last_player_movement = 'llama_walk_down';
      return 'llama_walk_down';
    } else {
      this.last_player_movement = 'llama_walk_up';
      return 'llama_walk_up';
    }
  }
}