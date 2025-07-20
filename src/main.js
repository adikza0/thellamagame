import { Application, Container, Graphics } from "pixi.js";
import { Player } from "./Player";
import { Controller } from "./Controller.js";
import { Wall } from "./Wall.js";
import gameConfig from './gameConfig.json' assert { type: "json" };
import { Projectile } from "./Projectile.js";
import { Spawner } from "./Spawner.js";

(async () => {
  const app = new Application();
  await app.init({
    width: gameConfig.game.width,
    height: gameConfig.game.height + gameConfig.game.UIHeight,
    backgroundColor: gameConfig.game.backgroundColor,
    backgroundAlpha: 0.8
  });

  // Create walls
  const walls = [
    new Wall(app, 0, 50, gameConfig.game.UIHeight, app.canvas.height),
    new Wall(app, 0, app.canvas.width, gameConfig.game.UIHeight, gameConfig.game.UIHeight + 50),
    new Wall(app, app.canvas.width - 50, app.canvas.width, gameConfig.game.UIHeight, app.canvas.height),
    new Wall(app, 0, app.canvas.width, app.canvas.height - 50, app.canvas.height),
    new Wall(app, 250, 300, 500, 600)
  ];
  walls.forEach(wall => wall.render());

  // Create layers
  const uiLayer = new Container();
  const projectileLayer = new Container();
  const playerLayer = new Container();
  const uiBackground = new Graphics().rect(0, 0, app.canvas.width, gameConfig.game.UIHeight).fill(gameConfig.game.UIBackgroundColor);
  uiLayer.addChild(uiBackground)
  uiLayer.width = app.canvas.width;
  uiLayer.height = gameConfig.game.UIHeight;
  // Player
  const player = new Player(playerLayer, walls);
  await player.init();
  player.render(gameConfig.game.width / 2, gameConfig.game.height / 2 + gameConfig.game.UIHeight);


  //add NPCs
  const spawner = new Spawner(player, playerLayer);

  // Add canvas to DOM
  document.body.appendChild(app.canvas);

  // Game entities
  const projectiles = [];
  const npcs = [];

  // Controller
  const controller = new Controller(document, player, projectiles, projectileLayer);
  controller.addEventListeners();

  // Main game container
  const gameContainer = new Container();
  gameContainer.addChild(projectileLayer); // behind
  gameContainer.addChild(playerLayer);     // in front
  app.stage.addChild(gameContainer);
  app.stage.addChild(uiLayer); // UI layer

  /*
  // Spawn NPCs
  const bat1 = new Bat(player, playerLayer, 0, 300);
  await bat1.init();
  const bat2 = new Bat(player, playerLayer, 500, 300);
  await bat2.init();
  npcs.push(bat1,bat2);
*/

  // Add player sprite to layer
  playerLayer.addChild(player.spriteContainer);

  // Game loop
  app.ticker.add(() => {
    // Cleanup dead projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (!projectiles[i].sprite) {
        projectiles.splice(i, 1);
      }
    }
    
    const npcs = spawner.npcs;
    
    spawner.action();

    // Update NPCs, but skip destroyed ones
    for (let i = npcs.length - 1; i >= 0; i--) {
      if (npcs[i].isDestroyed) {
        npcs.splice(i, 1);
      } else {
        npcs[i].action(player.getPosition());
      }
    }

    // Update projectiles
    projectiles.forEach(projectile => {
      projectile.update(walls, npcs);
    });

    // Update player
    controller.update();
  });

})();
