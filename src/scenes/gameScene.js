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
    this.player;
    this.cursors;
    this.map;
    this.players = {};
    this.ui = {};
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
  preload() { //Comment this out if loadScene/titleScene are included.
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
    this.load.image('tile1', '../assets/tilesets/grassdirtstonemin.png');
    this.load.image('tile2', '../assets/tilesets/grassmountainmin.png');
    this.load.tilemapTiledJSON('map', '../assets/maps/testmap1.json');
    this.load.atlas('atlas', '../assets/atlas/dgraymanjr/dgraymanjr.png', '../assets/atlas/dgraymanjr.json');
    this.load.atlas('buttons', '../assets/ui/button.png', '../assets/ui/button_atlas.json');
    this.load.image('skillcard_sword', '../assets/ui/skillcards/sword.png');
  }

  //Rendering assets.
  create() {
    //Animations created for all assets at systems/Anims 
    createAnimations(this);

    //Map is created at systems/Map
    createMap(this);

    //Sound stuff
//    this.sound.play("prologueTheme");

    this.cursors = this.input.keyboard.createCursorKeys();

    let gameWidth = this.game.config.width;
    let gameHeight = this.game.config.height;

    this.stateText = this.add.text(0, 0, 'Not in combat', { fontSize: '24px' });
    this.chosenSkills = this.add.text(384, 0, '', {fontSize: '12px' });

    let helpTextContent = 'Combat test guide:\n\t- Arrow keys to move\n\t- Right click to open menu on interactable game objects\n\t- Left click to select option on menus\n\nThis is a very early build of Arcalion! Please be sure to report any bugs to the developer.'
    this.helpText = this.add.text(0, 384, helpTextContent, {fontSize: '12px'});

    this.statusText = this.add.text(512, 0, 'Health: ', {fontSize: '12px'});


/////////////////////////////
//  socket-definition
    this.socket = io.connect('http://localhost:8081');
//   this.socket = io.connect('https://arcalion-server.herokuapp.com');

    this.socket.on('onLogin', splayers => //server player array
      {
        for(let elem in splayers)
          {
            let worldpos = this.map.tileToWorldXY(splayers[elem].x, splayers[elem].y);
            if(elem != this.socket.id)
            {
              let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', 
                {
                  id: elem,
                  speed: 3,
                  gridX: splayers[elem].x,
                  gridY: splayers[elem].y,
                  strength: splayers[elem].strength,
                  agility: splayers[elem].agility,
                  constitution: splayers[elem].constitution
                }));
            }
            else
            {
              console.log(`Worldpos: ${worldpos.x}, ${worldpos.y}`);
              this.player = this.add.existing(new Player(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', 
                {
                  id: elem,
                  speed: 3,
                  gridX: splayers[elem].x,
                  gridY: splayers[elem].y,
                  strength: splayers[elem].strength,
                  agility: splayers[elem].agility,
                  constitution: splayers[elem].constitution
                }));              
              this.statusText.setText(`Health: ${this.player.health}`); 
              camera.startFollow(this.player);
            }
          }
        });

    this.socket.on('playerDisconnect', (id) =>
      {
        this.players[id].destroy();
        delete this.players[id];
      });

    this.socket.on('playerLogin', elem =>
      {
        let worldpos = this.map.tileToWorldXY(elem.x, elem.y);
        let newPlayer = this.add.existing(new Mob(this, worldpos.x, worldpos.y, 'atlas', 'testwalksouth_000', 
                {
                  id: elem.id,
                  speed: 3,
                  gridX: elem.x,
                  gridY: elem.y,
                  strength: elem.strength,
                  agility: elem.agility,
                  constitution: elem.constitution
                }));
      });
    
    this.socket.on('playerMoved', data =>
    {
      let player = this.players[data.id];
      player.setDestination({grid: data.pos});
      player.move(data.dir);
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.pointerText = this.add.text(0, 600, '', {fill: '#00ff00'}).setDepth(1);
  }

  //Checking for input and changes.
  update(time, delta) {
//    if(this.player!=null)this.player.update(); //Catches this.player controls
    for(let id in this.players)
    {
      this.players[id].update();
    }
    var pointer = this.input.activePointer;
    this.pointerText.setText([
      'x: ' + pointer.worldX,
      'y: ' + pointer.worldY,
      'isDown ' + pointer.isDown,
      'rightButtonDown: ' + pointer.rightButtonDown(),
      'leftButtonDown: ' + pointer.leftButtonDown()
    ]);

  }
};

