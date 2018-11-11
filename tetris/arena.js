class Arena {
	// The arena consists of a grid of available positions and a piece that is
	// falling, and some pieces accumulated at the bottom
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
			// If there's no piece, create a new one
			this.piece = new Piece('T');
			this.pieceFalling = true;
		}
		else {
			this.checkEnd();
			this.piece.move('down');
		}
		this.piece.maintain();
		//checkEnd();
	}

	checkEnd() {
		// Checks if the piece has arrived to an end (it can reach the floor of
		// the canvas, or collide with another piece at the bottom )
		if (this.piece.reachedFloor() || this.piece.collidedBottom()) {
			// Leave it where it is by adding it to the bottoms
			console.log('getting here');
			this.leaveThere();
		}
	}


	leaveThere() {
		// Leaves the current piece where it is, and sets the stage for creating
		// a new one
		for (let k = 0; k < 4; k++) {
			this.bottom.push(this.piece.squares[k]);
			console.log(this.bottom.length);
		}
		this.piece = new Piece('T');
	}

	display() {
		fill(155);
		rect(this.xstart, this.ystart, this.xsize, this.ysize);
		if (this.pieceFalling) {
			this.piece.display();
		}
		for (let i = 0, n = this.bottom.length; i < n; i++) {
			this.bottom[i].draw();
		}
	}
}
