class Arena {
	constructor() {
		this.size = gridSize;
		this.xnum = 10;
		this.ynum = 20;
		this.xstart = (width - this.xnum * this.size) / 2;
		this.ystart = (height - this.ynum * this.size) / 2;
		this.xsize = this.xnum * this.size;
		this.ysize = this.ynum * this.size;

		this.piece;
		this.pieceFalling = false;
		this.grid;
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

	update() {
		if (!this.pieceFalling) {
			// If there's no piece falling, create a new one
			let randomIndex = Math.floor(Math.random() * letters.length);
			this.piece = new Piece(letters[randomIndex]);
			this.pieceFalling = true;
			this.canMoveDown = true;
			this.lastMovement = new Date();
		}
		else {
			this.piece.move('down');
		}
		this.piece.maintain();
		if (!this.piece.canMoveDown && this.lastMovement > master.waitFor) {
			this.piece.leaveThere();
		}

		// Lastly check if there is a piece of the bottom that occupies the top
		// row, and in that case end the game
		for (let j = 0; j < this.xnum; j++) {
			if (this.grid[1][j].show) {
				master.endGame();
			}
		}

		// Check if a row has to be deleted
		for (let i = 1; i < arena.ynum; i++) {
			let rowCount = 0;
			for (let j = 0; j < arena.xnum; j++) {
				if (this.grid[i][j].show) {
					rowCount++;
				}
			}
			if (rowCount == 10) {
				// Delete the row
				console.log('deleting row', i);
				this.deleteRow(i);
			}
		}
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
		if (this.pieceFalling) {
			this.piece.display();
		}
		for (let i = 0; i < this.ynum; i++) {
			for (let j = 0; j < this.xnum; j++) {
				this.grid[i][j].draw();
			}
		}
	}
}
