var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('someone connected: ' + socket.id);

  io.emit('update-client-mouse', {socket: socket.id, x:'50%', y:'50%'});

  socket.on('mouse-movement', function(MouseData){
    io.emit('update-client-mouse', {socket: socket.id, x:MouseData.x, y:MouseData.y});
  });

  socket.on('disconnect', function(){
    io.emit('remove-client-mouse', socket.id);
  });

});


http.listen(8080, function(){
  console.log('listening on *:8080');
});
