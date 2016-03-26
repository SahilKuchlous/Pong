// Set up canvas
var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");

// Variable for framerate
var framerate = 10;

// Variable for paddle length
var paddleLength = 80;

// Variable for ball speed
var ballSpeed = 1;

// Variable for ball size
var ballSize = 10;

// Draw a rectangle
var drawRect = function (x, y, l, b, color) {
	cxt.fillStyle = color;
	cxt.fillRect(x, y, l, b);
};

// Draw a circle
var drawCircle  = function (x, y, radius, fillCircle, color) {
	cxt.beginPath();
	cxt.arc(x, y, radius, 0, Math.PI * 2, false);
	cxt.fillStyle = color;
	if (fillCircle) {
		cxt.fill();
	} else {
		cxt.stroke();
	};
};

// The Paddle constructor
var Paddle = function (x, y, length, width, direction) {
	this.x = x;
	this.y = y;
	this.length = length;		
	this.width = width;
	this.direction = direction;
};

// Draw a rectangle at the paddle's position
Paddle.prototype.draw = function () {
	drawRect(this.x, this.y, this.length, this.width, "Black");
};

// Update direction
Paddle.prototype.setDirection = function (direction) {
	this.direction = direction;
};

// Move the paddle
Paddle.prototype.move = function () {
	if (this.x > 0 && this.x < canvas.width - this.length) {
		if (this.direction == "left") {
			this.x --;
		} else if (this.direction == "right") {
			this.x ++;
		}
	} else {
		if (this.x <= 0) {
			this.x ++;
		} else if (this.x >= canvas.width - this.length) {
			this.x --;
		}
	}
};

// Check if the ball hit the paddle
Paddle.prototype.bounce = function (ball) {
	if ((this.x + this.length >= ball.x - ball.size && ball.x + ball.size >= this.x) && (ball.y + ball.size >= canvas.height - this.width)) {
		ball.theta = (2 * Math.PI) - ball.theta;
	};
};

// The Ball constructor
var Ball = function (x, y, ballSize, theta, ballSpeed) {
	this.x = x;
	this.y = y;	
	this.size = ballSize;
	this.theta = theta;
	this.speed = ballSpeed
};

// Draw a circle at the ball's position
Ball.prototype.draw = function () {
	drawCircle(this.x, this.y, this.size, true, "Red");
};

// Move the ball in the correct direction
Ball.prototype.move = function () {
	this.x = this.x + (this.speed * Math.cos(this.theta));
	this.y = this.y + (this.speed * Math.sin(this.theta));
};

// Bounce the ball of the wall or paddle
Ball.prototype.bounce = function () {
	if ((this.size >= this.x || this.x >= canvas.height - this.size) && (this.size >= this.y || this.y >= canvas.width - this.size)) {
		this.theta = Math.PI * (Math.random() * 2)
	} else if (this.size >= this.y || this.y >= canvas.width - this.size) {
		this.theta = (2 * Math.PI) - this.theta;
	} else if (this.size >= this.x || this.x >= canvas.height - this.size) {
		this.theta = Math.PI - this.theta;
	}
};


// Convert keycodes to directions to move the paddle
var directions = {
	37: "left",
	39: "right",
};

var direction;

// The keydown handler for handling direction key presses
$("body").keydown(function (event) {
	direction = directions[event.keyCode];
	paddle.setDirection(direction);
});

// Create a paddle object
paddle = new Paddle(canvas.width / 2 - paddleLength / 2, canvas.height - 10, paddleLength, 10, direction);

// Create a ball object
ball = new Ball(canvas.width / 2, canvas.height / 2, ballSize, (1/3) * Math.PI, ballSpeed);

// Create an interval ID
var intervalId;

// Pass the animation function to setInterval
intervalId = setInterval(function () {

	cxt.clearRect(0, 0, canvas.width, canvas.height);
	paddle.draw();
	ball.draw();
	paddle.move();
	ball.move();
	ball.bounce();
	paddle.bounce(ball);

}, framerate);