<<<<<<< HEAD
/**
 *  @author     Seirai <seilaizh@gmail.com>
 *  server.js
 *  The server which will run collision logic for server-authoritative movement.
 *
 */
const logic = require('./systems/serverlogic');
const io = require('socket.io').listen(8081);

game = logic;

io.sockets.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);
});
=======
import * as Matter from 'matter-js';

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create();

let player1 = Bodies.rectangle(100,100, 50,50),
    player2 = Bodies.rectangle(50, 100, 50,50),
    ground = Bodies.rectangle(0, 10, 100, 1);

World.add(engine.world, [player1, player2, ground]);

Engine.run(engine);


>>>>>>> 8fd2498... Imolementing matter-js headless server
