////////////////////////////////////////////////////////////////////////////////////////////////////
//    Project Arcalion -- Permadeath RPG Sandbox
//  A game with a progression system that can switch between a traditional RPG and one that bases itself on
//  EXP earned through RP. For more information, check the doc:
//
//  Coder: Seirai
//
//    main.js
//  App entry point.
//////

import 'phaser';

import { testScene } from './scenes/testScene';

const gameConfig = {
  width: 680,
  height: 400,
  scene: testScene,

  //Enabling physics
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y : 0 } //No gravity in a top-down game.
    }
  }
};
let controls;
new Phaser.Game(gameConfig);
