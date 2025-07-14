import { Application } from "pixi.js";
import { Player } from "./Player";
import { Controller } from "./Controller.js";
import { Wall } from "./Wall.js";
import gameConfig from './gameConfig.json' assert { type: "json" };
import { Projectile } from "./Projectile.js";
import { Container } from "pixi.js";


(async () => {
  const app = new Application();
  await app.init({
    width: gameConfig.game.width,
    height: gameConfig.game.height + gameConfig.game.UIHeight,
    backgroundColor: gameConfig.game.backgroundColor,
    backgroundAlpha: 0.8
  });
  const walls = [new Wall(app, 0, 50, 0 + gameConfig.game.UIHeight, app.canvas.height), new Wall(app, 0, app.canvas.width, gameConfig.game.UIHeight, gameConfig.game.UIHeight + 50), new Wall(app, app.canvas.width - 50, app.canvas.width, gameConfig.game.UIHeight, app.canvas.height), new Wall(app, 0, app.canvas.width, app.canvas.height - 50, app.canvas.height), new Wall(app, 250, 300, 500,600)]
  walls.forEach((wall) => {
    wall.render();
  })

  const projectile_layer = new Container();
  const player_layer = new Container();

  const player = new Player(player_layer, walls);
  await player.init();  // <-- MUST await init() to load sprite before spawn
  document.body.appendChild(app.canvas);
  player.render(gameConfig.game.width / 2, gameConfig.game.height / 2 + gameConfig.game.UIHeight);
  let projectiles = [];

  const controller = new Controller(document, player, projectiles, projectile_layer);
  controller.addEventListeners();


  const gameContainer = new Container();



  gameContainer.addChild(projectile_layer); // behind
  gameContainer.addChild(player_layer);     // in front

  app.stage.addChild(gameContainer);

  player_layer.addChild(player.spriteContainer);
  app.ticker.add(() => {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i].sprite == null) {
        projectiles.splice(i, 1);
      }
    }
    projectiles.forEach((projectile) => {
      projectile.update(walls);
    })

    controller.update()
  })


})();

