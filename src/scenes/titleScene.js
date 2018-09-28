/**
*  @author       Seilai Zhao <seilaizh@gmail.com>
*  titleScene.js
*  The Title Scene I will use to test my menu class and UI.
*
*/

import {controls} from "../main";

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
    this.load.atlas("buttons", "../assets/ui/button.png", "../assets/ui/button_atlas.json");
    this.load.atlas("ui", "../assets/ui/ui.png", "../assets/ui/ui_atlas.json");

    this.load.audio("titleTheme", "../assets/sound/title_theme.mp3");
    this.load.audio("prologueTheme", "../assets/sound/prologue_theme.mp3");
  }

  create()
  {
    let foo = () => {console.log("test")};


    let titleTheme = this.sound.add("titleTheme");
    let prologueTheme = this.sound.add("prologueTheme");
    prologueTheme.setLoop(true);
    titleTheme.play();
    titleTheme.setLoop(true);
    let startMenu = this.add.existing(new Menu(this, 512, 271, "silver", true));
    startMenu.addButton(this, "Start", "silver", {}, this.startGame);
    startMenu.addButton(this, "Options", "silver", {}, foo);
    startMenu.addButton(this, "Quit", "silver", {}, foo);
  }

  startGame()
  {
    this.scene.start("gameScene");
    this.sound.stopAll();
  }
}
