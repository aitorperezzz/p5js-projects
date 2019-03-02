class Cell {
	// One of the cells in a sudoku.
	constructor(i, j, number, initialx, initialy, size) {
		this.i = i;
		this.j = j;
		this.number = number;
		this.selected = false;
		this.valid = true;

		// Calculate the position of the cell.
		this.x = master.initialx + this.j * master.size;
		this.y = master.initialy + this.i * master.size;

		// Decide if the cell has a fixed value.
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
		if (this.selected) {
			// If selected, draw it in grey.
			fill(155);
		}
		else {
			// Draw it in white.
			fill(255);
		}
		stroke(0);
		strokeWeight(1);
		rect(this.x, this.y, master.size, master.size);

		// Now draw the number.
		if (this.number != 0) {
			// Only in this case draw the number.
			if (this.fixed) {
				// Fixed value.
				fill(0, 255, 0);
			}
			else if (this.selected) {
				// Selected while creating the sudoku.
				if (this.valid) {
					fill(0);
				}
				else {
					fill(255, 0, 0);
				}
			}
			else  {
				// Test value.
				fill(0, 0, 255);
			}
			textAlign(CENTER, CENTER);
			textSize(25);
			noStroke();
			text(this.number, this.x + master.size / 2, this.y + master.size / 2);
		}
	}

	clicked(mx, my) {
		// Decides if this cell has been clicked.
		if (this.x <= mx && mx < this.x + master.size && this.y <= my && my < this.y + master.size) {
			return true;
		}
		else {
			return false;
		}
	}

	check() {
		// Checks if the cell number is valid in the sudoku.
		if (!this.checkBox() || !this.checkRow() || !this.checkCol()) {
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
