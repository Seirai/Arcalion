/**
*  @author       Seilai Zhao <seilaizh@gmail.com>
*  testScene.js
*  Currently the main scene in which development of core game mechanics and gameplay will happen.
*
*/

//Importing controls from main for use in this scene.
import {controls as oldControls} from '../main';

import {Mob} from '../objects/Mob';

export class testScene extends Phaser.Scene {

  //Loading assets.
  preload() {
    this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px.png");
    this.load.tilemapTiledJSON("map", "../assets/maps/sample_map.json");
    this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
  }

  //Rendering assets.
  create() {
    map = this.make.tilemap({ key: "map" });

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

    player = this.add.existing(new Mob(this, spawnPoint.x, spawnPoint.y, "atlas", "misa-front", map.tileWidth, 5));
    player = this.physics.add.existing(player);

//    player = this.physics.add.existing(new Mob(this, spawnPoint.x, spawnPoint.y, "atlas", "misa-front",
//     map.tileWidth, 6));
    player.setSize(32, 40);
    player.key = "player";
    this.physics.add.collider(player, worldLayer);
    console.log(player);

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

    console.log(this.sys.updateList);
    this.sys.updateList.add(player);
  }

  //Checking for input and changes.
  update(time, delta) {
    if(player.moveIntention == false)
    {
      if(cursors.left.isDown) player.move("left");
      else if(cursors.right.isDown) player.move("right");
      else if(cursors.up.isDown) player.move("up");
      else if(cursors.down.isDown) player.move("down");
      //player.moveIntention = true;
    }
    if(player.isMoving() && !cursors.isDown)
      player.update();
  }
};

//Defining global variables in module to be hoisted.
let destination = new Phaser.Math.Vector2;
let controls = oldControls;
let player;
let cursors;
let map;
const speed = 175;
