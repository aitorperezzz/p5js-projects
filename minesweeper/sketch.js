let arena;
let mode;
let master;

function setup() {
	createCanvas(1000, 800);

	// Create a space in the canvas for the actual grid of squares
	mode = 'Expert';
	master = new Master();
	arena = new Arena(mode);
}

function draw() {
	background(225);

	arena.draw();
}


function mousePressed() {
	// Check if it has hit the arena
	if (arena.isClicked(mouseX, mouseY)) {
		let square = arena.squareClicked(mouseX, mouseY);
		square.whenClicked();
	}

	// If it is not the arena, check the rest of the buttons
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
	constructor() {
		this.playing = true;
	}

	endGame() {
		// Reveal everything in the arena
		arena.reveal();
	}
}

class Arena {
	// This class receives a mode and creates some space for the
	// squares inside the canvas
	constructor(mode) {
		this.size = 30;
		if (mode == 'Beginner') {
			this.xnum = 9;
			this.ynum = 9;
			this.numMines = 10;
		}
		else if (mode == 'Intermediate') {
			this.xnum = 16;
			this.ynum = 16;
			this.numMines = 40;
		}
		else if (mode == 'Expert') {
			this.xnum = 30;
			this.ynum = 16;
			this.numMines = 99;
		}

		//this.numSquares = this.xnum * this.ynum;
		this.x = (width - this.xnum * this.size) / 2;
		this.y = 100 + (height - 100 - this.ynum * this.size) / 2;

		// Create a grid with the appropriate number of squares
		this.squares = [];
		for (let i = 0; i < this.xnum; i++) {
			this.squares.push([])
			for (let j = 0; j < this.ynum; j++) {
				let square = new Square(this.x + i * this.size, this.y + j * this.size, this.size, i, j);
				this.squares[i].push(square);
			}
		}

		// Populate some of the squares with the appropriate number of mines
		let minesPlaced = 0;
		while (minesPlaced < this.numMines) {
			let iCandidate = int(random(0, this.xnum));
			let jCandidate = int(random(0, this.ynum));
			if (this.squares[iCandidate][jCandidate].mine == false) {
				// Make this square a mine and update the number of mines placed
				this.squares[iCandidate][jCandidate].mine = true;
				minesPlaced++;
			}
		}

		// Calculate the number of surrounding mines
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.assignNumber(this.squares[i][j]);
			}
		}
	}

	assignNumber(square) {
		// Receives a square and assigns the number of mines
		// surrounding it
		if (square.mine == false) {
			// In this case we have to assign a number
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					let xIndex = square.i + i;
					let yIndex = square.j + j;

					let accesible = xIndex >= 0 && xIndex < this.xnum && yIndex >= 0 && yIndex < this.ynum;
					let notSame = xIndex != square.i || yIndex != square.j;

					if (accesible && notSame) {
						// The square is accesible and different from the one being analysed, so
						// check if it has a mine and update number
						if (this.squares[xIndex][yIndex].mine) {
							square.number++;
						}
					}
				}
			}
		}
	}


	draw() {
		// Draw the squares
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.squares[i][j].draw();
			}
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the arena has been clicked
		let xClicked = (this.x < mx && mx < this.x + this.xnum * this.size);
		let yClicked = (this.y < my && my < this.y + this.ynum * this.size);
		return xClicked && yClicked;
	}

	squareClicked(mx, my) {
		// receives mouse location and returns the square that has been clicked
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				if (this.squares[i][j].isClicked(mx, my)) {
					return this.squares[i][j];
				}
			}
		}
	}

	reveal() {
		// Reveal every square
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.squares[i][j].revealed = true;
			}
		}
	}

	flood(square) {
		// Flood the surroundings of the given square, which we know does not
		// have neighbors
		square.revealed = true;

		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let xIndex = square.i + i;
				let yIndex = square.j + j;
				let accesible = xIndex >= 0 && xIndex < this.xnum && yIndex >= 0 && yIndex < this.ynum;
				let notSame = xIndex != square.i || yIndex != square.j;

				if (accesible && notSame) {
					// This one is accesible and does not have a mine, so call flood
					let neighbor = this.squares[xIndex][yIndex];
					if (neighbor.number == 0 && !neighbor.revealed) {
						this.flood(neighbor);
					}
					neighbor.revealed = true;
				}

			}
		}
	}
}

class Square {
	constructor(xpos, ypos, size, i, j) {
		// Variables that store location information
		this.x = xpos;
		this.y = ypos;
		this.size = size;
		this.i = i;
		this.j = j;

		// Number of mines surrounding the square, to be updated
		// after construction
		this.number = 0;

		// Initialize variables that store game information
		this.revealed = false;
		this.mine = false;
		this.flag = false;
	}

	draw() {
		// The background color of a square is darker if it has not been
		// revealed
		stroke(100);
		strokeWeight(2);
		if (this.revealed) {
			fill(190);
		}
		else {
			fill(150);
		}
		rect(this.x, this.y, this.size, this.size);

		// Draw flags if necessary
		if (this.flag) {
			noStroke();
			fill(255, 0, 0);
			ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2);
		}

		// Draw the rest of the things
		if (this.revealed) {
			// Draw the content
			if (this.mine) {
				// Draw an ellipse simulating the mine
				noStroke();
				fill(0);
				ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2);
			}
			else if (this.number != 0) {
				// Draw the number
				noStroke();
				fill(0);
				textAlign(CENTER);
				text(this.number, this.x + this.size / 2, this.y + this.size * (2/3));
			}
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the square has been clicked
		let xClicked = (this.x <= mx && mx < this.x + this.size);
		let yClicked = (this.y <= my && my < this.y + this.size);
		return xClicked && yClicked;
	}

	whenClicked(mouseButton) {
		// The square has been clicked, so do something
		if (this.mine) {
			// End the game
			master.endGame();
		}
		else if (this.number != 0) {
			// Reveal the square
			this.revealed = true;
		}
		else if (this.number == 0) {
			// Call flood recursively
			arena.flood(this);
		}
	}
}

/*
class ButtonSelectMode {
	// A button for selecting the mode of game
}*/
