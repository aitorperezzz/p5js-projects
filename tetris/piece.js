class Piece {
	// A piece is a block of four pieces
	constructor(label) {
		// Receives the type of piece in a string and creates the piece in the
		// default position
		this.label = label;
		// TODO: MAKE ALL THE POSSIBLE SHAPES
		let center = new Square(arena.xnum / 2, arena.ynum - 2, 0, 0);
		let piece2 = new Square(center.i - 1, center.j, -1, 0);
		let piece3 = new Square(center.i, center.j + 1, 0, 1);
		let piece4 = new Square(center.i + 1, center.j, 1, 0);
		this.squares = [center, piece2, piece3, piece4];

		// The maximum and minimum i of all the squares in the piece. Useful for
		// not leaving the arena on the right and left edges
		this.iMax = 0;
		this.iMin = arena.xnum - 1;

		// Variable to know if the piece can fall doen still. If it cannot, and there
		// has been no movement recently, then the piece can be left at the bottom
		this.canMoveDown = true;
		this.lastMovement = new Date();
	}

	move(here) {
		if (this.canMove(here)) {
			// Shift the whole piece and update the inner variables
			this.shift(here);
			this.maintain();
		}
	}

	canMove(here) {
		// Move the piece in a certain direction if it is allowed
		if (here == 'right' && this.rightConditions()) {
			return true;
		}
		else if (here == 'left' && this.leftConditions()) {
			return true;
		}
		else if (here == 'down' && this.downConditions()) {
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
				if (this.squares[l].i + 1 == arena.bottom[k].i && this.squares[l].j == arena.bottom[k].j) {
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
				if (this.squares[l].i - 1 == arena.bottom[k].i && this.squares[l].j == arena.bottom[k].j) {
					pieceLeft = true;
					break;
				}
			}
		}
		return !touchingEdge && !pieceLeft;
	}

	downConditions() {
		// The piece can move down if it has no piece below and also is not
		// touching the floor
		console.log(this.canMoveDown);
		// First check if it is going to hit the floor
		for (let k = 0; k < 4; k++) {
			if (this.squares[k].j == 0) {
				this.leaveThere();
				return false;
			}
		}

		// Now check if it will hit the squares at the bottom
		for (let k = 0; k < 4; k++) {
			for (let l = 0, n = arena.bottom.length; l < n; l++) {
				if (arena.bottom[l].i == this.squares[k].i && arena.bottom[l].j + 1 == this.squares[k].j) {
					// In this case, the piece cannot continue falling down
					this.canMoveDown = false;
					this.lastMovement = new Date();
					return false;
				}
			}
		}
		return true;
	}

	leaveThere() {
		// Leaves the current piece where it is, and sets the stage for creating
		// a new one
		for (let k = 0; k < 4; k++) {
			arena.bottom.push(this.squares[k]);
		}
		arena.pieceFalling = false;
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
			// Maintain the squares themselves
			this.squares[k].maintain(this.squares[0]);
		}
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

	rotate() {
		// Rotate the piece 90 degrees to the right
		for (let k = 0; k < 4; k++) {
			let oldi = this.squares[k].iRelative;
			let oldj = this.squares[k].jRelative;
			this.squares[k].iRelative = oldj;
			this.squares[k].jRelative = -oldi;
			this.maintain();
		}
	}
}
