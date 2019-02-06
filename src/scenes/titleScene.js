/**
*  @author       Seirai <seilaizh@gmail.com>
*  titleScene.js
*  The Title Scene I will use to test my menu class and UI.
*
*/


import {Button, Menu} from "../systems/ui";

export class titleScene extends Phaser.Scene {

  constructor()
  {
    super({key: "titleScene"});
  }

  init()
  {
  }

  preload()
  {
  }

  create()
  {
    let foo = () => {console.log("clicked")};
    
    this.input.keyboard.on('keydown', () =>
      {
        this.scene.start('gameScene');
      });

    this.add.image(0, 0, 'start_screen_splash').setOrigin(0).setDepth(0);
    this.add.image(this.game.renderer.width/2, this.game.renderer.height/5 + 50, 'project_arcalion_logo');
    this.add.image(this.game.renderer.width/2, this.game.renderer.height/4 * 3, 'startgame_button');
    this.add.image(70, this.game.renderer.height - 12, 'tilted_studios_logo');
    let titleTheme = this.sound.add("titleTheme");
    let prologueTheme = this.sound.add("prologueTheme");
    prologueTheme.setLoop(true);
    prologueTheme.play();
    prologueTheme.setLoop(true);
/*    let startMenu = this.add.existing(new Menu(this, this.game.renderer.width/2, this.game.renderer.height/5 * 3, "silver", true));
    startMenu.addButton(this, "Start", "silver", {}, this.startGame);
    startMenu.addButton(this, "Options", "silver", {}, foo);
    startMenu.addButton(this, "Quit", "silver", {}, foo);*/
  }

  startGame()
  {
    this.scene.start("gameScene");
    this.sound.stopAll();
  }
}
