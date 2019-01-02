/**
 *  @author      Seirai <seilaizh@gmail.com>
 *  Map.js
 *  This is where the map will be created for the main gameScene.
 */

export function createMap(scene)
{
  scene.map = scene.make.tilemap({ key : 'map' });
  scene.tileset = [scene.map.addTilesetImage('grassdirtstone1', 'tile1')];
  scene.tileset.push(scene.map.addTilesetImage('grassmountain1', 'tile2'));

  scene.tileLayer1 = scene.map.createStaticLayer(0, scene.tileset, 0, 0);
  scene.tileLayer2 = scene.map.createStaticLayer(1, scene.tileset, 0, 0);
  scene.tileLayer3 = scene.map.createStaticLayer(2, scene.tileset, 0, 0);
};
