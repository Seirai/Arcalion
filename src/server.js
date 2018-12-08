/**
 *  @author     Seirai <seilaizh@gmail.com>
 *  server.js
 *  The server which will run logic to make it authoritative.
 *
 */
const logic = require('./systems/serverlogic');
const io = require('socket.io').listen(8081);

class player
{
  constructor(id, x, y, stats)
  {
    if(x==null)this.x = 2;
    else this.x = x;
    if(y==null)this.y = 2;
    else this.y = y;

    if(stats==null)
    {
      this.strength = 10;
      this.agility = 10;
      this.constitution = 10;
      this.speed = 2;
    }
  }
};

////////////////Testing block
// A
//


//
//  End of testing block
////////////////

let players = []; //Player and mob containers.
let mobs = [];
let rawMap =  //Pseudo-map for testing for now. Will parse from actual tiled export .json later.
  {
    width: 12,
    height: 12,
    tileHeight: 32,
    tileWidth: 32
  }
let map = [];


//On connection event
io.sockets.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);
  let newPlayer = new player(socket.id);
  players.push(newPlayer);

  //socket.broadcast.emit sends to all clients except this current socket that there's a new player.
  socket.broadcast.emit('playerLogin', newPlayer);

  //socket.emit sends to the current socket (newly connected player) information
  //we will need to send the newly logged in player all the information they need here.
  socket.emit('onLogin', players);


//Disconnection event
  socket.on('disconnect', () => 
    {
      //Remove a player from server-side by the disconnected socket.id
      let removeIndex = players.findIndex(plyr => plyr.id === socket.id);
      socket.broadcast.emit('playerDisconnect', removeIndex);

      players.splice(removeIndex, 1);
      console.log(`Client disconnected ${socket.id}, removed player`);
    });
});
