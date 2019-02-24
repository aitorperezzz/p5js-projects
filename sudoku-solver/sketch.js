let test = [[2, 1, 9], [2, 3, 3], [3, 1, 5], [2, 4, 2], [2, 6, 6], [3, 4, 7], [3, 6, 9],
		[2, 7, 1], [2, 9, 8], [3, 9, 3], [4, 2, 1], [5, 3, 9], [6, 2, 6], [5, 5, 6], [5, 7, 2],
		[4, 8, 4], [6, 8, 5], [7, 1, 7], [8, 1, 1], [8, 3, 8], [7, 4, 3], [7, 6, 4], [8, 4, 5],
		[8, 6, 7], [7, 9, 5], [8, 7, 4], [8, 9, 9]];

let sudoku;
let current;
let solved = false;

let time;
let finalTime;
let gotTime = false;

function setup() {
	createCanvas(800, 800);

	//frameRate(2);

	// Load the test sudoku.
	sudoku = new Sudoku(test);
	time = new Date();

	// Find a cell to start the algorithm.
	findFirstTestCell();
	findLastTestCell();
}

function draw() {
	background(0);

	// Draw all the elements.
	sudoku.draw();

	if (!solved) {
		if (giveTestValue()) {
			// The current cell has got a new test value. Check it
			if (current.check()) {
				// The new test value is ok, proceed to set the next current cell.
				if (current.last) {
					console.log("current esta en i="+current.i+", j="+current.j);
					console.log("last en current vale"+current.last);
					console.log("solved");
					solved = true;
					return;
				}
				advanceCurrent();
			}
			else {
				// The new value is incorrect. Backtrack to the previous test cell.
				return;
			}
		}
		else {
			// The cell reached all values to be tested, so set it to zero
			// and backtrack.
			current.number = 0;
			backtrackCurrent();
		}
	}
}

function findLastTestCell() {
	// Gets the sudoku grid and finds the last test cell.
	for (let i = 8; i >= 0; i--) {
		console.log("trying in i="+i);
		for (let j = 8; j >= 0; j--) {
			if (sudoku.grid[i][j].fixed == false) {
				// Last one which is a test one.
				console.log("last test cell is i= "+i+", j= "+j);
				sudoku.grid[i][j].last = true;
				return;
			}
		}
	}
}

function findFirstTestCell() {
	// Evaluates the sudoku and finds a cell to start the algorithm.
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (sudoku.grid[i][j].fixed == false) {
				// Set it as the initial cell and return true.
				current = sudoku.grid[i][j];
				return true;
			}
		}
	}
	// If no cell could be found, return false.
	return false;
}

function index(i, j) {
	// Returns the global index from a local index
	return i * 9 + j;
}

function giveTestValue() {
	// Tries to give a new test value to the current cell.
	if (current.number < 9) {
		current.number++;
		return true;
	}
	else {
		return false;
	}
}

function advanceCurrent() {
	// Set the current cell to the next test cell.
	let currentIndex = index(current.i, current.j);
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (currentIndex < index(i, j) && !sudoku.grid[i][j].fixed) {
				// This one serves as the new current.
				current = sudoku.grid[i][j];
				return true;
			}
		}
	}

	// No new test cell could be found for the current.
	return false;
}

function backtrackCurrent() {
	// Set the current cell to the previous test cell.
	let currentIndex = index(current.i, current.j);
	for (let i = 8; i >= 0; i--) {
		for (let j = 8; j >= 0; j--) {
			if (currentIndex > index(i, j) && !sudoku.grid[i][j].fixed) {
				// This one serves as the new current.
				current = sudoku.grid[i][j];
				return true;
			}
		}
	}
	return false;
}

class Sudoku {
	constructor(initial) {
		// Define some relevant sizes.
		this.totalSize = Math.min(width, height) * 3 / 4;
		this.size = this.totalSize / 9;
		this.ix = (width - this.totalSize) / 2;
		this.iy = (height - this.totalSize) / 2;

		// Create the grid.
		this.grid = [];
		for (let i = 0; i < 9; i++) {
			// Create a new row.
			this.grid.push([]);
			for (let j = 0; j < 9; j++) {
				// Create a standard square.
				let found = false;
				let number;
				let newCell;
				for (let k = 0; k < initial.length; k++) {
					if (initial[k][0] == i + 1 && initial[k][1] == j + 1) {
						// If the indexes are found in the initial array, change the number
						// inside the standard square.
						found = true;
						number = initial[k][2];
					}
				}
				// Create the cell accordingly.
				if (found) {
					newCell = new Cell(i, j, number, this.ix, this.iy, this.size);
				}
				else {
					newCell = new Cell(i, j, 0, this.ix, this.iy, this.size);
				}
				// Add the element to that row.
				this.grid[i].push(newCell);
			}
		}

		/*
		// Calculate which of the test cells is the last.
		for (let i = 8; i >= 0; i--) {
			for (let j = 8; j >= 0; j--) {
				if (this.grid[i][j].fixed == false) {
					// Last one which is a test one.
					this.grid[i][j].last = true;
					break;
				}
			}
		}*/

	}

	draw() {
		// First draw each of the cells.
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				this.grid[i][j].draw();
			}
		}

		// Next draw the thick lines.
		stroke(0);
		strokeWeight(5);
		// The two vertical lines.
		line(this.ix + 3 * this.size, this.iy, this.ix + 3 * this.size, this.iy + this.totalSize);
		line(this.ix + 6 * this.size, this.iy, this.ix + 6 * this.size, this.iy + this.totalSize);
		// The two horizontal lines.
		line(this.ix, this.iy + 3 * this.size, this.ix + this.totalSize, this.iy + 3 * this.size);
		line(this.ix, this.iy + 6 * this.size, this.ix + this.totalSize, this.iy + 6 * this.size);
	}
}


class Cell {
	// One of the cells in a sudoku.
	constructor(i, j, number, initialx, initialy, size) {
		this.i = i;
		this.j = j;
		this.number = number;
		this.size = size;

		// Calculate the position of the cell.
		this.x = initialx + this.j * this.size;
		this.y = initialy + this.i * this.size;

		// Some relevant values for the solving method.
		this.last = false;
		if (this.number == 0) {
			this.fixed = false;
		}
		else {
			this.fixed = true;
		}

		// Find out the box to which it belongs.
		for (let k = this.i; k >= 0; k--) {
			if (k % 3 == 0) {
				this.boxi = k;
				break;
			}
		}
		for (let l = this.j; l >= 0; l--) {
			if (l % 3 == 0) {
				this.boxj = l;
				break;
			}
		}
	}

	draw() {
		// Draw the cell.
		fill(255);
		stroke(0);
		strokeWeight(1);
		rect(this.x, this.y, this.size, this.size);

		// Now draw the number.
		if (this.fixed) {
			// Show the number in red if fixed.
			fill(0, 255, 0);
			textAlign(CENTER, CENTER);
			textSize(30);
			noStroke();
			text(this.number, this.x + this.size / 2, this.y + this.size / 2);
		}
		else if (this.number != 0) {
			// The cell has a test value, paint it blue.
			fill(0, 0, 255);
			textAlign(CENTER, CENTER);
			textSize(30);
			noStroke();
			text(this.number, this.x + this.size / 2, this.y + this.size / 2);
		}
	}

	check() {
		// Checks if this cell is well placed in the sudoku.
		let checkBox = this.checkBox();
		let checkRow = this.checkRow();
		let checkCol = this.checkCol();

		if (!checkBox || !checkRow || !checkCol) {
			return false;
		}
		else {
			return true;
		}
	}

	checkBox() {
		// Checks if the test number is correct within the box.
		for (let i = this.boxi; i < this.boxi + 3; i++) {
			for (let j = this.boxj; j < this.boxj + 3; j++) {
				// Do not check the same cell
				if (i != this.i && j != this.j) {
					if (sudoku.grid[i][j].number == this.number && this.number != 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	checkRow() {
		// Checks if the number is correct within the row.
		for (let j = 0; j < 9; j++) {
			if (j != this.j) {
				if (sudoku.grid[this.i][j].number == this.number && this.number != 0) {
					return false;
				}
			}
		}
		return true;
	}

	checkCol() {
		// Checks if the number is correct within the column.
		for (let i = 0; i < 9; i++) {
			if (i != this.i) {
				if (sudoku.grid[i][this.j].number == this.number && this.number != 0) {
					return false;
				}
			}
		}
		return true;
	}
}
