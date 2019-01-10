/**
 *  @author      Seirai <seilaizh@gmail.com>
 *  Player.js
 *  A definition of the Player gameobject that encompasses all monsters and players.
 */
import {Menu, createSkillMenu, createCombatMenu} from '../systems/ui';
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
  constructor (scene, x, y, texture, frame, config)
  {
    super(scene, x, y, texture, frame, config);
    this.selected = null; //The object that the player has selected
    this.selectedSkills = [];
    this.combat = {}; //Container for combat
    this.combat['moveArray'] = []; //Move array.
    this.key = 'player';
    ///////////////
    // Socket-events
    //
    this.scene.socket.on('moveConfirm', data =>
    {
      switch(data.dir)
      {
      case 'left':
          this.moveIntention = 'left';
          this.setDestination({grid: data.pos});
          break;
        case 'right':
          this.moveIntention = 'right';
          this.setDestination({grid: data.pos});
          break;
        case 'up':
          this.moveIntention = 'up';
          this.setDestination({grid: data.pos});
          break;
        case 'down':
          this.moveIntention = 'down';
          this.setDestination({grid: data.pos});
          break;
      }
    });

    this.scene.socket.on('receivedBattleRequest', data =>
    {
      let confirmBattle = () =>
      {
        this.scene.socket.emit('confirmedBattleRequest', data);
        this.menu.destroy();
        delete this.menu;
      }
      let cancelBattle = () =>
      {
        this.scene.socket.emit('cancelBattleRequest', data);
        this.menu.destroy();
        delete this.menu;
      }
      if(this.menu == null)
      {
        this.menu = this.scene.rexUI.add.dialog({
          x: 512,
          y: 400,
          
          background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x5d737e),

          title: this.scene.rexUI.add.label({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x64b6ac),
            text: this.scene.add.text(0, 0, 'Battle Request', {
              fontSize: '24px'
            }),
            space: {
              left: 15,
              right: 15,
              top: 10,
              bottom: 10
            }
          }),

          content: this.scene.add.text(0, 0, `Player ${data.id} is sending you a battle request, do you accept?`, {
            fontSize: '24px'
          }),

          actions: [
            this.scene.createButton(this.scene, 'Accept'),
            this.scene.createButton(this.scene, 'No')
          ],

          space: {
            title: 25,
            content: 25,
            action: 15,

            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },

          align: {
            actions: 'center',
          }
        }).layout()
        .setScale(0);

        let tween = this.scene.tweens.add({
          targets: this.menu,
          scaleX: 0.5,
          scaleY:  0.8,
          ease: 'Bounce',
          duration: 1000,
          repeat: 0,
          yoyo: false
        });

        this.print = this.scene.add.text(0, 0, '');
        this.menu
              .on('button.click', function (button, groupName, index) {
                  if (button.text == 'Accept') confirmBattle();
                  if (button.text == 'No') cancelBattle();
              }, this)
              .on('button.over', function (button, groupName, index) {
                  button.getElement('background').setStrokeStyle(1, 0xffffff);
              })
              .on('button.out', function (button, groupName, index) {
                  button.getElement('background').setStrokeStyle();
              });

      }
    });

    this.scene.socket.on('startIntermission', combatInstance =>
    {
      this.state = -1;
      for(let id in combatInstance.combatants)
      {
        this.scene.players[id].state = combatInstance.state;
        if(this.scene.players[id].mobMenu != null)
        {
          this.scene.players[id].mobMenu.destroy();
          delete this.scene.players[id].mobMenu;
        }
      }
        this.scene.stateText.setText('Intermission');
        this.scene.chosenSkills.setText('Chosen skills: ');
        this.scene.player.combatInstance = combatInstance;
        if(this.scene.ui['skillMenu'] == null)
        {
          createSkillMenu(this.scene);
          let skillArray = [];
          for(let skills in combatInstance.combatants[this.scene.socket.id].skills)
          {
            skillArray.push(combatInstance.combatants[this.scene.socket.id].skills[skills]);
          }
          this.scene.ui['skillMenu'].setItems(skillArray);

        }
    });
    
    this.scene.socket.on('startRound', (data) =>
    {
      if(data.round == null) data.round = 0;
      else data.round++;
      this.state = data.round;

      this.scene.stateText.setText(`Round ${data.round}`);
      if(this.scene.ui['skillMenu']!=null)this.scene.ui['skillMenu'].destroy();
      delete this.scene.ui['skillMenu'];

      if(this.scene.ui['combatGrid']==null) createCombatMenu(this.scene);
    });
  
  //
  //////
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

    if(this.state == false && !Number.isInteger(this.state))
    {
      if(this.cursors.left.isDown && this.attemptMove == false)
      {
        this.attemptMove = true;
        this.scene.socket.emit('moveAttempt', 'left');
      }
      else if(this.cursors.right.isDown && this.attemptMove == false)
      {
        this.scene.socket.emit('moveAttempt', 'right');
        this.attemptMove = true;
      }
      else if(this.cursors.up.isDown && this.attemptMove == false) 
      {
        this.scene.socket.emit('moveAttempt', 'up');
        this.attemptMove = true;
      }
      else if(this.cursors.down.isDown && this.attemptMove == false) 
      {
        this.scene.socket.emit('moveAttempt', 'down');
        this.attemptMove = true;
      }
      else if(!this.cursors.isDown && this.isMoving()) this.moveIntention = false;
    }
    else if(Number.isInteger(this.state) && this.state < 4 && this.attemptMove == false)
    {
      if(this.cursors.left.isDown)
      {
        this.attemptMove = true;
        this.scene.socket.emit('moveAttempt', 'left');
      }
      else if(this.cursors.right.isDown)
      {
        this.scene.socket.emit('moveAttempt', 'right');
        this.attemptMove = true;
      }
      else if(this.cursors.up.isDown) 
      {
        this.scene.socket.emit('moveAttempt', 'up');
        this.attemptMove = true;
      }
      else if(this.cursors.down.isDown) 
      {
        this.scene.socket.emit('moveAttempt', 'down');
        this.attemptMove = true;
      }
    }
  super.update(time, delta);
  }
}
