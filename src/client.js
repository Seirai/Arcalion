/**
*  @author       Seirai <seilaizh@gmail.com>
*  main.js
*  Entry point importing all scenes and configuring gameConfig.
*
*/

import 'phaser';
import io from 'socket.io-client';
import { loadScene } from './scenes/loadScene';
import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';

const gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  disableContextMenu: true,
  scene: [ loadScene, titleScene, gameScene ],

  //Enabling physics
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y : 0 } //No gravity in a top-down game.
    }
  }
};
let game = new Phaser.Game(gameConfig);
