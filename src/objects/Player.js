/**
 *  @author      Seilai Zhao <seilaizh@gmail.com>
 *  Player.js
 *  A definition of the Player gameobject that encompasses all monsters and players.
 */

 import {Mob} from './Mob';

export class Player extends Mob {

/**
 * @method Phaser.GameObjects.Sprite#Player
 * @since 3.12.0
 *
 * @param {object} [scene] - The scene in which the Player is created.
 * @param {integer} [x] - The x-coordinate in which the Player will be spawned
 * @param {integer} [y] - The y-coordinate in which the Player will be spawned
 * @param {key} [texture] - The key of the texture/sprite to be loaded onto the Player.
 * @param {integer} [frame] - The frame of the sprite/texture to be selected upon being loaded.
 * @param {integer} [maptileWidth] - Obsolete now that map object is linked with player.
 * @param {integer} [speed] - The speed at which the player moves at a rate of how many tiles per second.
 *
 * @return {Phaser.GameObjects.Sprite.Player}
 */
  constructor (scene, x, y, texture, frame, maptileWidth, speed)
  {
    super(scene, x, y, texture, frame, maptileWidth, speed);
    this.selected = null; //The object that the player has selected
  }

//update will call necessary functions for movement

  update(time, delta)
  {
/**
 * A movement intention is set here if a cursor is held down. This will be
 * passed into the move function to determine which direction the player will
 * move. If no key is held down then moveIntention is false
 * Note: this movement system is only active when the player is not in combat.
 */
    if(this.inCombat == false)
    {
      if(this.cursors.left.isDown) this.moveIntention = "left";
      else if(this.cursors.right.isDown) this.moveIntention = "right";
      else if(this.cursors.up.isDown) this.moveIntention = "up";
      else if(this.cursors.down.isDown) this.moveIntention = "down";
      else if(!this.cursors.isDown) this.moveIntention = false;
    }
    super.update(time, delta);

  }
}
