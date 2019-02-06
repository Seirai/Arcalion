/*  loadScene.js
 *  @author   Seirai  <seilaizh@gmail.com>
 *
 *  Loading of all assets and a loadbar.
 * 
 */

export class loadScene extends Phaser.Scene
{
  constructor()
  {
    super({key: 'loadScene' });
  }
  init()
  {

  }

  preload()
  {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
    this.load.image('tile1', '../assets/tilesets/grassdirtstonemin.png');
    this.load.image('tile2', '../assets/tilesets/grassmountainmin.png');
    this.load.tilemapTiledJSON('map', '../assets/maps/testmap1.json');
    this.load.atlas('atlas', '../assets/atlas/dgraymanjr/dgraymanjr.png', '../assets/atlas/dgraymanjr.json');
    this.load.atlas('buttons', '../assets/ui/button.png', '../assets/ui/button_atlas.json');
    this.load.image('skillcard_sword', '../assets/ui/skillcards/sword.png');
    this.load.audio('titleTheme', '../assets/sound/title_theme.mp3');
    this.load.audio('prologueTheme', '../assets/sound/prologue_theme.mp3');
    
    //title
    this.load.image('start_screen_splash', '../assets/title/start_screen_splash.jpg');
    this.load.image('project_arcalion_logo', '../assets/title/project_arcalion_logo.png');
    this.load.image('startgame_button', '../assets/title/startgame_button.png');
    this.load.image('tilted_studios_logo', '../assets/title/tilted_studios_logo.png');

    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    });

    this.load.on('progress', (percent) => {
      loadingBar.fillRect(this.game.renderer.width/5, this.game.renderer.height/2, this.game.renderer.width/2 * percent, 50);
    });
  }

  create()
  {
    this.scene.start('titleScene');
  }


}
