<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7c401e8... Merge-commit
/**
 *  @author     Seirai <seilaizh@gmail.com>
 *  server.js
 *  The server which will run collision logic for server-authoritative movement.
 *
 */
<<<<<<< HEAD
<<<<<<< HEAD
const logic = require('./systems/serverlogic');
const io = require('socket.io').listen(8081);

game = logic;

io.sockets.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);
});
=======
import * as Matter from 'matter-js';
=======
var io = require('socket.io').listen(8081);
>>>>>>> 1ad4a55... Pushing for testing on main rig
=======

=======
const logic = require('./systems/serverlogic');
>>>>>>> d0f4b0d... Server logic update
const io = require('socket.io').listen(8081);
>>>>>>> 7c401e8... Merge-commit

game = logic;

<<<<<<< HEAD
>>>>>>> 8fd2498... Imolementing matter-js headless server
=======
io.sockets.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);
});
>>>>>>> 1ad4a55... Pushing for testing on main rig
