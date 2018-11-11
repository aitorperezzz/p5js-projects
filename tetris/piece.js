class Piece {
	// A piece is a block of four pieces
	constructor(label) {
		// Receives the type of piece in a string and creates the piece in a
		// default position
		this.label = label;
		let color = 'red';
		let piece1 = new Square(arena.xnum / 2, 1, color);
		let piece2 = new Square(piece1.i - 1, piece1.j, color);
		let piece3 = new Square(piece1.i, piece1.j - 1, color);
		let piece4 = new Square(piece1.i + 1, piece1.j, color);
		this.squares = [piece1, piece2, piece3, piece4];

		// Variables to prevent the piece from falling out of the sides
		// of the canvas
		this.iMax = 0;
		this.iMin = arena.xnum - 1;
	}

	move(here) {
		if (this.canMove(here)) {
			this.shift(here);
			this.maintain();
		}
	}

	canMove(here) {
		// Move the piece in a certain direction
		if (here == 'right' && this.rightConditions()) {
			return true;
		}
		else if (here == 'left' && this.leftConditions()) {
			return true;
		}
		else if (here == 'down') {
			return true;
		}
		else {
			return false;
		}
	}

	rightConditions() {
		// The piece can move right if it is not touching the right edge of the canvas and
		// there's no piece to the right
		let touchingEdge = this.iMax == arena.xnum - 1;
		let pieceRight = false;
		for (let k = 0, n = arena.bottom.length; k < n; k++) {
			for (let l = 0; l < 4; l++) {
				if (this.squares[l].i + 1 == arena.bottom[k]) {
					pieceRight = true;
					break;
				}
			}
		}
		return !touchingEdge && !pieceRight;
	}

	leftConditions() {
		// The piece can move left if it is not touching the left edge of the canvas and
		// there's no piece to the left
		let touchingEdge = this.iMin == 0;
		let pieceLeft = false;
		for (let k = 0, n = arena.bottom.length; k < n; k++) {
			for (let l = 0; l < 4; l++) {
				if (this.squares[l].i + 1 == arena.bottom[k]) {
					pieceLeft = true;
					break;
				}
			}
		}
		return !touchingEdge && !pieceLeft;
	}

	colliding(square) {
		// Receives a square and decides if the piece is going to collide with a squares
	}

	shift(here) {
		for (let i = 0; i < 4; i++) {
			this.squares[i].move(here);
		}
	}

	maintain() {
		// Update some values after the piece has been moved
		let imax = 0;
		let imin = arena.xnum - 1;
		for (let k = 0; k < 4; k++) {
			if (this.squares[k].i < imin) {
				imin = this.squares[k].i;
			}
			if (this.squares[k].i > imax) {
				imax = this.squares[k].i;
			}
			this.squares[k].maintain();
		}
		console.log(this.iMax, this.iMin);
		this.iMin = imin;
		this.iMax = imax;
	}

	display() {
		for (let i = 0; i < 4; i++) {
			this.squares[i].draw();
		}
	}

	reachedFloor() {
		// Decides if the piece has reached the floor (so it should not be
		// able to move in the next iteration)
		for (let k = 0; k < 4; k++) {
			if (this.squares[k].j == arena.ynum - 1) {
				return true;
			}
		}
		return false;
	}

	collidedBottom() {
		// Decides if it has collided with the squares in the bottom of the arena
		for (let k = 0; k < 4; k++) {
			for (let l = 0; l < arena.bottom.length; l++) {
				let sameColumn = this.squares[k].i == arena.bottom[l].i;
				let collide = this.squares[k].j + 1 == arena.bottom[l].j;
				if (sameColumn && collide) {
					return true;
				}
			}
		}
		return false;
	}

}
