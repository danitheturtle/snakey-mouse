require('env');
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import router from './router';
//Game Modules
// import utils from './js/utils';
// import game from './server/js/game';
//Express app
let app = express();
//HTTP servver
let server = http.createServer(app);
//Socket server
let io = new Server(server);

//Hook in the app router
app.use(router);

app.use(express.static(path.resolve(__dirname, "../../dist/web")))

//On a new player connection
io.on('connection', (socket) => {
  console.dir("Player logged in");
  //Bind createNewPlayer for when the client requests a player
  // socket.on('createNewPlayer', () => {
  //   //Add a new player to the game and store the ID on this socket
  //   socket.playerID = game.addNewPlayer(socket);
  // 
  //   //Listen to player updates from the client
  //   socket.on('updatePlayer', (data) => {
  //     game.updatePlayerFromClient(socket, data);
  //   });
  // 
  //   //Listen for new attackers
  //   socket.on('tagPlayer', (id) => {
  //     game.declareNewAttacker(id);
  //   });
  // 
  //   //Only bind disconnect if the player was created in the first place
  //   //Disconnect the player
  //   socket.on('disconnect', () => {
  //     game.disconnectPlayer(socket.playerID);
  //   });
  // });
});

//Select the port from an environment variable or default to 8000
//This is needed for Heroku
let port = process.env.SERVER_PORT || 8000;

//Start the server listening on this port
server.listen(port, () => {
  console.log("Server listening on " + server.address().port);
  //Initialize the game.  Pass in our socket server instance
  // game.init(io);
  // //Start the game loop
  // game.updateGame();
  // //Start the network loop
  // game.updateNetwork();
});
