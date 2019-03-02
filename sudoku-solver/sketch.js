let test1 = [[2, 1, 9], [2, 3, 3], [3, 1, 5], [2, 4, 2], [2, 6, 6], [3, 4, 7], [3, 6, 9],
		[2, 7, 1], [2, 9, 8], [3, 9, 3], [4, 2, 1], [5, 3, 9], [6, 2, 6], [5, 5, 6], [5, 7, 2],
		[4, 8, 4], [6, 8, 5], [7, 1, 7], [8, 1, 1], [8, 3, 8], [7, 4, 3], [7, 6, 4], [8, 4, 5],
		[8, 6, 7], [7, 9, 5], [8, 7, 4], [8, 9, 9]];
let test2 = [[1, 1, 3], [1, 4, 8], [1, 8, 2], [2, 1, 5], [2, 2, 2], [2, 5, 6], [2, 7, 4], [2, 9, 7],
		[3, 2, 4], [3, 5, 5], [3, 6, 2], [3, 9, 8], [4, 1, 1], [4, 3, 5], [4, 6, 7], [4, 8, 9], [4, 9, 2],
		[5, 4, 5], [5, 6, 1], [5, 7, 6], [5, 8, 4], [6, 2, 3], [6, 3, 9], [6, 4, 6], [7, 1, 2], [7, 5, 1],
		[7, 6, 3], [7, 7, 7], [7, 9, 6], [8, 2, 9], [8, 4, 7], [8, 9, 1], [9, 1, 7], [9, 2, 5], [9, 5, 8],
		[9, 7, 9]];

let master;
let sudoku;

function setup() {
	createCanvas(700, 700);

	// Initialize all the elements.
	master = new Master();
	sudoku = new Sudoku();

	// Find a cell to start the algorithm.
	sudoku.findFirstTestCell();
}

function draw() {
	background(0);

	// Draw all the elements.
	sudoku.draw();

	if (master.solving) {
		if (sudoku.giveTestValue()) {
			// The current cell has got a new test value. Now check it.
			if (sudoku.current.check()) {
				// The new test value is ok, proceed to set the next current cell.
				if (sudoku.advanceCurrent()) {
					// The current cell has been updated.
				}
				else {
					// If it couldn't be updated, the sudoku is solved.
					master.solving = false;
					console.log("solved!");
				}
			}
			else {
				// The new value is incorrect. Give it a new number.
				return;
			}
		}
		else {
			// The cell reached all values to be tested, so set it to zero
			// and backtrack the current test cell.
			sudoku.backtrackCurrent();
		}
	}
}

function startCustom() {
	// The user wants to begin the creation of a custom Sudoku.
	master.startCustom(0);
}

function finishCustom() {
	// The user want to finsh the creation of the custom Sudoku.
	master.finishCustom();
}

function loadTest() {
	// Load the test Sudoku selected by the user.
	let option = document.getElementById("sudokuSelection").value;
	master.loadTest(option);
}

function beginSolve() {
	// The user wants to solve the loaded Sudoku.
	master.startSolve();
}

function mousePressed() {
	sudoku.clicked(mouseX, mouseY);
}

function keyPressed() {
	if (key >= 1 && key <= 9) {
		master.giveNumber(key);
	}
	else if (keyCode == ENTER) {
		master.fixNumber();
	}
	else if (keyCode == BACKSPACE) {
		master.deleteNumber();
	}
}

function index(i, j) {
	// Returns the global index from a local index
	return i * 9 + j;
}

class Master {
	// This object has control over the application.
	constructor() {
		this.creating = true;
		this.solving = false;

		// Relevant global values for the size of the arena.
		this.totalSize = Math.min(width, height) * 5 / 6;
		this.size = this.totalSize / 9;
		this.initialx = (width - this.totalSize) / 2;
		this.initialy = (height - this.totalSize) / 2;

		// Variables for creating a sudoku.
		this.currenti = 0;
		this.currentj = 0;
		this.currentNumber;
	}

	startCustom() {
		// Starts a new custom Sudoku.
		sudoku = new Sudoku();
		this.creating = true;
		this.solving = false;
	}

	finishCustom() {
		// Finishes the creation of a custom Sudoku.
		this.creating = false;
		sudoku.findFirstTestCell();
	}

	loadTest(option) {
		// Loads a test Sudoku.
		this.solving = false;
		if (option == 1) {
			sudoku = new Sudoku(test1);
		}
		else if (option == 2) {
			sudoku = new Sudoku(test2);
		}
		this.creating = false;
		sudoku.findFirstTestCell();
	}

	startSolve() {
		// Start solving the soduku as is.
		this.solving = true;
	}

	giveNumber(key) {
		// Receives a number from the keyboard and keeps it.
		if (this.creating && this.selected) {
			this.currentNumber = key;
			sudoku.grid[this.currenti][this.currentj].number = key;
			if (sudoku.grid[this.currenti][this.currentj].check()) {
				sudoku.grid[this.currenti][this.currentj].valid = true;
			}
			else {
				sudoku.grid[this.currenti][this.currentj].valid = false;
			}
			// If the value was fixed, unfix it.
			sudoku.grid[this.currenti][this.currentj].fixed = false;
		}
	}

	fixNumber() {
		// The user has pressed enter.
		if (sudoku.grid[this.currenti][this.currentj].check()) {
			// Fix the number.
			sudoku.grid[this.currenti][this.currentj].number = this.currentNumber;
			sudoku.grid[this.currenti][this.currentj].fixed = true;
			sudoku.grid[this.currenti][this.currentj].selected = false;
		}
		else {
			// Delete the number.
			this.deleteNumber();
		}
	}

	deleteNumber() {
		// Deletes the number in the current cell.
		sudoku.grid[this.currenti][this.currentj].number = 0;
		sudoku.grid[this.currenti][this.currentj].fixed = false;
		sudoku.grid[this.currenti][this.currentj].selected = false;
	}
}
