var socket = io();
var mice = {};

$("document").ready(function(e){
  $("body").mousemove(function(e) {
    socket.emit('mouse-movement', {x: e.pageX, y: e.pageY});
  });
  $("body").click(function(e) {
    socket.emit('mouse-movement', {x: e.pageX, y: e.pageY});
  });
});

socket.on('update-client-mouse', function(data){
  if(mice[data.socket] == undefined) {
    mice[data.socket] = true;
    var z = 2;
    var pic = 'GoodDarkMousePointer.gif';
    if(data.socket == socket.id) {
      pic = 'GoodRedMousePointer.gif';
      z = 1;
    }
    else{
      newExcitingAlerts();
    }
    $("body").append('<img src="' + pic + '" height="15" width="15" id=' + data.socket + ' style="{position:absolute;z-index:' + z + ';}"></img>');
  }
  $('#' + data.socket).css({'position': 'absolute','left' : data.x + 'px', 'top' : data.y + 'px'});
});

socket.on('remove-client-mouse', function(socketId){
  $('#' + socketId).remove();
  delete mice[socketId];
});

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
