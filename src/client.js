/**
*  @author       Seilai Zhao <seilaizh@gmail.com>
*  main.js
*  Entry point importing all scenes and configuring gameConfig.
*
*/

import 'phaser';
<<<<<<< HEAD
import io from 'socket.io-client';
import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';

=======

import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';
>>>>>>> 8fd2498... Imolementing matter-js headless server
const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  disableContextMenu: true,
  scene: [ titleScene, gameScene ],

  //Enabling physics
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y : 0 } //No gravity in a top-down game.
    }
  }
};
let game = new Phaser.Game(gameConfig);
