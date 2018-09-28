/**
 *  @author      Seilai Zhao <seilaizh@gmail.com>
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
      if(func != null) this.buttonImage.on("pointerup", func, scene);

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
        this.buttonImage[0].on("pointerup", func);
        this.buttonImage[1].on("pointerup", func);
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
        this.buttonImage[0].on("pointerup", func);
        this.buttonImage[1].on("pointerup", func);
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
        this.buttonImage[0].on("pointerup", func);
        this.buttonImage[1].on("pointerup", func);
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
      if(func != null) this.buttonImage.on("pointerup", func, scene);
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
