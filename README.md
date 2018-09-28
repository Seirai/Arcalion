# Project Arcalion
A rather ambitious project to create a multiplayer, turn-based RPG. It will
likely feature permadeath and (in the RP-centric variant of the game) also
a power distribution system that is centralized around RP.

### Milestones:
1. Movement System (done)
2. Menu/UI
3. Combat system
4. Multiplayer
5. Skills/progression
6. RP-systems

### To-do list:
- Import UI/buttons for the menu. (optional methodology: create a start menu/boot scene and use these buttons)
- Create Button class that utilizes the images for button states (one to select,
  one deselect and one unavailable)
- Create Menu class (this will hold the buttons, have a border created out of
  the imported UI images and maybe also a suitable background fill)
- Create HealthBar class that will implement an object that will track a Mob
or player's health and scale accordingly to it. HP differences and drops will play
a smooth animation.
- Event listeners to open a menu with buttons depending on the context of the click
- [Tie-in to the combat system] A "initiate combat" button that's available when
selecting a mob
