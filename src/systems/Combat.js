/**
 *  @author      Seirai <seilaizh@gmail.com>
 *  Combat.js
 *  We'll be implementing the combat system here.
 */

export let initiateCombat = (pointer, mobKey) =>
{
  if(pointer.leftButtonDown())
  {
    let sceneChildren = pointer.camera.scene.children.getChildren();
    let player;
    let mob;
    sceneChildren.forEach(function(entry)
    {
      if(entry.key == "player") player = entry;
      if(entry.key == mobKey) mob = entry;
    })
    player.inCombat = true;
    if(player.isMoving())
    {
      player.moveIntention = false;
      player.stopMovement();
      player.syncDestination();
    }
    //this.mob.inCobmat = true;
    //this.mob.moveIntention = false;
    //this.mob.stopMovement();
    //this.mob.syncDestination();
    //return mainCombatLoop(player, this.mob);
  }
}

let mainCombatLoop = (player, mob, turn) =>
{
  let currentTurn;
  let turnOrderedCombatants = [];
  if(turn == null) currentTurn = 0;
  //Turn order array
  //Sort an array by speed and place it into the array-- or, for now, just compare player and mobMenu
  if(player.speed > mob.speed)
  {
    turnOrderedCombatants.push(player);
    turnOrderedCombatants.push(mob);
  }
  else
  {
    turnOrderedCombatants.push(mob);
    turnOrderedCombatants.push(player);
  }


}

let openCombatMenu = (mob, turnOrderedCombatants) =>
{
  if(mob.key == player)
  {
    console.log("create menu here");
  }
}
