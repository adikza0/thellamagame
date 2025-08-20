import { Application, Container, Graphics } from "pixi.js";
import { Player } from "./Player";
import { Controller } from "./Controller.js";
import { WallManager } from "./WallManager.js";
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
  const wallManager = new WallManager(app);
  wallManager.create(0, 50, gameConfig.game.UIHeight, app.canvas.height)
  wallManager.create(0, app.canvas.width, gameConfig.game.UIHeight, gameConfig.game.UIHeight + 50)
  wallManager.create(app.canvas.width - 50, app.canvas.width, gameConfig.game.UIHeight, app.canvas.height)
  wallManager.create(0, app.canvas.width, app.canvas.height - 50, app.canvas.height)
  wallManager.create(250, 300, 500, 600)
  wallManager.render();

  const walls = wallManager.walls

  // Create layers
  const uiLayer = new Container();
  const projectileLayer = new Container();
  const playerLayer = new Container();
  const uiBackground = new Graphics().rect(0, 0, app.canvas.width, gameConfig.game.UIHeight).fill(gameConfig.game.UIBackgroundColor);
  uiLayer.addChild(uiBackground)
  
  /*
  uiLayer.width = app.canvas.width;
  uiLayer.height = gameConfig.game.UIHeight;
  */
 
  // Player
  const player = new Player(playerLayer, wallManager);
  await player.init();
  player.render(gameConfig.game.width / 2, gameConfig.game.height / 2 + gameConfig.game.UIHeight);


  //add NPCs
  const spawner = new Spawner(player, playerLayer);

  // Add canvas to DOM
  document.body.appendChild(app.canvas);

  // Game entities
  const projectiles = [];

  // Controller
  const controller = new Controller(document, player, projectiles, projectileLayer);
  controller.addEventListeners();

  // Main game container
  const gameContainer = new Container();
  gameContainer.addChild(projectileLayer); // behind
  gameContainer.addChild(playerLayer);     // in front
  app.stage.addChild(gameContainer);
  app.stage.addChild(uiLayer); // UI layer


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
      projectile.update(wallManager, npcs);
    });

    // Update player
    controller.update();
  });

})();
