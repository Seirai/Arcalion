/**
 * @author      Seirai  <seilaizh@gmail.com>
 * Anims.js
 * Animations will be defined here for the scene.
 */


export function createAnimations(scene)
{
  const anims = scene.anims;
    anims.create({
      key: "testwalkwest_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalkwest_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 6,
      repeat: -1
    });
    anims.create({
      key: "testwalkeast_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalkeast_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 6,
      repeat: -1
    });
    anims.create({
      key: "testwalksouth_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalksouth_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 6,
      repeat: -1
    });
    anims.create({
      key: "testwalknorth_",
      frames: anims.generateFrameNames("atlas", { prefix: "testwalknorth_", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 6,
      repeat: -1
    });
};
