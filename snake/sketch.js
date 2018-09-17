let snake;
let dir = 1;

function setup() {
	createCanvas(800, 600);

	// create an array of possible x and y positions for the snake
	snake = new Snake();
}



function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		dir = 1;
	}
	else if (keyCode === LEFT_ARROW) {
		dir = -1;
	}
	/*
	else if (keyCode === UP_ARROW) {
		dir = 2;
	}
	else if (keyCode === DOWN_ARROW) {
		dir = 3;
	}
	*/
}

function draw() {
	background(150);

	console.log(dir);

	snake.update();
	fill(0);
	snake.draw();
}

class Snake {
	constructor() {
		this.body = [];
		this.body[0] = new SnakeElement(40, 40);

	}

	update() {
		// update following a cartesian coordinate system
		// this.body[0].x = this.body[0].x + dir[0];
		// this.body[0].y = this.body[0].y + dir[1];
	}

	draw() {
		rect(this.body[0].x, height - this.body[0].y, 20, 20);
	}
}

class SnakeElement {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
