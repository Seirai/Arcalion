/*
 * 
 *  @author      Seirai <seilaizh@gmail.com>
 *  ui.js
 *  A base class for drop-down menus.
 */

export class Button extends Phaser.GameObjects.Container
{
  /**
   * @method Phaser.GameObjects.Container#Button
   * @since 3.12.0
   *
   * @param {object} [scene] - The scene in which the Button is created.
   * @param {integer} [x] - The x-coordinate in which the Button will be spawned
   * @param {integer} [y] - The y-coordinate in which the Button will be spawned
   * @param {string} [text] - The text to be displayed on the button
   * @param {string} [key] - The type of button to be loaded and key of it.
   * @param {object} [style] - An object containing a number of properties to style the text.
   * @param {function} [func] - A function to be passed to the button that will be called every time the button is pushed.
   * @TODO Rework key parameter. Add "type" to determine the type of button and have key be an identification instead.
   *
   * @return {Phaser.GameObjects.Container#Button}
   */
  constructor(scene, x, y, text, key, style, func)
  {
    super(scene, x, y);
    this.setScrollFactor(0); //Makes sure that the UI is scrolling with the camera.

    // This switch will take the button's key and select what type of button it will become.
    // I'll only describe one case because every single other button is
    // nigh functionally identical.
    switch(key)
    {
      case "silver":

      //Creating the button's image and making it interactive.
      this.buttonImage = scene.add.image(x, y, "buttons", "button_default").setInteractive();
      this.buttonImage.imageType = "Button";
      this.buttonImage.setScrollFactor(0);
      this.add(this.buttonImage);

      //Creating the button's text.
      this.buttonText = scene.add.text(x-22, y-8, text, style);
      this.add(this.buttonText);

      //If a function was passed to the button, give the button an event listener
      //where if it is clicked, the function will be called.
      //@TODO Make the button also initialize a new variable to hold the function
      //in case the player wants to select the button without clicking it.
      if(func != null) this.buttonImage.on("pointerdown", func, scene);

      //The frame and an extra identifier for the button to make it change frames
      //depending on what happens to it.
      this.textureFrame = "button_default";
      this.textureKey = "buttons";
      this.key = key;
      break;
      case "ui_start":
      this.buttonImage = [scene.add.image(x-47, y, "ui", "ui_start").setInteractive(),
      scene.add.image(x, y, "ui", "ui_button").setInteractive()];
      if(func != null)
      {
        this.buttonImage[0].on("pointerdown", func);
        this.buttonImage[1].on("pointerdown", func);
      }
      this.textureFrame = "ui_button";
      this.textureKey = "ui";
      this.key = key;
      break;
      case "ui_misc":
      this.buttonImage = [scene.add.image(x-47, y, "ui", "ui_misc").setInteractive(),
      scene.add.image(x, y, "ui", "ui_button").setInteractive()];
      if(func != null)
      {
        this.buttonImage[0].on("pointerdown", func);
        this.buttonImage[1].on("pointerdown", func);
      }
      this.textureFrame = "ui_button";
      this.textureKey = "ui";
      this.key = key;
      break;
      case "ui_cancel":
      this.buttonImage = [scene.add.image(x-47, y, "ui", "ui_cancel").setInteractive(),
      scene.add.image(x, y, "ui", "ui_button").setInteractive()];
      if(func != null)
      {
        this.buttonImage[0].on("pointerdown", func);
        this.buttonImage[1].on("pointerdown", func);
      }
      this.textureFrame = "ui_button";
      this.textureKey = "ui";
      this.key = key;
      break;
      default:
      this.buttonImage = scene.add.image(x, y, "buttons", "button_default").setInteractive();
      this.buttonText = scene.add.text(x-22, y-8, text, style);
      this.buttonImage.imageType = "Button";
      this.add(this.buttonImage);
      this.add(this.buttonText);
      if(func != null) this.buttonImage.on("pointerdown", func, scene);
      this.textureFrame = "button_default";
      this.textureKey = "buttons";
      this.key = key;
      break;
    }
  }
  /**
   * @method Phaser.GameObjects.Container.Button#select
   * @since 3.12.0
   *
   * Shifts this button's frame to a "selected" mode which will, in the future,
   * enable its function to be called from a confirmation button and also,
   * depending on its frame, shift to a selected frame.
   *
   * @return {Phaser.GameObjects.Container.Button#select}
   */
  select()
  {
    switch (this.key)
    {
      case "silver":
      this.buttonImage.setTexture("buttons", "button_selected");
      this.textureFrame = "button_selected";
      break;
      default:
      break;
    }
  }
  deselect()
  {
    switch (this.key)
    {
      case "silver":
      this.buttonImage.setTexture("buttons", "button_default");
      this.textureFrame = "button_default";
      break;
      default:
      break;
    }
  }
}
/**
 * @method Phaser.GameObjects.Container#Menu
 * @since 3.12.0
 *
 * @param {object} [scene] - The scene in which the Menu is created.
 * @param {integer} [x] - The x-coordinate in which the menu will be created
 * @param {integer} [y] - The y-coordinate in which the menu will be created
 * @param {string} [buttonType] - The type of buttons that will populate this Menu
 * @param {bool} [draggable] - Whether the menu is draggable or not.
 * @param {array} [children] - An array containing children already defined to be passed to the menu.
 *
 * @return {Phaser.GameObjects.Container#Menu}
 */
export class Menu extends Phaser.GameObjects.Container
{
  constructor(scene, x, y, buttonType, draggable, children)
  {
    super(scene, x, y, children);
    this.setScrollFactor(0); //Makes sure that the UI is scrolling with the camera.
    this.selectedIndex; // The currently selected button in the menu.
    this.x = x;
    this.y = y;

    //This switch will determine how we should space the buttons in the menu depending
    //on the button type.
    switch(buttonType)
    {
      case "silver":
      this.buttonLength = 34;
      break;
      default:
      this.buttonLength = 50;
      break;
    }
  }
  /**
   * @method Phaser.GameObjects.Container.Menu#addButton
   * @since 3.12.0
   *
   * @param {object} [scene] - The scene in which the button will be added.
   * @param {string} [text] - The text that will be rendered on the Button.
   * @param {string} [key] - The type and key of the button.
   * @param {object} [style] - A style object to stylize the text of the button.
   * @param {function} [func] - A function to be used as the button callback.
   *
   * @return {Phaser.GameObjects.Container.Menu#addButton}
   */
  addButton(scene, text, key, style, func)
  {
    this.add(scene.add.existing(new Button(scene, 0 , 0  + this.buttonLength/2 * this.length, text, key, style, func)));
    scene.input.on('gameobjectover', function (pointer, gameObject) {
      if(gameObject.imageType == "Button") gameObject.setTexture("buttons", "button_selected");
    });
    scene.input.on('gameobjectout', function (pointer, gameObject) {
      if(gameObject.imageType == "Button") gameObject.setTexture("buttons", "button_default");
    });
  }
}

export function createSkillMenu(scene, items)
{
  const COLOR_PRIMARY = 0x4e342e;
  const COLOR_LIGHT = 0x7b5e57;
  const COLOR_DARK = 0x260e04;

  let gameWidth = scene.game.config.width;
  let gameHeight = scene.game.config.height;
  console.log(gameWidth);
  scene.ui['skillMenu'] = scene.rexUI.add.gridTable({
    x: gameWidth/2,
    y: gameHeight/3*2,

    background: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),
    
    table: {
      width: 250,
      height: 400,

      cellWidth: 240,
      cellHeight: 120,
      columns: 1,
    },

    slider: {
      track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
    },

    createCellContainerCallback: function (cell) {
      let scene = cell.scene,
        width = cell.width,
        height = cell.height,
        item = cell.item,
        index = cell.index;
      return scene.rexUI.add.label({
        width: width,
        height: height,

        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
        icon: scene.add.image(0, 0, 'skillcard_sword'),
        text: scene.add.text(0, 0, item.id),
        space: {
          icon: 10,
          left: 5,
        }
      })
      .setOrigin(0)
      .layout();
    },
  }).layout()
  .setOrigin(0);

  scene.ui['skillMenu'].on('cell.click', function(cellContainer, cellIndex)
    {
      if(this.player.selectedSkills.length < 3)
      {
        this.player.selectedSkills.push(cellContainer.text);
        this.chosenSkills.setText('Chosen skills: ' + this.player.selectedSkills);
      }
      if(this.player.selectedSkills.length == 3 && this.state != 'ready')
      {
        let dataBundle =
        {
          id: this.player.id,
          instanceId: this.player.combat.id,
          selectedSkills: this.player.selectedSkills, //TODO in the future: erase selected skills client side, verify for valid spells on server (or flag for cheating if client is using unusable skills).
        }
        this.socket.emit('intermissionReady', dataBundle);
        this.state = 'ready';
        this.stateText.setText('Intermission -- Ready, waiting for other players...');
      }
    }, scene)
    .on('cell.over', function (cellContainer, cellIndex)
    {
      cellContainer.getElement('background')
        .setStrokeStyle(1, 0xffffff)
        .setDepth(1);
    }, scene)
    .on('cell.out', function (cellContainer, cellIndex)
    {
      cellContainer.getElement('background')
        .setStrokeStyle(2, 0x260e04)
        .setDepth(0);
    }, scene);

};

const CombatGrids = [[[0,0]], [[0,0],[0,1],[0,-1],[1,0],[-1,0]], [[0,0],[0,1],[0,-1],[1,0],[-1,0],[0,2],[1,1],[-1,1],[-2,0],[2,0],[-1,-1],[1,-1],[0,-2]], [[0,0],[0,1],[0,-1],[1,0],[-1,0],[0,2],[1,1],[-1,1],[-2,0],[2,0],[-1,-1],[1,-1],[0,-2],[0,3],[1,2],[-1,2],[-2,1],[2,1],[-3,0],[3,0],[-2,-1],[2,-1],[-1,-2],[1,-2],[0,-3]]];
const gridConfig = {color: 0x00ff00,
  alpha: 0.5,
  gridColor: 0x000000,
  alpha2: 0.2,
  thickness: 2
}

export function createCombatMenu(scene, dir)
{
  scene.ui['combatGrid'] = scene.add.graphics();
  scene.ui['combatGrid'].fillStyle(gridConfig.color, gridConfig.alpha);
  scene.ui['combatGrid'].lineStyle(gridConfig.thickness, gridConfig.gridColor, gridConfig.alpha2);
  for(let [x,y] of CombatGrids[1])
  {
    let actualX = scene.player.gridX + x;
    let actualY = scene.player.gridY + y;
    scene.ui['combatGrid'].fillRect(scene.map.tileWidth * actualX, scene.map.tileWidth * actualY, scene.map.tileWidth, scene.map.tileWidth);
    scene.ui['combatGrid'].strokeRect(scene.map.tileWidth * actualX, scene.map.tileWidth * actualY, scene.map.tileWidth, scene.map.tileWidth);
  }


  //Combat menu stuff:
  let combatConfirm = () =>
  {
    scene.socket.emit('confirmMove', scene.player.combat.initialPos.grid);
  };
  let combatCancel = () =>
  {
    scene.socket.emit('combatCancelMove', scene.player.combat.initialPos.grid); 
    scene.player.resetPosition();
    scene.player.combat.moveArray = [];
    redrawGrids(scene);
  };
  if(scene.ui.combatMenu === undefined)
  {
    scene.ui['combatMenu'] = scene.add.existing(new Menu(scene, 448, 174, 'silver', true));
    scene.ui.combatMenu.addButton(scene, 'Confirm', 'silver', {}, combatConfirm);
    scene.ui.combatMenu.addButton(scene, 'Cancel', 'silver', {}, combatCancel);
  }

};

export function redrawGrids(scene)
{
  scene.ui.combatGrid.clear();
  for(let [x,y] of CombatGrids[0])
  { 
    let actualX = scene.player.gridX + x;
    let actualY = scene.player.gridY + y;
    scene.ui['combatGrid'].fillRect(scene.map.tileWidth * actualX, scene.map.tileWidth * actualY, scene.map.tileWidth, scene.map.tileWidth);
    scene.ui['combatGrid'].strokeRect(scene.map.tileWidth * actualX, scene.map.tileWidth * actualY, scene.map.tileWidth, scene.map.tileWidth);
  }
};
