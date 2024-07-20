const rulesBTN = document.getElementById('rulesBTN');
const closeBTN = document.getElementById('closeBTN');
const startBTN = document.getElementById('startBTN');
const pauseBTN = document.getElementById('pauseBTN')
const rules = document.getElementById('rules');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.display = 'none';

var list = [];
var rectsPerSpawn = 0;
var spawn;
var handle;
var pause = true;
var playing = false;

let time = 0;

// ball
const ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	size: 20,
	speed: 4,
	dx: 4,
	dy: -4
}

// paddle
const paddle = {
	x: canvas.width/2-60,
	y: canvas.height - 30,
	w: 120,
	h: 20,
	speed: 8,
	dx: 0
}

// draw the paddle on canvas
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fillStyle = '#21211E';
	ctx.fill();
	ctx.closePath();
}

// draw ball on canvas
function drawBall(){
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
	ctx.fillStyle = '#DCDC22';
	ctx.fill();
	ctx.closePath();
}

// draw score
function drawTime(){
	ctx.font = '20px Arial';
	ctx.fillText('Time: $time'.replace('$time', time), canvas.width - 100, 30);
}

// move ball
function moveBall(){
	ball.x += ball.dx;
	ball.y += ball.dy;
	
	// wall collision detection
	if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
		ball.dx *= -1;
	}
	if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
		ball.dy *= -1;
	}
	
	// paddle collision
	if((ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w || 
		ball.x + ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w ||
		ball.x - ball.size > paddle.x && ball.x - ball.size < paddle.x + paddle.w)
		&& ball.y + ball.size > paddle.y){
		ball.dy = -ball.speed;
	}
	
	// game over
	if(ball.y + ball.size > canvas.height){
		restartMenu();
	}
}

// move paddle
function movePaddle(){
	paddle.x += paddle.dx;
	
	// wall detection
	if(paddle.x + paddle.w > canvas.width){
		paddle.x = canvas.width - paddle.w;
	}
	if(paddle.x < 0){
		paddle.x = 0;
	}
}

// increase score
function showTime(){
	time++;
}

// restart game
function restartMenu(){
	document.querySelector('#startBTN').innerText = 'Restart';
	document.querySelector('#title').innerText = 'Game Over';
	canvas.style.display = 'none';
	startBTN.style.display = 'block';
	pauseBTN.style.visibility = 'hidden';
	document.getElementById("freqBomb").style.display='block';
	document.getElementById("speedBall").style.display='block';
	document.getElementById("speedBall").disabled=false;
	document.getElementById("freqBomb").disabled=false;
	document.getElementById("speedL").style.display='block';
	document.getElementById("speedL2").style.display='block';
	clearInterval(spawn);
	clearInterval(handle);
	clearInterval(tmp);
	time = 0;
	pause = false;
	playing = false;
	list.splice(0,list.length)
}

// keydown event 
function keyDown(e){
	if(e.key === 'Right' || e.key === 'ArrowRight'){
		paddle.dx = paddle.speed;
	}
	else if(e.key === 'Left' || e.key === 'ArrowLeft'){
		paddle.dx = -paddle.speed;
	}
	else if(e.key === 'Escape' && playing){
		pauseORrestart();
	}
}

// keyup event 
function keyUp(e){
	if(e.key === 'Right' || e.key === 'ArrowRight' 
	|| e.key === 'Left' || e.key === 'ArrowLeft'){
		paddle.dx = 0;
	}
}

var randomRectangle = function() {
	this.init = function() {
		this.speed = 5;
		this.x = Math.floor(Math.random() * 101) * 6;
		this.y = -50;
		this.w = 20;
		this.h = 50;
		this.col = "#82BFB5";
	}
	this.move = function() {
		this.y += this.speed;
		if (this.y >= 700){
			//list.splice(0, rectsPerSpawn + 1);
			const index = list.indexOf(this);
			list.splice(index, 1);
		}
	}

	this.draw = function(num) {
		draw.rectangles(this.x, this.y, this.w, this.h, this.col);
	}
};

function loop() {
  
	movePaddle();
	moveBall();
	
	draw.clear();
	
	// draw everything
	drawBall();
	drawPaddle();
	drawTime();

	// call the methods draw and move for each rectangle on the list
	for (var i=0; i<list.length; i++) {
		rec = list[i];
		if((rec.x > paddle.x && rec.x < paddle.x+paddle.w || rec.x+rec.w>paddle.x && rec.x+rec.w<paddle.x+paddle.w) 
			&& rec.y + rec.h > paddle.y && rec.y < paddle.y + paddle.h)
			restartMenu();
		rec.draw();
		rec.move();
	}
}

// spawn any number of new rects in a specific interval
function addRects(){
	for (var i=0; i<rectsPerSpawn; i++) {
		if (list.length < 100) {
			var rec = new randomRectangle();
			list.push(rec);
			rec.init();
		}
	}
}

var draw = {
	clear: function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	},
	rectangles: function (x, y, w, h, col) {
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
	}
}

function pauseORrestart(){
	if(pause === true){
		clearInterval(handle);
		pause = !pause;
		document.querySelector('#pauseBTN').innerText = 'Restart';
	}
	else{
		handle = setInterval('loop()', 25);
		pause = !pause;
		document.querySelector('#pauseBTN').innerText = 'Pause';
	}
}


function startGame(){
	startBTN.style.display = 'none';
	pauseBTN.style.visibility = 'visible';
	document.querySelector('#title').innerText = 'blocks vs. ball';
	document.getElementById("freqBomb").style.display='none';
	document.getElementById("speedBall").style.display='none';
	document.getElementById("speedBall").disabled=true;
	document.getElementById("freqBomb").disabled=true;
	document.getElementById("speedL").style.display='none';
	document.getElementById("speedL2").style.display='none';
	var val2 = document.getElementById("freqBomb").selectedIndex;
	var val1 = document.getElementById("speedBall").selectedIndex;
	
	switch (val2) {
		case 0:
			rectsPerSpawn = 1;
			break;
		case 1:
			rectsPerSpawn = 2;
			break;
		case 2:
			rectsPerSpawn = 3;
			break;
	}	
	
	switch (val1) {
		case 0:
			ball.dx = 2;
			ball.dy = -2;
			ball.speed = 2;
			break;
		case 1:
			ball.dx = 4;
			ball.dy = -4;
			ball.speed = 4;
			break;
		case 2:
			ball.dx = 6;
			ball.dy = -6;
			ball.speed = 6;
			break;
	}
	
	pause = true;
	playing = true;
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;
	canvas.style.display = 'block';
	spawn = setInterval('addRects()', 1000);
	tmp = setInterval('showTime()', 1000 );
	handle = setInterval('loop()', 25);
}

// keyboard event hadlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// event handlers
rulesBTN.addEventListener("click", () => rules.classList.add("show"));
closeBTN.addEventListener("click", () => rules.classList.remove('show'));
startBTN.addEventListener("click", () => startGame());
pauseBTN.addEventListener("click", () => pauseORrestart());
