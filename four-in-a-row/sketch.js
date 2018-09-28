let users = [];
let current;
let grid;
let board;
let numberCols = 7;
let numberRows = 6;

function setup() {
	createCanvas(800, 800);

	// Create the two users
	for (let i = 0; i < 2; i++) {
		let newUser = new User(i);
		users.push(newUser);
	}
	// Initialize the index of the user that has to play next (the first one)
	current = 0;

	// Create the grid
	grid = new Grid(numberCols, numberRows);

	// Create the message board
	board = new MessageBoard();
}

function draw() {
	background(150);

	// Display messages in the message board
	board.displayMessage();

	// Draw the grid
	grid.draw();
}

function mousePressed() {
	for (let i = 0; i < numberCols; i++) {
		if (grid.clicked(mouseX, mouseY, i)) {
			// The i-th column has been clicked, so check if there is space
			// available there.
			if (grid.available(i)) {
				// Only in this case, create the piece and insert it.
				let piece = new Piece(users[current], i);
				grid.insert(piece, i);

				// Check if the newly inserted piece gives a win
				let win = grid.pieces[grid.pieces.length - 1].checkWin();
				if (win) {
					let message = 'USER '.concat(String(current + 1), ' IS THE WINNER');
					board.change(message);
					noLoop();
				}
				else {
					// Update the user only if a piece has been inserted and there
					// is no winner.
					if (current == 0) {
						current = 1;
						board.change('User 2 has to move');
					}
					else if (current == 1) {
						current = 0;
						board.change('User 1 has to move');
					}
				}
			}
		}
	}
}

class User {
	constructor(i) {
		// Create a user associated with this label
		this.name = i;
		if (i == 0) {
			this.label = 'red';
		}
		else if (i == 1) {
			this.label = 'yellow';
		}
	}
}


class Grid {
	// Builds the grid of points, which will be an array of arrays of the
	// specified elements in rows and columns.
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;
		this.size = (width - 200) / this.cols;

		// Create the grid itself
		this.pieces = [];

		// this.next is a vector with seven zeros when initialized, and marks the
		// position of the next piece to be inserted in each column.
		this.next = [];
		for (let i = 0; i < this.cols; i++) {
			this.next.push(0);
		}
	}

	insert(piece, col) {
		// Receives a type Piece and a column, and inserts the piece in that column.
		// I have already checked that there is space available
		this.pieces.push(piece);
		this.next[col]++;
	}

	draw() {
		// Draw the grid itself:
		for (let i = 0; i < this.cols; i++) {
			stroke(0);
			strokeWeight(3);
			let top = height - 50 - this.rows * this.size;
			let left = 100 + this.size * i;
			line(left, top, left, height - 50);
			line(left + this.size, top, left + this.size, height - 50);
			line(left, height - 50, left + this.size, height - 50);
		}

		// Now draw all the existing pieces
		for (let i = 0; i < this.pieces.length; i++) {
			this.pieces[i].draw();
		}
	}

	clicked(mx, my, i) {
		// Returns true if the column i has been clicked
		return 100 + i * this.size < mx && mx < 100 + (i + 1) * this.size;
	}

	available(i) {
		// Checks if there is space available for a piece in the i-th column
		return this.next[i] < this.rows;
	}


	canAccess(i, j) {
		// Receives a column i and a row j and decides if there is a piece I can
		// access there or not
		for (let k = 0; k < this.pieces.length; k++) {
			if (this.pieces[k].col == i && this.pieces[k].row == j) {
				// I found it among the existing ones
				return true;
			}
		}
		return false;
	}
}

class Piece {
	constructor(user, col) {
		// Receive a user and a column number
		this.label = user.label;
		this.col = col;
		this.size = (width - 200) / numberCols * (2/3);
		this.colsize = (width - 200) / numberCols;
		this.row = grid.next[col];
	}

	draw() {
		// Draw the piece at its location
		stroke(0);
		strokeWeight(2);
		if (this.label == 'red') {
			fill(255, 0, 0);
		}
		else if (this.label == 'yellow') {
			fill(255, 211, 0);
		}
		let x = 100 + (this.colsize / 2) + this.colsize * this.col;
		let y = height - 50 - this.colsize / 2 - this.colsize * this.row;
		ellipse(x, y, this.size, this.size);
	}

	checkWin() {
		// This function will begin in this piece and iterate over all the other
		// existing pieces, looking for a win
		let paths = [];
		for (let i = 0; i < grid.pieces.length; i++) {
			// First check it is not that same piece
			if (this.col != grid.pieces[i].col || this.row != grid.pieces[i].row) {
				// Now check if it is a neighbor
				if (this.neighbor(grid.pieces[i])) {
					// Lastly, check if it is the same same color.
					if (this.sameColor(grid.pieces[i])) {
						paths.push(grid.pieces[i].checkDirection(grid.pieces[i].col - this.col, grid.pieces[i].row - this.row, 1));
					}
				}
			}
		}
		if (paths.length == 0) {
			return false;
		}
		else {
			for (let i = 0; i < paths.length; i++) {
				if (paths[i]) {
					console.log('WE HAVE A WINNER!!!');
					return true;
				}
			}
			return false;
		}
	}

	neighbor(piece) {
		// Receives another already existing piece and
		// checks if both are neighbors
		let horizontal = piece.col >= this.col - 1 && piece.col <= this.col + 1;
		let vertical = piece.row >= this.row - 1 && piece.row <= this.row + 1;
		return horizontal && vertical;
	}

	checkDirection(colPos, rowPos, step) {
		// Iterate over all pieces trying to find one in the same direction
		for (let i = 0; i < grid.pieces.length; i++) {
			if (this.sameColor(grid.pieces[i]) && grid.pieces[i].col - this.col == colPos && grid.pieces[i].row - this.row == rowPos) {
				if (step == 2) {
					// We found four in a row
					return true;
				}
				else {
					// Call recursively
					return grid.pieces[i].checkDirection(colPos, rowPos, step + 1);
				}
			}
		}
		return false;
	}

	sameColor(piece) {
		// Receives another pieces and checks if the color is the same
		return this.label == piece.label;
	}
}

class MessageBoard {
	// This is a place reserved at the top for displaying messages
	constructor() {
		this.x = 100;
		this.y = 100;
		this.message = 'User 1 has to move';
	}

	displayMessage() {
		// Displays the current message
		noStroke();
		fill(0);
		textSize(20);
		text(this.message, this.x, this.y);

		// Also displays the colors of the users.
		for (let i = 0; i < users.length; i++) {
			noStroke();
			fill(0);
			text('User '. concat(String(i + 1)), 400 + i * 100, 50);
			stroke(0);
			strokeWeight(3);
			if (users[i].label == 'yellow') {
				fill(255, 211, 0);
			}
			else if (users[i].label == 'red') {
				fill(255, 0, 0);
			}
			rect(400 + i * 100, 60, 60, 60);
		}
	}

	change(string) {
		// Receives a string and updates the message
		this.message = string;
	}
}
