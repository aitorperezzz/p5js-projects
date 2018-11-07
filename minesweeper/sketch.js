// Declare the global variables, accesible by all classes and functions
let master;
let mode = 'mode1';
let types = ['new', 'mines', 'mode1', 'mode2', 'mode3', 'message'];
let board;
let arena;


// p5js specific functions
function setup() {
	createCanvas(1000, 800);

	// Initialize the global variables
	master = new Master();
	board = new Board(types);
	arena = new Arena(mode);
}

function draw() {
	background(225);

	master.checkWin();
	board.display();
	arena.display();
}

function mousePressed() {
	if (arena.isClicked(mouseX, mouseY)) {
		// If it hits the arena, decide which square and call
		let square = arena.squareClicked(mouseX, mouseY);
		square.clicked();
		arena.updateRevealed();
	}

	else if (board.isClicked(mouseX, mouseY)) {
		// If it hits the board, decide which button and call
		let button = board.buttonClicked(mouseX, mouseY);
		button.clicked();
	}
}

function keyPressed() {
	if (key == 'f') {
		if (arena.isClicked(mouseX, mouseY)) {
			let square = arena.squareClicked(mouseX, mouseY);
			if (square.flag) {
				square.flag = false;
			}
			else {
				square.flag = true;
			}
		}
	}
}


class Master {
	// This class is the controller of everything that happens in the game

	checkWin() {
		// Checks if the user has won
		if (arena.revealedNum == arena.notMines) {
			this.endGame('win');
		}
	}

	endGame(type) {
		if (type == 'win') {
			board.buttons[5].changeText('Player has won');
		}
		else if (type == 'lose') {
			// Reveal the arena completely
			arena.reveal();
			board.buttons[5].changeText('Player has lost');
		}
	}

	changeMode(string) {
		// Receives a string and changes the mode of game
		mode = string;
		if (mode == 'mode1') {
			board.buttons[0].changeColor('green');
			board.buttons[1].changeText('10 mines');
		}
		else if (mode == 'mode2') {
			board.buttons[0].changeColor('yellow');
			board.buttons[1].changeText('40 mines');
		}
		else if (mode == 'mode3') {
			board.buttons[0].changeColor('red');
			board.buttons[1].changeText('99 mines');
		}
	}

	restart() {
		arena = new Arena(mode);
		board.buttons[5].changeText('Playing');
	}
}

class Button {
	// Receives a type and creates a button of that type in the appropriate location
	constructor(type) {
		this.type = type;
		if (this.type == 'new') {
			// The new game button
			this.x = 0;
			this.y = 0;
			this.xsize = (1 / 3) * width;
			this.ysize = 50;
			this.text = 'New game';
			this.color = 'green';
		}
		else if (this.type == 'mines') {
			// The indicator of the number of mines in the arena
			this.x = 0;
			this.y = 50;
			this.xsize = (1 / 3) * width;
			this.ysize = 50;
			if (mode == 'mode1') {
				this.text = '10 mines';
			}
			else if (mode == 'mode2') {
				this.text = '40 mines';
			}
			else if (mode == 'mode3') {
				this.text = '99 mines';
			}
			this.color = 'white';
		}

		// The difficulty selectors
		else if (this.type == 'mode1') {
			this.x = (1 / 3) * width;
			this.y = 0;
			this.xsize = (2 / 9) * width;
			this.ysize = 50;
			this.text = 'Beginner';
			this.color = 'green';
		}
		else if (this.type == 'mode2') {
			this.x = (1 / 3) * width + (2 / 9) * width;
			this.y = 0;
			this.xsize = (2 / 9) * width;
			this.ysize = 50;
			this.text = 'Intermediate';
			this.color = 'yellow';
		}
		else if (this.type == 'mode3') {
			this.x = (1 / 3) * width + (4 / 9) * width;
			this.y = 0;
			this.xsize = (2 / 9) * width;
			this.ysize = 50;
			this.text = 'Expert';
			this.color = 'red';
		}

		else if (this.type == 'message') {
			this.x = (1 / 3) * width;
			this.y = 50;
			this.xsize = (2 / 3) * width;
			this.ysize = 50;
			this.text = 'Playing';
			this.color = 'white';
		}
	}

	draw() {
		// Display the background color of the button
		if (this.color == 'white') {
			fill(255);
		}
		else if (this.color == 'green') {
			fill(0, 255, 0);
		}
		else if (this.color == 'yellow') {
			fill(255,255,102);
		}
		else if (this.color == 'red') {
			fill(255, 0, 0);
		}
		strokeWeight(1);
		stroke(0);
		rect(this.x, this.y, this.xsize, this.ysize);

		// Display the text of the button
		noStroke();
		fill(0);
		textAlign(CENTER);
		textSize(16);
		textStyle(BOLD);
		text(this.text, this.x + this.xsize / 2, this.y + this.ysize * (2/3));
	}

	changeText(string) {
		// Receives a string and changes the text
		this.text = string;
	}

	changeColor(string) {
		// Receives a string and changes the color
		this.color = string;
	}

	isClicked(mx, my) {
		// Decides if this button has been clicked
		let xClicked = this.x < mx && mx <= this.x + this.xsize;
		let yClicked = this.y < my && my <= this.y + this.ysize;
		return xClicked && yClicked;
	}

	clicked() {
		// The button has been clicked
		if (this.type == 'new') {
			master.restart();
		}
		else if (this.type == 'mode1') {
			master.changeMode('mode1');
			master.restart();
		}
		else if (this.type == 'mode2') {
			master.changeMode('mode2');
			master.restart();
		}
		else if (this.type == 'mode3') {
			master.changeMode('mode3');
			master.restart();
		}
	}
}

class Board {
	// This class has information about the buttons on top
	constructor(types) {
		this.buttons = [];
		for (let i = 0; i < types.length; i++) {
			let newButton = new Button(types[i]);
			this.buttons.push(newButton);
		}
	}

	display() {
		// Display all the buttons in the message board
		for (let i = 0, n = this.buttons.length; i < n; i++) {
			this.buttons[i].draw();
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the board has been clicked
		let xClicked = 0 < mx && mx <= width;
		let yClicked = 0 < my && my <= 100;
		return xClicked && yClicked;
	}

	buttonClicked(mx, my) {
		// Decides which of the buttons has been clicked
		for (let i = 0, n = this.buttons.length; i < n; i++) {
			if (this.buttons[i].isClicked(mx, my)) {
				return this.buttons[i];
			}
		}
	}
}
