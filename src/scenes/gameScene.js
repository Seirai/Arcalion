/**
*  @author       Seirai <seilaizh@gmail.com>
*  gameScene.js
*  Currently the main scene in which development of core game mechanics and gameplay will happen.
*
*/

import {Player} from '../objects/Player';
import {Mob} from '../objects/Mob';
import {Button, Menu} from "../systems/ui";
import io from 'socket.io-client';

export class gameScene extends Phaser.Scene {

  constructor()
  {
    super({ key : "gameScene" });
  }

  init()
  {
    this.game.renderer.resize(384, 384, 1.0);
  }

  //Loading assets.
  preload() {
    this.load.image('tile1', '../assets/tilesets/grassdirtstonemin.png');
    this.load.image('tile2', '../assets/tilesets/grassmountainmin.png');
    this.load.tilemapTiledJSON("map", "../assets/maps/testmap1.json");
    this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
  }

  //Rendering assets.
  create() {
    this.socket = io.connect('http://localhost:8081');
//    this.socket = io.connect('https://arcalion-server.herokuapp.com');

    this.sound.play("prologueTheme");

    map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    let tileset = [map.addTilesetImage('grassdirtstone1', 'tile1')];
    tileset.push(map.addTilesetImage('grassmountain1', 'tile2'));

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const tileLayer1 = map.createStaticLayer(0, tileset, 0, 0);
    const tileLayer2 = map.createStaticLayer(1, tileset, 0, 0);
    const tileLayer3 = map.createStaticLayer(2, tileset, 0, 0);


    cursors = this.input.keyboard.createCursorKeys();

    let players = [];
    this.socket.on('onLogin', splayers => //server player array
      {
        splayers.forEach(elem =>
          {
            if(elem.id != this.socket.id)
            {
              let newPlayer = this.add.existing(new Mob(this, elem.x, elem.y, 'atlas', 'misa-front', map.tileWidth, 2, elem.id));
              this.physics.add.existing(newPlayer);
              newPlayer.body.setSize(32, 40);
              newPlayer.body.setOffset(0, 24);
              this.sys.updateList.add(newPlayer);
              players.push(newPlayer);
            }
            else
            { 
              player = this.add.existing(new Player(this, elem.x, elem.y, 'atlas', 'misa-front', map.tileWidth, 2, elem.id));
              this.physics.add.existing(player);
              player.body.setSize(32, 40);
              player.body.setOffset(0, 24);
              players.push(player);
              this.sys.updateList.add(player);
              camera.startFollow(player);
              player.cursors = cursors;
              player.map = map;
              player.key = 'player';
            }
        });
      });

    this.socket.on('playerDisconnect', removeIndex =>
      {
        players[removeIndex].destroy();
        players.splice(removeIndex, 1);
      });

    this.socket.on('playerLogin', elem =>
      { 
        let newPlayer = this.add.existing(new Mob(this, elem.x, elem.y, 'atlas', 'misa-front', map.tileWidth, 2, elem.id));
        this.physics.add.existing(newPlayer);
        newPlayer.body.setSize(32, 40);
        newPlayer.body.setOffset(0, 24);
        this.sys.updateList.add(newPlayer);
        players.push(newPlayer);
      });

    //Block of anims created for mob/players
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
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  }

  //Checking for input and changes.
  update(time, delta) {
    if(player!=null)player.update(); //Catches player controls

  }


};

//Defining global variables in module to be hoisted.
let destination = new Phaser.Math.Vector2;
let player;
let mob;
let cursors;
let map;
const speed = 175;
