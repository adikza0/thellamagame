import { Application } from "pixi.js";
import { Player } from "./Player";
import { Controller } from "./Controller.js";

(async () => {
  const app = new Application();
  await app.init({
    width: 800,
    height: 800,
    backgroundColor: 0x177cba,
    backgroundAlpha: 0.8
  });

  const player = new Player(app);
  await player.init();  // <-- MUST await init() to load sprite before spawn
  player.render(400, 400);

  document.body.appendChild(app.canvas);
  const controller = new Controller(document, player);
  controller.addEventListeners();
  app.ticker.add(() => {
    if (controller.pressed_keys.length >= 1) {
      let offsets = controller.calculate_movement();
      
      if (offsets.x !== 0 && offsets.y !== 0) {   // reduces movement on both directions to half when going diagonally
        player.move(offsets.x / 2, offsets.y / 2);
      } else {
        player.move(offsets.x, offsets.y);
      }
    }
  })
})();

