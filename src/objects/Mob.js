/**
 *  @author      Seilai Zhao <seilaizh@gmail.com>
 *  Mob.js
 *  A definition of the Mob gameobject that encompasses all monsters and players.
 */

export class Mob extends Phaser.GameObjects.Sprite {

/**
 * @method Phaser.GameObjects.Sprite#Mob
 * @since 3.0.0
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
    this.destination; //set when the mob is given a move order to a coordinate.
    this.spd = speed;
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
    if(this.hasReachedDestination())
    {
      this.stopMovement();
      this.syncDestination();
//      this.prevPos = this.body.position.clone();
    }

  }

/**
 * @method Phaser.GameObjects.Sprite.Mob#isMoving
 * @since 3.0.0
 *
 * @return {Phaser.GameObjects.Sprite.Mob.isMoving}
 */

  isMoving() {
    return (this.body.velocity.x != 0 || this.body.velocity.y != 0);
  }

/**
   * @method Phaser.GameObjects.Sprite.Mob#move
   * @since 3.0.0
   *
   * @param {string} [dir] - The direction that the move method will be called with.
   * @param {float} [spd] - The speed that the mob will be moving at. It will be at a rate of $spd tiles per second.
   *
   * @return {Phaser.GameObjects.Sprite.Mob.move}
   */

  move(dir)
  {
    let trueSpd = this.mapTileWidth * this.spd;
    let curPos = this.body.position;
    this.destination = this.body.position.clone();
    console.log("Move called: " + dir);
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

  hasReachedDestination()
  {
    this.moveIntention = false;
    return (
      (this.body.position.x >= this.destination.x && this.prevPos.x < this.destination.x)||
      (this.body.position.x <= this.destination.x && this.prevPos.x > this.destination.x)||
      (this.body.position.y >= this.destination.y && this.prevPos.y < this.destination.y)||
      (this.body.position.y <= this.destination.y && this.prevPos.y > this.destination.y));
  }

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
      //  throw "No direction on stop-command";
        break;
    }
    return this.body.setVelocity(0);
  }

  syncDestination()
  {
    this.body.position.x = Math.round(this.destination.x/this.mapTileWidth)*this.mapTileWidth;
    this.body.position.y = Math.round(this.destination.y/this.mapTileWidth)*this.mapTileWidth;
    //console.log(this.body.position);
    return true;
  }
}
