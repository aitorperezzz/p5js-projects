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

		// The variable bottom will be the accumulation of squares on the bottom
		// of the arena. They lose the property of being a Piece object
		this.bottom = [];
	}

	update() {
		if (!this.pieceFalling) {
			// If there's no piece falling, create a new one
			console.log('calling new piece');
			this.piece = new Piece('T');
			this.pieceFalling = true;
			this.canMoveDown = true;
			this.lastMovement = new Date();
		}
		else {
			this.piece.move('down');
			//this.checkEnd();
		}
		this.piece.maintain();
		if (!this.piece.canMoveDown && this.lastMovement > master.waitFor) {
			this.piece.leaveThere();
		}

		// Lastly check if there is a piece of the bottom that occupies the top
		// row, and in that case end the game
		for (let k = 0, n = this.bottom.length; k < n; k++) {
			if (this.bottom[k].j == this.ynum - 1) {
				master.endGame();
			}
		}
	}

	/*
	checkEnd() {
		// Checks if the piece has arrived to an end (it happens when the piece
		// reaches the floor of the canvas, or touches a piece at the bottom)
		if (this.piece.reachedFloor()) {
			// Leave it where it is by adding it to the bottom array
			this.leaveThere();
		}
	} */



	display() {
		fill(0);
		rect(this.xstart, this.ystart, this.xsize, this.ysize);
		if (this.pieceFalling) {
			this.piece.display();
		}
		for (let i = 0, n = this.bottom.length; i < n; i++) {
			this.bottom[i].draw();
		}
	}
}
