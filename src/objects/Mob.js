/**
 *  @author      Seilai Zhao <seilaizh@gmail.com>
 *  Mob.js
 *  A definition of the Mob gameobject that encompasses all monsters and Mobs.
 */

import {Menu} from "../systems/ui";

import * as Combat from "../systems/Combat";

export class Mob extends Phaser.GameObjects.Sprite {

/**
 * @method Phaser.GameObjects.Sprite#Mob
 * @since 3.12.0
 *
 * @param {object} [scene] - The scene in which the Mob is created.
 * @param {integer} [x] - The x-coordinate in which the mob will be spawned
 * @param {integer} [y] - The y-coordinate in which the mob will be spawned
 * @param {key} [texture] - The key of the texture/sprite to be loaded onto the mob.
 * @param {integer} [frame] - The frame of the sprite/texture to be selected upon being loaded.
 *
 * @return {Phaser.GameObjects.Sprite.Mob}
 */
  constructor (scene, x, y, texture, frame, maptileWidth, speed)
  {
    super(scene, x, y, texture, frame);
    this.moveIntention = false;
    this.mapTileWidth = maptileWidth;
    this.prevPos;  //previous position
    this.prevVel;  //previous velocity
    this.prevDest; //previous destination
    this.destination; //set when the mob is given a move order to a coordinate.
    this.spd = speed;
    this.inCombat = false;
    this.moveQueue = [];

    this.openMobMenu = (pointer) =>
    {
      let closeMenu = () =>
      {
        this.mobMenu.setVisible(false);
      }
      let fight = (pointer) =>
      {
        Combat.initiateCombat(pointer, this.key);
      }
      if(this.mobMenu == null)
      {
      this.mobMenu = this.scene.add.existing(new Menu(this.scene, pointer.x, pointer.y, "silver", false));
      this.mobMenu.addButton(this.scene, "Fight", "silver", {}, fight);
      this.mobMenu.addButton(this.scene, "Close", "silver", {}, closeMenu);
      }
      this.mobMenu.setVisible(true);
      this.mobMenu.x = pointer.x;
      this.mobMenu.y = pointer.y;


    }

    this.setInteractive();
    this.on("pointerdown", function ( pointer ) {
      if(pointer.rightButtonDown()) this.openMobMenu(pointer);});


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
    super.update(time, delta);
    /**
     * If the Mob the Mob is intending to move and this object is not moving,
     * give the Mob an initial move command in the direction.
     */
        if(this.moveIntention != false && !this.isMoving())
        {
          this.move(this.moveIntention);
        }
    /**
     * If the Mob is moving and it still wishes to move but has reached the
     * original destination, set a new destination ahead of it.
     */
        else if(this.isMoving() && this.moveIntention != false && this.hasReachedDestination())
        {
          this.body.stop();
          this.move(this.moveIntention);
        }
    /**
     * If the Mob is moving but no moveIntention is available and it has reached
     * the destination, stop the Mob.
     */
        else if(this.isMoving() && this.moveIntention == false && this.hasReachedDestination())
        {
          this.stopMovement();
          this.syncDestination();
        }
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
 * @method Phaser.GameObjects.Sprite.Mob#setMoveIntention
 * @since 3.12.0
 * @param {string} [dir] - Gives the mob a moveintention in a direction.
 * @return {Phaser.GameObjects.Sprite.Mob.setMoveIntention}
 */

 setMoveIntention(dir)
 {
   this.moveIntention = dir;
   return true;
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

  move(dir)
  {
    this.prevDest = this.body.position.clone();
    let trueSpd = this.mapTileWidth * this.spd;
    let curPos = this.body.position;
    this.destination = this.body.position.clone();
    switch(dir)
    {
      case "up":
      this.anims.play("misa-back-walk", true);
      this.body.setVelocityY(-trueSpd);
      this.destination.y = (Math.round((curPos.y-this.mapTileWidth)/this.mapTileWidth)) * this.mapTileWidth;
      break;

      case "down":
      this.anims.play("misa-front-walk", true);
      this.body.setVelocityY(trueSpd);
      this.destination.y = (Math.round((curPos.y+this.mapTileWidth)/this.mapTileWidth)) * this.mapTileWidth;
      break;

      case "left":
      this.anims.play("misa-left-walk", true);
      this.body.setVelocityX(-trueSpd);
      this.destination.x = (Math.round((curPos.x-this.mapTileWidth)/this.mapTileWidth)) * this.mapTileWidth;
      break;

      case "right":
      this.anims.play("misa-right-walk", true);
      this.body.setVelocityX(trueSpd);
      this.destination.x = (Math.round((curPos.x+this.mapTileWidth)/this.mapTileWidth)) * this.mapTileWidth;
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
        this.setTexture("atlas", "misa-back");
        break;
      case 12:
        this.setTexture("atlas", "misa-front");
        break;
      case 13:
        this.setTexture("atlas", "misa-left");
        break;
      case 14:
        this.setTexture("atlas", "misa-right");
        break;
      default:
        console.log( "No direction on stop-command" );
        break;
    }
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
    this.body.position.x = Math.round(this.destination.x/this.mapTileWidth)*this.mapTileWidth;
    this.body.position.y = Math.round(this.destination.y/this.mapTileWidth)*this.mapTileWidth;
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
    this.body.position.x = this.prevDest.x;
    this.body.position.y = this.prevDest.y;
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
   let tile = new Phaser.Math.Vector2();
   tile.x = Math.floor(this.destination.x/this.mapTileWidth);
   tile.y = Math.floor(this.destination.y/this.mapTileWidth);
   return(tile);
 }
}
