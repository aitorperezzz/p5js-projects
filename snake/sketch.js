let size = 40;
let labels = ['new', 'beginner', 'intermediate', 'expert', 'message', 'timer', 'score'];
let master;
let board;
let arena;
let snake;


// p5js specific functions
function setup() {
	createCanvas(800, 900);

	// Initialize all the objects
	master = new Master();
	board = new Board();
	arena = new Arena();
	snake = new Snake();

	arena.createFood();
}

function draw() {
	background(200);

	master.update();
	master.display();
}

function keyPressed() {
	// If the player has lost, dont allow any keyboard interaction
	if (!master.lost) {
		if (!master.paused) {
			// If the game is not paused, the player can update the direction
			if (keyCode === RIGHT_ARROW) {
				master.dir.update(1, 0);
			}
			else if (keyCode === LEFT_ARROW) {
				master.dir.update(-1, 0);
			}
			else if (keyCode === UP_ARROW) {
				master.dir.update(0, -1);
			}
			else if (keyCode === DOWN_ARROW) {
				master.dir.update(0, 1);
			}
		}
		if (key === ' ') {
			if (master.paused) {
				master.paused = false;
				board.changeMessage('Press SPACEBAR to pause');
			}
			else {
				master.paused = true;
				board.changeMessage('Press SPACEBAR to continue');
			}
		}
	}
}

function mousePressed() {
	board.checkButtons(mouseX, mouseY);
}


class Master {
	// This class controls the game
	constructor() {
		// Variables for the workflow of the game
		this.dir = new Direction(1, 0);

		this.score;
		//this.timer = 0;

		this.level = 'Beginner';
		this.start = new Date();
		this.waitFor = 400;

		this.paused = true;
		this.lost = false;
	}

	update() {
		// If the game is not paused and the time ellapsed is correct according to
		// the level, then call update on snake and update the score
		if (!this.paused) {
			if (this.waitedEnough()) {
				this.start = new Date();
				snake.update();
			}
		}
		this.score = snake.body.length;
	}

	waitedEnough() {
		// Checks if the time ellapsed is enough.
		let now = new Date();
		if ((now - this.start) > this.waitFor) {
			return true;
		}
		return false;
	}

	display() {
		// Displays all the elements in the canvas
		board.display();
		arena.display();
	}

	newGame(label) {
		// Receives a string and starts a new game with the appropriate level
		// of difficulty
		snake = new Snake();
		this.dir = new Direction(1, 0);
		this.paused = true;
		this.lost = false;
		arena.createFood();
		board.changeMessage('Press SPACEBAR to start');
		this.level = label;
		if (label == 'beginner') {
			this.waitFor = 400;
		}
		else if (label == 'intermediate') {
			this.waitFor = 200;
		}
		if (label == 'expert') {
			this.waitFor = 100;
		}
	}

	endGame() {
		this.lost = true;
		this.paused = true;
		board.changeMessage('You lost. Please select level');
	}
}

class Board {
	// Handles the display of buttons on top of the canvas
	constructor() {
		// The number of buttons is as specified in labels array
		this.length = labels.length;
		this.buttons = [];

		// Fill the buttons array with Button elements
		for (let i = 0; i < this.length; i++) {
			let newButton = new Button(labels[i]);
			this.buttons.push(newButton);
		}
	}

	display() {
		// Draws a line that separates board from arena and then calls the drawing
		// of each button
		stroke(0);
		line(0, 100, width, 100);
		for (let i = 0; i < this.length; i++) {
			this.buttons[i].draw();
		}
	}

	checkButtons(mx, my) {
		// Receives the mouse location and decides which button has been clicked
		// and calls it
		for (let i = 0; i < this.length; i++) {
			if (this.buttons[i].isClicked(mx, my)) {
				this.buttons[i].whenClicked();
				return;
			}
		}
	}

	changeMessage(text) {
		// Receives some text and changes the message displayed in the
		// appropriate button
		this.buttons[4].text = text;
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
			this.text = 'Press SPACEBAR to start';
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
			// Only in this case draw the button (the timer is now always displayed)
			noStroke();
			if (this.color != 'none') {
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
			if (this.label == 'score') {
				this.text = 'Score: ' + master.score;
			}
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

class Arena {
	// This has the grid of squares and keeps information about them
	constructor() {
		// Keeps track of the number of squares in the grid and also the food
		this.size = size;
		this.xnum = Math.floor(width / this.size);
		this.ynum = Math.floor((height - 100) / this.size);
		this.food;
	}

	createFood() {
		// Creates a square of food in a location not occupied by the snake
		let newFood;
		do {
			newFood = new Square(Math.floor(Math.random() * this.xnum), Math.floor(Math.random() * this.xnum), 'food');
		}
		while (snake.dontAccept(newFood));
		this.food = newFood;
	}

	display() {
		snake.display();
		this.food.draw();
	}
}

class Square {
	// Each of the elements in the grid has information about its index in the arena
	// grid, and also of its type
	constructor(i, j, type) {
		this.i = i;
		this.j = j;
		if (type == 'snake') {
			this.isSnake = true;
			this.isFood = false;
		}
		else if (type == 'food') {
			this.isSnake = false;
			this.isFood = true;
		}
	}

	draw() {
		// Draws the square
		if (this.isSnake) {
			fill(0);
			stroke(255);
		}
		else if (this.isFood) {
			fill(255, 0, 0);
			noStroke();
		}
		rect(this.i * arena.size, 100 + this.j * arena.size, arena.size, arena.size);
	}


	setEqualTo(square) {
		// Receives a square and gets its information (the indexes)
		this.i = square.i;
		this.j = square.j;
	}

	move(dir) {
		// The head of the snake is called here and updates its position in the grid
		// according to the master direction
		this.i = this.i + dir.i;
		this.j = this.j + dir.j;
	}
}


class Snake {
	constructor() {
		// The body of the snake is an array of Square types
		this.body = [];
		let head = new Square(Math.floor(arena.xnum / 2), Math.floor(arena.ynum / 2), 'snake');
		this.body.push(head);
		for (let k = 0; k < 2; k++) {
			let newSquare = new Square(this.body[0].i - k - 1, this.body[0].j, 'snake');
			this.body.push(newSquare);
		}
		this.last = new Square(this.body[this.body.length - 1].i - 1, this.body[this.body.length - 1].j, 'snake');
	}

	update() {
		// Updates position and checks
		snake.updatePosition();
		snake.checkEdge();
		snake.hitItself();
		snake.eatFood();
	}

	updatePosition() {
		// The i-th element has to get the position of the (i-1)-th element
		this.last.setEqualTo(this.body[this.body.length - 1]);
		for (let k = this.body.length - 1; k > 0 ; k--) {
			this.body[k].setEqualTo(this.body[k - 1]);
		}

		// The head is updated according to the direction of movement
		this.body[0].move(master.dir);
		master.dir.recentlyChanged = false;
	}

	display() {
		// Call draw on each square
		for (let i = 0, n = this.body.length; i < n; i++) {
			this.body[i].draw();
		}
	}

	checkEdge() {
		// Checks if the head of the snake has reached the edge and
		// if so, updates its position
		if (this.body[0].i >= arena.xnum) {
			this.body[0].i = 0;
		}
		else if (this.body[0].i < 0) {
			this.body[0].i = arena.xnum - 1;
		}
		else if (this.body[0].j >= arena.ynum) {
			this.body[0].j = 0;
		}
		else if (this.body[0].j < 0) {
			this.body[0].j = arena.ynum - 1;
		}
	}

	dontAccept(food) {
		// Receives a piece of food and decides if it doesnt accept it
		for (let k = 0, n = this.body.length; k < n; k++) {
			if (food.i == this.body[k].i && food.j == this.body[k].j) {
				return true;
			}
		}
		return false;
	}

	eatFood() {
		if (arena.food.i == this.body[0].i && arena.food.j == this.body[0].j) {
			// Add one element to the tail of the snake and create new food
			this.addTail();
			arena.createFood();
		}
	}

	addTail() {
		let tail = this.body.length - 1;
		let idif = this.body[tail - 1].i - this.body[tail].i;
		let jdif = this.body[tail - 1].j - this.body[tail].j;
		let newLast = new Square(this.last.i - idif, this.last.j - jdif, 'snake');
		this.body.push(this.last);
		this.last = newLast;
	}

	hitItself() {
		// Snake checks if it hits itself
		for (let k = 1, n = this.body.length; k < n; k++) {
			if (this.body[0].i == this.body[k].i && this.body[0].j == this.body[k].j) {
				master.endGame();
				return;
			}
		}
	}
}

class Direction {
	// This is just a tuple of two values, which can only be a 1 or a 0
	constructor(xdir, ydir) {
		this.i = xdir;
		this.j = ydir;

		// If the direction has been recently changed, then dont allow any more changes
		// until the snake updates its position
		this.recentlyChanged = true;
	}

	update(xdir, ydir) {
		// Receives values for direction and updates the direction if allowed
		if (!this.recentlyChanged) {
			if (this.i != xdir && this.j != ydir) {
				// Only in this case, update the direction
				this.i = xdir;
				this.j = ydir;
				this.recentlyChanged = true;
			}
		}
	}
}
