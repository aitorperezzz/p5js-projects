class Sudoku {
	constructor(initial) {
		// Create a Sudoku if an initial grid was provided.
		if (initial != undefined) {
			this.grid = [];
			for (let i = 0; i < 9; i++) {
				// Create a new row.
				this.grid.push([]);
				for (let j = 0; j < 9; j++) {
					// Find if this cell has a fixed value in the initial array.
					let found = false;
					let number;
					let newCell;
					for (let k = 0; k < initial.length; k++) {
						if (initial[k][0] == i + 1 && initial[k][1] == j + 1) {
							// If the indexes are found in the initial array, keep the number.
							found = true;
							number = initial[k][2];
              break;
						}
					}
					// Create the cell accordingly.
					if (found) {
						newCell = new Cell(i, j, number);
					}
					else {
						newCell = new Cell(i, j, 0);
					}
					// Add the element to that row.
					this.grid[i].push(newCell);
				}
			}
		}

		// Create a blank sudoku if no grid was provided.
		else {
			this.grid = [];
			for (let i = 0; i < 9; i++) {
				this.grid.push([]);
				for (let j = 0; j < 9; j++) {
					let newCell = new Cell(i, j, 0);
					this.grid[i].push(newCell);
				}
			}
		}

		// Create variables for the solving algorithm.
		this.current;
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
		line(master.initialx + 3 * master.size, master.initialy, master.initialx + 3 * master.size, master.initialy + master.totalSize);
		line(master.initialx + 6 * master.size, master.initialy, master.initialx + 6 * master.size, master.initialy + master.totalSize);
		// The two horizontal lines.
		line(master.initialx, master.initialy + 3 * master.size, master.initialx + master.totalSize, master.initialy + 3 * master.size);
		line(master.initialx, master.initialy + 6 * master.size, master.initialx + master.totalSize, master.initialy + 6 * master.size);
	}

	addValue(i, j, number) {
		// Receives a fixed value to be added.
		this.grid[i][j].number = number;
		this.grid[i][j].fixed = true;
	}

	clicked(mx, my) {
		// Checks which cell, if any, has been clicked, and tells master.
		if (master.creating) {
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (this.grid[i][j].clicked(mx, my)) {
						// Unselect the previously selected cell and delete its number.
						this.grid[master.currenti][master.currentj].selected = false;

						// Delete it number if it wasn't fixed.
						if (this.grid[master.currenti][master.currentj].fixed == false) {
							this.grid[master.currenti][master.currentj].number = 0;
						}

						// Update the cureent index in master.
						master.currenti = i;
						master.currentj = j;
						master.selected = true;
						this.grid[i][j].selected = true;
					}
				}
			}
		}
	}

	findFirstTestCell() {
		// Evaluates the sudoku and finds a test cell to start the algorithm.
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (this.grid[i][j].fixed == false) {
					// Set it as the initial cell and return true.
					this.current = this.grid[i][j];
					return true;
				}
			}
		}
		// If no cell could be found, return false.
		return false;
	}

	giveTestValue() {
		// Tries to give a new test value to the current cell.
		if (this.current.number < 9) {
			this.current.number++;
			return true;
		}
		else {
			return false;
		}
	}

	advanceCurrent() {
		// Advance the current cell to the next test cell available.
		let globalIndex = index(this.current.i, this.current.j);
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (globalIndex < index(i, j) && !this.grid[i][j].fixed) {
					// This one serves as the new current.
					this.current = this.grid[i][j];
					return true;
				}
			}
		}
		// No new test cell could be found for the current.
		return false;
	}

	backtrackCurrent() {
		// Set the number in the current cell to zero.
		this.current.number = 0;

		// Set the current cell to the previous test cell.
		let globalIndex = index(this.current.i, this.current.j);
		for (let i = 8; i >= 0; i--) {
			for (let j = 8; j >= 0; j--) {
				if (globalIndex > index(i, j) && !this.grid[i][j].fixed) {
					// This one serves as the new current.
					this.current = this.grid[i][j];
					return true;
				}
			}
		}
		// Backtracking was not possible.
		return false;
	}
}
