let columns = [];
let users = [];
let current;
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
	// Initialize the index of the user that has to play next
	current = 0;

	// Create the four columns
	for (let i = 0; i < numberCols; i++) {
		let newColumn = new Column(i);
		columns.push(newColumn);
	}

	// Create the message board
	board = new MessageBoard();
}

function draw() {
	background(150);

	// Display messages in the message board
	board.displayMessage();
	// Draw the content of each column
	for (let i = 0; i < numberCols; i++) {
		columns[i].draw();
	}
}

function mousePressed() {
	for (let i = 0; i < numberCols; i++) {
		if (columns[i].clicked(users[current], mouseX, mouseY)) {
			// Give a new piece for the current user in this column
			let piece = new Piece(users[current], i);
			columns[i].insert(piece);
		}
	}

	// Update the current user and the message board
	if (current == 0) {
		current = 1;
		board.change('User 2 has to move');
	}
	else if (current == 1) {
		current = 0;
		board.change('User 1 has to move');
	}
}

class User {
	constructor(i) {
		// Create a user associated with this label
		if (i == 0) {
			this.label = 'red';
		}
		else if (i == 1) {
			this.label = 'yellow';
		}
	}
}

class Column {
	constructor(col) {
		// Receives the number of column and creates the column, which is
		// created without pieces
		// The size of the column is equal vertically and horizontally
		this.size = (width - 200) / numberCols;
		this.x = 100 + col * this.size;
		this.pieces = [];
		this.filled = false;
	}

	insert(piece) {
		// Receives a piece and adds it to existing pieces
		if (this.filled == false) {
			this.pieces.push(piece);
		}
		if (this.pieces.length == numberRows) {
			// Set the column as filled
			this.filled = true;
		}
	}

	askRow() {
		// A piece, when created, asks the column the position it has to be placed in.
		return this.pieces.length;
	}

	draw() {
		// Draw the pieces in the column
		for (let i = 0; i < this.pieces.length; i++) {
			this.pieces[i].draw();
		}

		// Draw the lines that limit the columns
		stroke(0);
		strokeWeight(3);
		line(this.x, height - 50 - this.size * numberRows, this.x, height - 50);
		line(this.x + this.size, height - 50 - this.size * numberRows, this.x + this.size, height - 50);
		line(this.x, height - 50, this.x + this.size, height - 50);
	}

	clicked(user, mx, my) {
		// Receives a user and a mouse position and decides if this column
		// was clicked by the user
		return (this.x < mx && mx < this.x + this.size);
	}
}

class Piece {
	constructor(user, col) {
		// Receive a color, a column and a location in the column
		// this.user = user;
		this.label = user.label;
		this.col = col;
		this.size = (width - 200) / numberCols / 2;
		this.colsize = (width - 200) / numberCols;
		this.row = columns[col].askRow();
	}

	draw() {
		// Draw the piece at its location
		stroke(0);
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
}

class MessageBoard {
	// This is a place reserved at the top for displaying messages
	constructor() {
		this.x = 200;
		this.y = 50;
		this.message = 'User 1 has to move';
	}

	displayMessage() {
		// Displays the current message
		noStroke();
		fill(0);
		textSize(20);
		text(this.message, this.x, this.y);
	}

	change(string) {
		// Receives a string and updates the message
		this.message = string;
	}
}
