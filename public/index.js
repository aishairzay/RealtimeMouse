var socket = io();
var mice = {};
var mouseDown = false;
var myColor = getRandomColor();

//----------------------------------------------------------

newExcitingAlerts = (function () {
  var oldTitle = document.title;
  var msg = "User Connected!";
  var timeoutId;
  var blink = function() { document.title = document.title == msg ? ' ' : msg; };
  var clear = function() {
    clearInterval(timeoutId);
    document.title = oldTitle;
    window.onmousemove = null;
    timeoutId = null;
  };
  return function () {
    if (!timeoutId) {
      timeoutId = setInterval(blink, 1000);
      window.onmousemove = clear;
    }
  };
}());

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addNewPointToScreen(x, y, color){
  $(".canvas").append(
    $('<div></div>')
        .css('position', 'absolute')
        .css('top', y + 'px')
        .css('left', x + 'px')
        .css('width', 10)
        .css('height', 10)
        .css('background-color', color)
  );
}

//---------------------------------------------------------------

$("document").ready(function(e){
  $("#erase").click(function(){
    socket.emit('clear-page');
  });

  $(".canvas").mousemove(function(e) {
    if(mouseDown) {
      socket.emit('point', {x: e.pageX, y: e.pageY, color: myColor});
    }
  });

  $(".canvas").mousedown(function(e){
    mouseDown = true;
  });
  $(".canvas").mouseup(function(e) {
    mouseDown = false;
  });

});
//--------------------------------------------------------

socket.on('page-load', function(points){
  newExcitingAlerts();
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    addNewPointToScreen(p.x, p.y, p.color);
  }
});

socket.on('new-point', function(data){
  var x = data.x;
  var y = data.y;
  var color = data.color;
  addNewPointToScreen(x, y, color);
});

socket.on('erase', function() {
  $(".canvas").empty();
});

