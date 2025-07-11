import { Application } from "pixi.js";
import { Player } from "./Player";
import { Controller } from "./Controller.js";
import { Wall } from "./Wall.js";
import gameConfig from './gameConfig.json' assert { type: "json" };


(async () => {
  const app = new Application();
  await app.init({
    width: gameConfig.game.width,
    height: gameConfig.game.height + gameConfig.game.UIHeight,
    backgroundColor: gameConfig.game.backgroundColor,
    backgroundAlpha: 0.8
  });
  const walls = [new Wall(app, 0, 50, 0 + gameConfig.game.UIHeight, app.canvas.height), new Wall(app, 0, app.canvas.width, gameConfig.game.UIHeight, gameConfig.game.UIHeight + 50), new Wall(app, app.canvas.width - 50, app.canvas.width, gameConfig.game.UIHeight, app.canvas.height), new Wall(app, 0, app.canvas.width, app.canvas.height - 50, app.canvas.height)]
  walls.forEach((wall) => {
    wall.render();
  })

  const player = new Player(app, walls);
  await player.init();  // <-- MUST await init() to load sprite before spawn
  player.render(gameConfig.game.width / 2, gameConfig.game.height / 2 + gameConfig.game.UIHeight);

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

