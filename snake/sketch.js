let labels = ['new', 'beginner', 'intermediate', 'expert', 'message', 'timer', 'score'];
let master;
let board;
let snake;

let food;

// Keep track of the time it is now, so than when certain time has passed,
// the snake's position can be updated. If not, it is updated every frame and
// makes the game impossible to play
let start = new Date();


// p5js specific functions
function setup() {
	createCanvas(800, 900);

	// Initialize all the objects
	master = new Master();
	board = new Board();
	snake = new Snake();
}

function draw() {
	background(200);

	master.update();
	master.display();
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		snake.dir.update(1, 0);
	}
	else if (keyCode === LEFT_ARROW) {
		snake.dir.update(-1, 0);
	}
	else if (keyCode === UP_ARROW) {
		snake.dir.update(0, -1);
	}
	else if (keyCode === DOWN_ARROW) {
		snake.dir.update(0, 1);
	}
}
function mousePressed() {
	board.checkButtons(mouseX, mouseY);
}

function updateSnake() {
	let now = new Date();
	let diff = now - start;
	if (diff > snake.ellapse) {
		// A sufficient time has ellapsed, so update the snake and change
		// the start variable
		snake.update();
		start = new Date();
	}
}

class Master {
	// This class controls the whole game
	constructor() {
		this.playing = false;
		this.score = 0;
		this.timerShow = false;
		this.timer = 0;
		this.level = 'Beginner';
	}

	update() {
		if (this.playing) {
			updateSnake();
			snake.checkEdge();
		}
	}

	display() {
		// Displays all the elements in the canvas
		if (this.playing) {
			snake.display();
		}
		board.display();
	}

	newGame(label) {
		// Receives a string and starts a new game with the appropriate level
		// of difficulty
		this.playing = true;
		snake = new Snake(label);
	}
}

class Board {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.xsize = width;
		this.ysize = 100;

		// This is the number of buttons
		this.length = labels.length;
		this.buttons = [];

		for (let i = 0, n = labels.length; i < n ; i++) {
			let newButton = new Button(labels[i]);
			this.buttons.push(newButton);
		}
	}

	display() {
		// Draws a background and calls the drawing of each button
		stroke(0);
		line(0, 100, width, 100);
		for (let i = 0; i < this.length; i++) {
			this.buttons[i].draw();
		}
	}

	checkButtons(mx, my) {
		// Receives the mouse location and decides which button
		for (let i = 0; i < this.length; i++) {
			if (this.buttons[i].isClicked(mx, my)) {
				this.buttons[i].whenClicked();
				return;
			}
		}
	}
}

class Button {
	// A button has a position, a size, a text and a color
	constructor(label) {
		this.label = label;
		if (label == 'new') {
			this.x = 0;
			this.y = 0;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'New Game: ';
			this.color = 'none';
			this.buttonShow = true;
		}
		else if (label == 'beginner') {
			this.x = width / 4;
			this.y = 0;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'Beginner';
			this.color = 'green';
			this.buttonShow = true;
		}
		else if (label == 'intermediate') {
			this.x = width / 2;
			this.y = 0;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'Intermediate';
			this.color = 'yellow';
			this.buttonShow = true;
		}
		else if (label == 'expert') {
			this.x = 3 * width / 4;
			this.y = 0;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'Expert';
			this.color = 'red';
			this.buttonShow = true;
		}
		else if (label == 'message') {
			this.x = 0;
			this.y = 50;
			this.xsize = width / 2;
			this.ysize = 50;
			this.text = 'Select level of difficulty';
			this.color = 'none';
			this.buttonShow = true;
		}
		else if (label == 'timer') {
			this.x = width / 2;
			this.y = 50;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'Timer: ';
			this.color = 'none';
			this.buttonShow = false;
		}
		else if (label == 'score') {
			this.x = 3 * width / 4;
			this.y = 50;
			this.xsize = width / 4;
			this.ysize = 50;
			this.text = 'Score: 0';
			this.color = 'none';
			this.buttonShow = true;
		}
	}

	draw() {
		// Draw the button
		if (this.buttonShow == true) {
			noStroke();
			// Only in this case draw the button
			if (this.color != 'none') {
				// If it has color, set a background different from the default grey
				if (this.color == 'green') {
					fill(0, 255, 0);
				}
				else if (this.color == 'yellow') {
					fill(255, 255, 0);
				}
				else if (this.color == 'red') {
					fill(255, 0, 0);
				}
				rect(this.x, this.y, this.xsize, this.ysize);
			}
			fill(0);
			textAlign(CENTER);
	    textSize(16);
	    textStyle(BOLD);
			text(this.text, this.x + this.xsize / 2, this.y + this.ysize * (2/3));
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the button has been clicked
		let relevant = this.label == 'beginner' || this.label == 'intermediate' || this.label == 'expert';
		let xClicked = this.x < mx && mx < this.x + this.xsize;
		let yClicked = this.y < my && my < this.y + this.ysize;
		return relevant && xClicked && yClicked;
	}

	whenClicked() {
		// The button has been clicked, so do something
		master.newGame(this.label);
	}
}


class Snake {
	constructor(label) {
		// Receives a label (a level of difficulty) and starts a snake with that
		// level of difficulty
		if (label == 'beginner') {
			this.ellapse = 1000;
		}
		else if (label == 'intermediate') {
			this.ellapse = 500;
		}
		if (label == 'expert') {
			this.ellapse = 250;
		}

		this.body = [];
		for (let i = 0; i < 3; i++) {
			let element = new SnakeElement(width / 2 - i * 40, 100 + (height - 100) / 2);
			this.body.push(element);
		}

		// Initialize the direction the snake is moving
		this.dir = new Direction(1, 0);

		// Keep track of the size of each element
		this.size = 40;
	}

	update() {
		// The n-th element has to get the position of the (n-1)-th element
		for (let i = this.body.length - 1; i > 0 ; i--) {
			this.body[i].setEqual(this.body[i - 1]);
		}

		// Finally, the head of the snake has to be updated according to
		// the direction it is moving
		this.body[0].move(this.dir);
	}

	display() {
		for (let i = 0, n = this.body.length; i < n; i++) {
			this.body[i].draw();
		}
	}

	checkEdge() {
		// Checks if the head of the snake has reached the edge and
		// if so, updates its position
		if (this.body[0].x > width - this.size) {
			this.body[0].x = 0;
		}
		else if (this.body[0].x < 0) {
			this.body[0].x = width - this.size;
		}
		else if (this.body[0].y > height - this.size) {
			this.body[0].y = 100;
		}
		else if (this.body[0].y < 100) {
			this.body[0].y = height - this.size;
		}
	}
}

class SnakeElement {
	// Each of the squares will be a snake element and, when it is created,
	// the position is passed to the constructor function
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 40;
	}

	move(dir) {
		// Receives an object of type Direction and updates the position of
		// the snake element
		this.x = this.x + 40 * dir.x;
		this.y = this.y + 40 * dir.y;
	}

	draw() {
		// Draws the element in black
		fill(0);
		stroke(255);
		rect(this.x, this.y, this.size, this.size);
	}

	setEqual(element) {
		// Gets a snake element and gets the position that element has
		this.x = element.x;
		this.y = element.y;
	}
}

class Direction {
	// This is just a tuple of two values, which can only be a 1 or a 0
	constructor(xdir, ydir) {
		this.x = xdir;
		this.y = ydir;
	}

	update(xdir, ydir) {
		// Receives values for direction and updates the direction if allowed
		if (this.x != xdir && this.y != ydir) {
			// Only in this case, update the direction
			this.x = xdir;
			this.y = ydir;
		}
	}
}

class Food {
	constructor() {
		// Creates a new food item in some place where there is no snake
		do {
			let x = Math.random()
		}
		while ()
	}
}
