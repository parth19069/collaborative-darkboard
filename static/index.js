var currentLineWidth = 5;
var currentLineCap = 'round';
var currentStrokeStyle = 'red';
var isEraser = false;
var isPen = false;
var eraserRadius = 70;
var penRadius = 10;
var eraserIconWidth = eraserRadius;
var eraserIconHeight = eraserRadius;
var penSize = document.getElementById('penSize');
var eraserSize = document.getElementById('eraserSize');

// var canvas = document.createElement('canvas');
var canvas = document.getElementById('canvas');
var colorPicker = document.getElementById('color-picker');
var clearer = document.getElementById('clearer');
var eraser = document.getElementById('eraser');
var eraserIcon = document.getElementById('eraserIcon');
var pen = document.getElementById('pen');

eraserIcon.style.width = eraserIconWidth + 'px';
eraserIcon.style.height = eraserIconHeight + 'px';

colorPicker.value = '#FFFFFF';
canvas.style.backgroundColor = "#383836";
canvas.cursor = 'crosshair';

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);
document.addEventListener('mouseup', drawingArrayStatus);
colorPicker.addEventListener('click', colorPick);
clearer.addEventListener('click', clear);
eraser.addEventListener('mousedown', erase);
pen.addEventListener('click', startPen);


drawingArray = [];


function colorPick(e) {
	// eraserIcon.style.display = "none";
}

function clear(e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	socket.emit('clear');
}

function erase(e) {
	isEraser = true;
	isPen = true;
	eraserIcon.style.display = "block";
	var width = eraserSize.value;
	if(width == '') {
		width = '0';
	}
	width = parseInt(width);
	eraserIconWidth = width;
	eraserIconHeight = width;
	eraserIcon.style.width = width + 'px';
	eraserIcon.style.height = width + 'px'; 
}

function startPen(e) {
	isPen = true;
	isEraser = false;
	eraserIcon.style.display = "none";
}

function drawingArrayStatus(e) {
	drawingArrayString = JSON.stringify(drawingArray);
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
socket.on('clear', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});
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
	mousePosArray = JSON.parse(mousePosArrayString);
	for (var i = 0; i < mousePosArray.length - 1; i++) {
		draw_received(mousePosArray[i], mousePosArray[i + 1]);
	}
});




function draw(e) {

	var mouse_x = e.clientX;
	var mouse_y = e.clientY;

	var eraser_x = mouse_x - (eraserIconWidth / 2);
	var eraser_y = mouse_y - (eraserIconHeight / 2);

	eraserIcon.style.left = eraser_x + 'px';
	eraserIcon.style.top = eraser_y + 'px';

	// console.log(eraser_x + ' ' + eraser_y);

	// mouse left button must be pressed
	if (e.buttons !== 1 || !isPen) return;
	
	ctx.beginPath(); // begin
	
	if(!isEraser) {
		var width = penSize.value;
		if(width == '') {
			width = '0';
		}
		width = parseInt(width);
		currentStrokeStyle = colorPicker.value;
		currentLineWidth = width;
		currentLineCap = 'round';
		ctx.lineWidth = currentLineWidth;
		ctx.lineCap = currentLineCap;
		ctx.strokeStyle = currentStrokeStyle;
	} else {
		var width = eraserSize.value;
		if(width == '') {
			width = '0';
		}
		width = parseInt(width);
		currentStrokeStyle = '#383836';
		currentLineWidth = width;
		currentLineCap = 'round';
		ctx.lineWidth = currentLineWidth;
		ctx.lineCap = currentLineCap;
		ctx.strokeStyle = currentStrokeStyle;
	}
	

	
	drawingArray.push({x: pos.x, y: pos.y, lineWidth: currentLineWidth, lineCap: currentLineCap, strokeStyle: currentStrokeStyle});
	
	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to
	
	ctx.stroke(); // draw it!
}

// Send canvas info


