/**
*  @author       Seirai <seilaizh@gmail.com>
*  gameScene.js
*  Currently the main scene in which development of core game mechanics and gameplay will happen.
*
*/
import {createAnimations} from '../systems/Anims';
import {createMap} from '../systems/Map';
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
//    this.game.renderer.resize(384, 384, 1.0);
    this.player;
    this.cursors;
    this.map;
    this.players = {};
    this.ui = {};
    //this.anims = {};

    //Scene functions: 
    this.createButton = function (scene, text) {
         return scene.rexUI.add.label({
             background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
 
             text: scene.add.text(0, 0, text, {
                 fontSize: '24px'
             }),
 
             space: {
                 left: 10,
                 right: 10,
                 top: 10,
                 bottom: 10
             }
         });
     };
  }

  //Loading assets.
  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
    this.load.image('tile1', '../assets/tilesets/grassdirtstonemin.png');
    this.load.image('tile2', '../assets/tilesets/grassmountainmin.png');
    this.load.tilemapTiledJSON("map", "../assets/maps/testmap1.json");
    this.load.atlas("atlas", "../assets/atlas/dgraymanjr/dgraymanjr.png", "../assets/atlas/dgraymanjr.json");

    //Skill assets
    this.load.image('skillcard_sword', '../assets/ui/skillcards/sword.png');
  }

  //Rendering assets.
  create() {
    //Animations created for all assets at systems/Anims 
    createAnimations(this);

    //Map is created at systems/Map
    createMap(this);

    //Sound stuff
    this.sound.play("prologueTheme");

    this.cursors = this.input.keyboard.createCursorKeys();

    let gameWidth = this.game.config.width;
    let gameHeight = this.game.config.height;

    this.stateText = this.add.text(0, 0, 'Not in combat', { fontSize: '24px' });
    this.chosenSkills = this.add.text(gameWidth/3, gameHeight/5, '', {fontSize: '12px' });


/////////////////////////////
//  socket-definition
    this.socket = io.connect('http://localhost:8081');
//    this.socket = io.connect('https://arcalion-server.herokuapp.com');

    this.socket.on('onLogin', splayers => //server player array
      {
        for(let elem in splayers)
          {
            let worldpos = this.map.tileToWorldXY(splayers[elem].x, splayers[elem].y);
            if(elem != this.socket.id)
            {
              let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', this.map.tileWidth, 3, elem));
              this.physics.add.existing(newPlayer);
              newPlayer.body.setSize(32, 40);
              newPlayer.body.setOffset(0, 24);
              newPlayer.map = this.map;
              this.players[elem] = newPlayer;
              this.sys.updateList.add(this.players[elem]);
            }
            else
            {
              this.player = this.add.existing(new Player(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', this.map.tileWidth, 3, elem));
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
        let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', this.map.tileWidth, 3, elem.id));
        newPlayer = this.physics.add.existing(newPlayer);
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

