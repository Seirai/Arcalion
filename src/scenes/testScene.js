////////////////////////////////////////////////////////////////////////////////////////////////////
//    testScene.js
//  This is where I'll be building most of the game's core systems before organizing them into numerous scenes.
//
//////

//Importing controls from main for use in this scene.
import {controls as oldControls} from '../main';
export class testScene extends Phaser.Scene {

  //Loading assets.
  preload() {
    this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px.png");
    this.load.tilemapTiledJSON("map", "../assets/maps/sample_map.json");
    this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
  }

  //Rendering assets.
  create() {
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("Turf", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("AboveTurf", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("AbovePlayer", tileset, 0, 0);

    aboveLayer.setDepth(10);

    //Adding spawnpoint
    const spawnPoint = map.findObject("Object", obj => obj.name === "spawnPoint");


    //Setting collision property to everything in the layer AboveTurf
    worldLayer.setCollisionByProperty({ collides: true });

    //Debug collision
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });

    cursors = this.input.keyboard.createCursorKeys();

    /* Omitting Camera Controls
    const camera = this.cameras.main;
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.5



  });

  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels); */

  //Player Definition:
  player = this.physics.add
  .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
  .setSize(30, 40)
  .setOffset(0, 24);
  this.physics.add.collider(player, worldLayer);

  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  this.add
  .text(16, 16, "Arrow keys to move", {
    font: "18px monospace",
    fill: "#ffffff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#000000"
  })
  .setScrollFactor(0)
  .setDepth(30);
}

//Checking for input and changes.
update(time, delta) {
  const prevVelocity = player.body.velocity.clone();
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(100);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(100);
  }
  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  //    controls.update(delta);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}

};

//Defining global variables in module to be hoisted.
let controls = oldControls;
let player;
let cursors;
const speed = 175;
