export class Controller {
  constructor(document, player) {
    this.document = document;
    this.player = player;
    this.pressed_keys = [];
    this.movement_keys = ["W", "A", "S", "D"];
  }
  addEventListeners() {
    this.document.addEventListener('keydown', (event) => {
      const key = event.key.toUpperCase();
      if (this.movement_keys.includes(key) && !this.pressed_keys.includes(key)) {
        this.pressed_keys.push(key);
        this.player.change_animation(this.calculate_animation_direction());
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

  calculate_animation_direction(){
    const movement = this.calculate_movement();
    if (movement.x === 0 && movement.y ===0){
      return 'go_down';
    }else if(movement.x < 0){
      return 'go_left';
    }else if(movement.x > 0){
      return 'go_right';
    }else if(movement.y > 0){
      return 'go_down';
    }else{
      return 'go_up';
    }
  }
}