class Arena {
	constructor() {
		this.size = gridSize;
		this.xnum = 10;
		this.ynum = 20;
		this.xstart = (width - this.xnum * this.size) / 2;
		this.ystart = (height - this.ynum * this.size) / 2;
		this.xsize = this.xnum * this.size;
		this.ysize = this.ynum * this.size;

		// The arena has a grid and a piece
		this.grid;
		this.piece;
	}

	createGrid() {
		// Populates the grid of the arena with empty squares
		this.grid = [];
		for (let i = 0; i < this.ynum; i++) {
			this.grid.push([]);
			for (let j = 0; j < this.xnum; j++) {
				let newSquare = new Square(i, j, 0, 0);
				this.grid[i].push(newSquare);
			}
		}
	}

	createPiece() {
		console.log('calling create piece');
		// Creates a new piece
		let randomIndex = Math.floor(Math.random() * letters.length);
		this.piece = new Piece(letters[randomIndex]);
	}

	update() {
		if (!this.piece.falling) {
			this.createPiece();
		}
		else {
			// Update the current one, by only checking if it can move down
			this.piece.move('down');
		}

		// Lastly, check for rows to be deleted or the end of the game
		this.checkLose();
		this.checkDelete();
	}

	checkLose() {
		// Check if the player has lost by checking if there is a square in
		// the upper row
		for (let j = 0; j < this.xnum; j++) {
			if (this.grid[1][j].show) {
				master.endGame();
			}
		}
	}

	checkDelete() {
		// Check if a row has to be deleted. Count the number of deleted rows
		let rowsDeleted = 0;
		for (let i = 1; i < arena.ynum; i++) {
			let rowCount = 0;
			for (let j = 0; j < arena.xnum; j++) {
				if (this.grid[i][j].show == true) {
					rowCount++;
				}
			}
			if (rowCount == 10) {
				// Delete the row
				rowsDeleted++;
				this.deleteRow(i);
			}
		}

		// Assign score according to the number of rows deleted
		if (rowsDeleted == 1) {
			master.score = master.score + 40;
		}
		else if (rowsDeleted == 2) {
			master.score = master.score + 100;
		}
		else if (rowsDeleted == 3) {
			master.score = master.score + 300;
		}
		else if (rowsDeleted == 4) {
			master.score = master.score + 1200;
		}
		console.log(master.score);
	}

	deleteRow(index) {
		// Receives an index and deletes that row, moving the upper part of
		// the arena down on step
		for (let i = index; i > 0; i--) {
			for (let j = 0; j < this.xnum; j++) {
				this.grid[i][j].show = this.grid[i - 1][j].show;
			}
		}
	}

	display() {
		fill(0);
		rect(this.xstart, this.ystart, this.xsize, this.ysize);
		if (this.piece.falling) {
			this.piece.display();
		}
		for (let i = 0; i < this.ynum; i++) {
			for (let j = 0; j < this.xnum; j++) {
				this.grid[i][j].draw();
			}
		}
	}
}
