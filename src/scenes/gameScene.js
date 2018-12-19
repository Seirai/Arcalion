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
    this.player;
    this.cursors;
    this.map;
    this.players = {};
  }

  //Loading assets.
  preload() {
    this.load.image('tile1', '../assets/tilesets/grassdirtstonemin.png');
    this.load.image('tile2', '../assets/tilesets/grassmountainmin.png');
    this.load.tilemapTiledJSON("map", "../assets/maps/testmap1.json");
    this.load.atlas("atlas", "../assets/atlas/dgraymanjr/dgraymanjr.png", "../assets/atlas/dgraymanjr.json");
  }

  //Rendering assets.
  create() {
    this.socket = io.connect('http://localhost:8081');
//    this.socket = io.connect('https://arcalion-server.herokuapp.com');

    this.sound.play("prologueTheme");

    this.map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    let tileset = [this.map.addTilesetImage('grassdirtstone1', 'tile1')];
    tileset.push(this.map.addTilesetImage('grassmountain1', 'tile2'));

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const tileLayer1 = this.map.createStaticLayer(0, tileset, 0, 0);
    const tileLayer2 = this.map.createStaticLayer(1, tileset, 0, 0);
    const tileLayer3 = this.map.createStaticLayer(2, tileset, 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.socket.on('onLogin', splayers => //server player array
      {
        for(let elem in splayers)
          {
            let worldpos = this.map.tileToWorldXY(splayers[elem].x, splayers[elem].y);
            if(elem != this.socket.id)
            {
              let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'misa-front', this.map.tileWidth, 2, elem));
              this.physics.add.existing(newPlayer);
              newPlayer.body.setSize(32, 40);
              newPlayer.body.setOffset(0, 24);
              newPlayer.map = this.map;
              this.players[elem] = newPlayer;
              this.sys.updateList.add(this.players[elem]);
            }
            else
            {
              this.player = this.add.existing(new Player(this, worldpos.x, worldpos.y, 'atlas', 'misa-front', this.map.tileWidth, 2, elem));
              this.physics.add.existing(this.player);
              this.player.body.setSize(32, 40);
              this.player.body.setOffset(0, 24);
              this.players[elem] = this.player;
              this.sys.updateList.add(this.player);
              camera.startFollow(this.player);
              this.player.cursors = this.cursors;
              this.player.map = this.map;
              this.player.key = 'player';
            }
          }
        });

    this.socket.on('playerDisconnect', ()=>
      {
        this.players[this.socket.id].destroy();
        delete this.players[this.socket.id];
      });

    this.socket.on('playerLogin', elem =>
      {
        let worldpos = this.map.tileToWorldXY(elem.x, elem.y);
        let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'misa-front', this.map.tileWidth, 2, elem.id));
        this.physics.add.existing(newPlayer);
        newPlayer.body.setSize(32, 40);
        newPlayer.body.setOffset(0, 24);
        this.players[elem.id] = newPlayer;
        this.sys.updateList.add(this.players[elem.id]);
      });
    
    this.socket.on('playerMoved', data =>
      {
        this.players[data.plyr.id].move(data.dir);
        let worldpos = this.map.tileToWorldXY(data.plyr.x, data.plyr.y);
      });

    //Block of anims created for mob/this.players
    const anims = this.anims;
    anims.create({
      key: "testwalkwest_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalkwest_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 5,
      repeat: -1
    });
    anims.create({
      key: "testwalkeast_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalkeast_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 5,
      repeat: -1
    });
    anims.create({
      key: "testwalksouth_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalksouth_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 5,
      repeat: -1
    });
    anims.create({
      key: "testwalknorth_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalknorth_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 5,
      repeat: -1
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

  }

  //Checking for input and changes.
  update(time, delta) {
//    if(this.player!=null)this.player.update(); //Catches this.player controls
    for(let id in this.players)
    {
      this.players[id].update();
    }
  }


};

