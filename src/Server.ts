var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8080);


app.use(express.static(__dirname));



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('tileSwap', function(grid:string[][])
  {
    console.log(grid);
    
    socket.broadcast.emit('gridUpdate',grid);
  })
});

function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
      var player = io.sockets.connected[socketID].player;
      if(player) players.push(player);
  });
  return players;
}