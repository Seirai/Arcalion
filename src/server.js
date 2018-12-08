/**
 *  @author     Seirai <seilaizh@gmail.com>
 *  server.js
 *  The server which will run collision logic for server-authoritative movement.
 *
 */
const logic = require('./systems/serverlogic');
const io = require('socket.io').listen(8081);


io.sockets.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);
});
