// This is the size in pixels of a single square
let gridSize = 30;
let letters = ['T', 'leftL', 'rightL', 'leftS', 'rightS', 'Q', 'I'];

let master;
let board;
let arena;


function setup() {
	createCanvas(600, 800);

	master = new Master();
	board = new Board();
	arena = new Arena();
	arena.createGrid();
	arena.createPiece();
}

function draw() {
	background(200);

	master.update();
	master.display();
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		arena.piece.move('right');
	}
	else if (keyCode === LEFT_ARROW) {
		arena.piece.move('left');
	}
	else if (keyCode === DOWN_ARROW) {
		master.downKeyPressed = true;
	}
	else if (keyCode === UP_ARROW) {
		arena.piece.rotate();
	}
}

function keyReleased() {
	if (keyCode === DOWN_ARROW) {
		master.downKeyPressed = false;
		master.start = new Date();
	}
}

class Master {
	// This class controls the game
	constructor() {
		this.lost = false;
		this.score = 0;

		// Variables that set the framerate
		this.start = new Date();
		this.waitFor = 400;
	}

	update() {
		// Check if the piece is sliding in some direction
		if (this.downKeyPressed) {
			arena.piece.move('down');
		}
		else if (this.rightKeyPressed) {
			arena.piece.move('right');
		}
		else if (this.leftKeyPressed) {
			arena.piece.move('left');
		}

		// Updates the elements
		if (!this.lost) {
			if (this.waitedEnough()) {
				arena.update();
			}
		}
		board.update();
	}

	display() {
		// Calls display on all the elements
		board.display();
		arena.display();
	}

	waitedEnough() {
		// Checks if the waiting time is enough
		let now = new Date();
		if (now - this.start > this.waitFor) {
			this.start = new Date();
			return true;
		}
		return false;
	}

	endGame() {
		// Stop updating and end the game
		this.lost = true;
		console.log('Player has lost');
	}
}

class Board {
	// This class displays messages and score
	constructor() {
		this.x = width / 2;
		this.y = 50;
		this.text = '';
	}

	update() {
		this.text = 'Score: ' + master.score;
	}

	display() {
		fill(0);
		noStroke();
		textAlign(CENTER);
		textStyle(BOLD);
		textSize(20);
		text(this.text, this.x, this.y);
	}
}
