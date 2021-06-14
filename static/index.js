var canvas = document.createElement('canvas');
canvas.style.backgroundColor = "#383836";
canvas.id = 'canvas';
document.body.appendChild(canvas);

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);
document.addEventListener('mouseup', drawingArrayStatus);

drawingArray = [];

function drawingArrayStatus(e) {
  // console.log(drawingArray.length);
  drawingArrayString = JSON.stringify(drawingArray);
  // console.log(drawingArrayString)
  socket.emit('mouse position', drawingArrayString);
  drawingArray = [];
}

// new position from mouse event
function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}

// resize canvas
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}


var socket = io();

// var messages = document.getElementById('messages');
// var form = document.getElementById('form');
// var message = document.getElementById('message');

// form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if(message.value) {
//         socket.emit('chat message', message.value);
//         message.value = '';
//     }
// });
function draw_received(beginPos, endPos) {
  ctx.lineWidth = beginPos.lineWidth;
  ctx.lineCap = beginPos.lineCap;
  ctx.strokeStyle = beginPos.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(beginPos.x, beginPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.stroke();
}
socket.on('mouse position', function(mousePosArrayString) {
    // var item = document.createElement('div');
    // item.textContent = msg;
    // messages.appendChild(item);
    // console.log(mousePosArrayString)
    mousePosArray = JSON.parse(mousePosArrayString);
    // console.log(mousePosArray)
    for (var i = 0; i < mousePosArray.length - 1; i++) {
      // console.log(mousePosArray[i]);
      draw_received(mousePosArray[i], mousePosArray[i + 1]);
    }
});

// form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (input.value) {
//         socket.emit('chat message', input.value);
//         input.value = '';
//     }
// });

// socket.on('chat message', function(msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });


function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'cyan';

  // socket.emit('mouse position', pos);  

  drawingArray.push({x: pos.x, y: pos.y, lineWidth: 5, lineCap: 'round', strokeStyle: 'cyan'});
  // console.log(drawingArray[drawingArray.length - 1].x + " " + drawingArray[drawingArray.length - 1].y);
  
  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
  // socket.emit('mouse position', pos);
}

// Send canvas info


