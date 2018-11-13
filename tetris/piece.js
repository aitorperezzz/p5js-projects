class Piece {
	// A piece is a block of four squares
	constructor(label) {
		// Receives the type of piece in a string and creates the piece in the
		// default position
		this.label = label;
		let center = new Square(1, arena.xnum / 2, 0, 0);
		let piece1;
		let piece2;
		let piece3;

		if (this.label == 'T') {
			piece1 = new Square(center.i, center.j - 1, 0, -1);
			piece2 = new Square(center.i + 1, center.j, 1, 0);
			piece3 = new Square(center.i, center.j + 1, 0, 1);
		}
		else if (this.label == 'leftL') {
			piece1 = new Square(center.i, center.j - 1, 0, -1);
			piece2 = new Square(center.i + 1, center.j - 1, 1, -1);
			piece3 = new Square(center.i, center.j + 1, 0, 1);
		}
		else if (this.label == 'rightL') {
			piece1 = new Square(center.i, center.j - 1, 0, -1);
			piece2 = new Square(center.i, center.j + 1, 0, 1);
			piece3 = new Square(center.i + 1, center.j + 1, 1, 1);
		}
		else if (this.label == 'rightS') {
			piece1 = new Square(center.i + 1, center.j - 1, 1, -1);
			piece2 = new Square(center.i + 1, center.j, 1, 0);
			piece3 = new Square(center.i, center.j + 1, 0, 1);
		}
		else if (this.label == 'leftS') {
			piece1 = new Square(center.i, center.j - 1, 0, -1);
			piece2 = new Square(center.i + 1, center.j, 1, 0);
			piece3 = new Square(center.i + 1, center.j + 1, 1, 1);
		}
		else if (this.label == 'Q') {
			piece1 = new Square(center.i + 1, center.j, 1, 0);
			piece2 = new Square(center.i, center.j + 1, 0, 1);
			piece3 = new Square(center.i + 1, center.j + 1, 1, 1);
		}
		else if (this.label == 'I') {
			piece1 = new Square(center.i, center.j - 2, 0, -2);
			piece2 = new Square(center.i, center.j - 1, 0, -1);
			piece3 = new Square(center.i, center.j + 1, 0, 1);
		}

		this.squares = [center, piece1, piece2, piece3];
		for (let i = 0; i < 4; i++) {
			this.squares[i].show = true;
		}

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
		return false;
	}

	rightConditions() {
		for (let k = 0; k < 4; k++) {
			// If it is next to the right edge of the canvas, it cannot move right
			if (this.squares[k].j == arena.xnum - 1) {
				return false;
			}
			// If there's a square to its right, it cannot move right (also, the indeices
			// to be checked are accesible per the last condition)
			if (arena.grid[this.squares[k].i][this.squares[k].j + 1].show) {
				return false;
			}
		}
		return true;
	}

	leftConditions() {
		for (let k = 0; k < 4; k++) {
			// If it is next to the left edge of the canvas, it cannot move left
			if (this.squares[k].j == 0) {
				return false;
			}
			// If there's a square to its left, it cannot move left
			if (arena.grid[this.squares[k].i][this.squares[k].j - 1].show) {
				return false;
			}
		}
		return true;
	}

	downConditions() {
		for (let k = 0; k < 4; k++) {
			// Check if the square has reached the floor
			if (this.squares[k].i == arena.ynum - 1) {
				this.leaveThere();
				return false;
			}
			// Check if the square has a piece below it
			if (arena.grid[this.squares[k].i + 1][this.squares[k].j].show) {
				this.canMoveDown = false;
				this.lastMovement = new Date();
				return false;
			}
		}
		return true;
	}

	leaveThere() {
		// Leaves the current piece where it is, and sets the stage for creating
		// a new one
		for (let k = 0; k < 4; k++) {
			arena.grid[this.squares[k].i][this.squares[k].j].show = true;
		}
		arena.pieceFalling = false;
	}

	shift(here) {
		for (let i = 0; i < 4; i++) {
			this.squares[i].move(here);
		}
	}

	maintain() {
		for (let i = 0; i < 4; i++) {
			this.squares[i].maintain(this.squares[0]);
		}
	}

	display() {
		for (let i = 0; i < 4; i++) {
			this.squares[i].draw();
		}
	}

	/*
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
	} */

	rotate() {
		// Simulate the rotation and if it is allowed, proceed to make it happen
		// This always rotates the piece 90 degrees to the right
		if (this.label == 'Q') {
			// The square is not allowed to rotate
			return;
		}
		let center = this.squares[0];
		let simulation = [new Square(center.i, center.j, 0, 0)];
		for (let k = 1; k < 4; k++) {
			let oldi = this.squares[k].iRelative;
			let oldj = this.squares[k].jRelative;
			let newSquare = new Square(center.i + oldj, center.j - oldi, oldj, -oldi);
			if (newSquare.notAllowed()) {
				return;
			}
			simulation.push(newSquare);
		}

		// If it reached here, the rotation is allowed, so push the changes to
		// the piece
		for (let i = 1; i < 4; i++) {
			this.squares[i] = simulation[i];
			this.squares[i].show = true;
		}
	}
}
