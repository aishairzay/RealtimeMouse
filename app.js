var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var allPoints = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('someone connected: ' + socket.id);

  io.emit('page-load', allPoints);

  io.emit('update-client-mouse', {socket: socket.id, x:'50%', y:'50%'});

  socket.on('point', function(data){
    io.emit('new-point', data);
    allPoints.push(data);
  });

  socket.on('clear-page', function(){
    io.emit('erase');
    allPoints = [];
  });

});


http.listen(8080, function(){
  console.log('listening on *:8080');
});
