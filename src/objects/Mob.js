/**
 *  @author      Seirai <seilaizh@gmail.com>
 *  Mob.js
 *  A definition of the Mob gameobject that encompasses all monsters and Mobs.
 */

import {Menu} from "../systems/ui";

import * as Combat from "../systems/Combat";
import {redrawGrids} from '../systems/ui';
export class Mob extends Phaser.GameObjects.Sprite {

/**
 * @method Phaser.GameObjects.Sprite#Mob
 * @since 3.12.0
 *
 * @param {object} [scene] - The scene in which the Mob is created.
 * @param {integer} [x] - The x-coordinate in which the mob will be spawned
 * @param {integer} [y] - The y-coordinate in which the mob will be spawned
 * @param {object} [config] - Holds a variety of configuration objects listed below:
 *  - id
 *  -
 *
 * @return {Phaser.GameObjects.Sprite.Mob}
 */
  constructor (scene, x, y, texture, frame, config)
  {
    super(scene, x, y, texture, frame);
    //Configuration:
    this.id = config.id;
    if(config.speed == null) this.spd = 3;
    else this.spd = config.speed;
    if(config.state == null) this.state = false;
    else this.state = config.state;
    this.scene = scene;
    this.gridX = config.gridX;
    this.gridY = config.gridY;
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 0.25);
    this.body.setSize(32, 32);
    this.body.setOffset(-5, 14);

    this.scene.players[this.id] = this;
    this.cursors = this.scene.cursors;
    this.map = this.scene.map;

    //Statistics calculations:
    //Primary statistics
    if(config.constitution != null) this.constitution = config.constitution;
    else this.constitution = 10;
    if(config.agility != null) this.agility = config.agility;
    else this.agility = 10;
    if(config.strength != null) this.strength = config.strength;

    //Secondary statistics
    this.health = 90 + this.constitution;

    //Initiating various variables that aren't relevant to config:
    this.moveIntention = false;
    this.prevPos;  //previous position
    this.prevVel;  //previous velocity
    this.prevDest; //previous destination
    this.destination = this.body.position.clone(); //set when the mob is given a move order to a coordinate.

    this.moveQueue = [];
    this.attemptMove = false;

    //COMBAT BLOCK
    this.combat = {};
    this.combat.initialPos = {x: this.x,   //Initial position of the player as the round started
      y: this.y,
      grid: { x: this.gridX,
        y: this.gridY
        }
      };           

    //This weird block is to reset the sprite to the grid for some reason it doesn't even with the offsets.
    let currX = this.map.tileToWorldX(this.gridX);
    let currY = this.map.tileToWorldY(this.gridY);
    this.body.reset(currX, currY);

    let requestBattle = (pointer) =>
    {
      console.log(pointer);
      if(pointer.leftButtonDown())
      {
        this.scene.socket.emit('playerBattleRequest', { id: this.scene.socket.id, target: this.id });
      }
    }

    this.openMobMenu = (pointer) =>
    {
      let closeMenu = () =>
      {
        this.mobMenu.destroy();
        delete this.mobMenu;
      }
      if(this.mobMenu == null)
      {
      this.mobMenu = this.scene.add.existing(new Menu(this.scene, pointer.x, pointer.y, "silver", false));
      this.mobMenu.addButton(this.scene, "Fight", "silver", {}, requestBattle);
      this.mobMenu.addButton(this.scene, "Close", "silver", {}, closeMenu);
      }
      this.mobMenu.setVisible(true);
      this.mobMenu.x = pointer.x;
      this.mobMenu.y = pointer.y;
    }

    this.mobClicked = (pointer) =>
    {
      if(pointer.rightButtonDown() && this.key != 'player') this.openMobMenu(pointer);
    };

    this.setInteractive();
    this.on("pointerdown", this.mobClicked);
    /**
     *  Mob statistics will go here.
     *  design doc: https://docs.google.com/document/d/1R1Zfk5H-SGsoGz-XW6fKIWLZbLpwet5gPclhuVwpVu8/edit?usp=sharing
     *  We will first implement primary stats here:
     *  Default base stat = 10
     */
        this.strength = 10;
        this.agility = 10;
        this.constitution = 10;

    /**
     * Secondary stats.
     */
        this.health = this.constitution * 10;
  }

//Using preUpdate to constantly update the Mob's previous position and velocity.

  preUpdate(time, delta)
  {
    super.preUpdate(time, delta);
    this.prevVel = this.body.velocity.clone();
    this.prevPos = this.body.position.clone();
  }

//update will call necessary functions for movement

  update(time, delta)
  {
    /**
     * If the Mob the Mob is intending to move and this object is not moving,
     * give the Mob an initial move command in the direction.
     */
        if(this.moveIntention != false && !this.isMoving())
        {
          this.move(this.moveIntention, delta);
        }
    /**
     * If the Mob is moving and it still wishes to move but has reached the
     * original destination, set a new destination ahead of it.
     */
        else if(this.isMoving() && this.moveIntention != false && this.hasReachedDestination())
        {
          this.stopMovement();
          this.move(this.moveIntention);
        }
    /**
     * If the Mob is moving but no moveIntention is available and it has reached
     * the destination, stop the Mob.
     */
        else if(this.isMoving() && this.moveIntention == false && this.hasReachedDestination())
        {
          this.attemptMove = false;
          this.stopMovement();
        }
    super.update(time, delta);
  }

/**
 * @method Phaser.GameObjects.Sprite.Mob#isMoving
 * @since 3.12.0
 * Returns true if mob is moving.
 * @return {Phaser.GameObjects.Sprite.Mob.isMoving}
 */

  isMoving() {
    return (this.body.velocity.x != 0 || this.body.velocity.y != 0);
  }

/**
   * @method Phaser.GameObjects.Sprite.Mob#move
   * @since 3.12.0
   *
   * @param {string} [dir] - The direction that the move method will be called with.
   * @param {float} [spd] - The speed that the mob will be moving at. It will be at a rate of $spd tiles per second.
   *
   * @return {Phaser.GameObjects.Sprite.Mob.move}
   */

  move(dir, dt)
  {
    this.prevDest = {gridX: this.gridX, gridY: this.gridY};
    let trueSpd = this.map.tileWidth * this.spd;
    let curPos = {gridX: this.gridX, gridY: this.gridY};
    switch(dir)
    {
      case "up":
      this.anims.play("testwalknorth_", true);
      this.body.setVelocityY(-trueSpd);
      //this.destination.y = (curPos.gridY - 1) * this.map.tileWidth;
      break;

      case "down":
      this.anims.play("testwalksouth_", true);
      this.body.setVelocityY(trueSpd);
      //this.destination.y = (curPos.gridY + 1) * this.map.tileWidth;
      break;

      case "left":
      this.anims.play("testwalkwest_", true);
      this.body.setVelocityX(-trueSpd);
      //this.destination.x = (curPos.gridX - 1) * this.map.tileWidth;
      break;

      case "right":
      this.anims.play("testwalkeast_", true);
      this.body.setVelocityX(trueSpd);
      //this.destination.x = (curPos.gridX + 1) * this.map.tileWidth;
      break;

      default:
      throw "No direction inputted in a move-command";
      break;
    }
  }
/**
   * @method Phaser.GameObjects.Sprite.Mob#hasReachedDestination
   * @since 3.12.0
   *
   * This function returns whether the Mob has reached its destination or not.
   *
   * @return {Phaser.GameObjects.Sprite.Mob.hasReachedDestination}
   */
  hasReachedDestination()
  {
    return (
      (this.body.position.x >= this.destination.x && this.prevPos.x < this.destination.x)||
      (this.body.position.x <= this.destination.x && this.prevPos.x > this.destination.x)||
      (this.body.position.y >= this.destination.y && this.prevPos.y < this.destination.y)||
      (this.body.position.y <= this.destination.y && this.prevPos.y > this.destination.y));
  }
/**
   * @method Phaser.GameObjects.Sprite.Mob#stopMovement
   * @since 3.12.0
   *
   * This function stops the Mob's movement but not before setting a stop
   * frame for the Mob's sprite.
   * @return {Phaser.GameObjects.Sprite.Mob.stopMovement}
   */
  stopMovement()
  {
    this.anims.stop();
    switch(this.body.facing)
    {
      case 11:
        this.setTexture("atlas", "testwalknorth_000");
        break;
      case 12:
        this.setTexture("atlas", "testwalksouth_000");
        break;
      case 13:
        this.setTexture("atlas", "testwalkwest_000");
        break;
      case 14:
        this.setTexture("atlas", "testwalkeast_000");
        break;
      default:
        console.log( "No direction on stop-command" );
        break;
    }
    this.syncDestination();
    return this.body.setVelocity(0);
  }
/**
   * @method Phaser.GameObjects.Sprite.Mob#syncDestination
   * @since 3.12.0
   *
   * This function ensures that the Mob ends on a flat value divisible by the
   * world's map tileWidth and tileLength
   * @return {Phaser.GameObjects.Sprite.Mob.syncDestination}
   */
  syncDestination()
  {
    this.gridX = this.map.worldToTileX(this.destination.x);
    this.gridY = this.map.worldToTileY(this.destination.y);
    this.setPosition(this.destination.x, this.destination.y);
    if(Number.isInteger(this.state)) //If we're in combat
      redrawGrids(this.scene);

    return true;
  }
/**
   * @method Phaser.GameObjects.Sprite.Mob#setToPrevDest
   * @since 3.12.0
   *
   * This function is used to bump the Mob back to its original position if
   * it collided with an object before reaching its new destination.
   * @return {Phaser.GameObjects.Sprite.Mob.setToPrevDest}
   */
  setToPrevDest()
  {
    this.setPosition(this.prevDest.x, this.prevDest.y);
    return true;
  }

/**
 * @method Phaser.GameObjects.Sprite.Mob#getCurrentTile
 * @since 3.12.0
 *
 * This method is used to acquire what tile index the sprite is on the map.
 * @return @var {Phaser.Math.Vector2} [tile]
 */

  getCurrentTile()
  {
   let tile = this.scene.map.worldToTileXY(this.body.position.x, this.body.position.y);
   return(tile);
  }
  setDestination(config)
  {
    if(config.grid != null)
    {
      var newX = this.map.tileToWorldX(config.grid.x);
      var newY = this.map.tileToWorldY(config.grid.y);
    }
    else
    {
      var newX = config.x;
      var newY = config.y;
    }

    this.destination.x = newX;
    this.destination.y = newY;
  }
  newPosition()
  {
    this.combat.initialPos = {x: this.x, y: this.y,
      grid: {x: this.gridX, y: this.gridY}
    };
  }
  resetPosition()
  {
    this.setPosition(this.combat.initialPos.x, this.combat.initialPos.y);
    this.gridX = this.combat.initialPos.grid.x;
    this.gridY = this.combat.initialPos.grid.y;
    this.setDestination(this.combat.initialPos.x, this.combat.initialPos.y);
  } 
}
