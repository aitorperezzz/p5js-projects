class Square {
	// Has an index in the grid and a color associated
	constructor(i, j, irel, jrel) {
		// This is the position of the square on the overall grid
		this.i = i;
		this.j = j;

		// We also need the position of each square with respect to the others
		// that form the piece, so it can be rotated
		this.iRelative = irel;
		this.jRelative = jrel;

		this.size = gridSize;
		this.x = arena.xstart + this.i * this.size;
		this.y = arena.ystart + arena.ysize - this.j * this.size;
		this.color = color;
	}

	move(where) {
		// Just move the square, because this code is only reached when all
		// the conditions have been met
		if (where == 'down') {
			this.j--;
		}
		else if (where == 'right') {
			this.i++;
		}
		else if (where == 'left') {
			this.i--;
		}
	}

	maintain(center) {
		// Update the rest of the variables after a change to i and j, or
		// relative i and relative j
		this.i = center.i + this.iRelative;
		this.j = center.j + this.jRelative;
		this.x = arena.xstart + this.i * this.size;
		this.y = arena.ystart + arena.ysize - this.j * this.size;
	}

	draw() {
		fill(0, 255, 0);
		rect(this.x, this.y - this.size, this.size, this.size);
	}
}
