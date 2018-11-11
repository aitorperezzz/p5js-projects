class Square {
	// Has an index in the grid and a color associated
	constructor(i, j, color) {
		this.i = i;
		this.j = j;
		this.size = gridSize;
		this.x = arena.xstart + this.i * this.size;
		this.y = arena.ystart + this.j * this.size;
		this.color = color;
	}

	move(where) {
		// To arrive here, the conditions for moving have been met, so just move
		if (where == 'down') {
			this.j++;
		}
		else if (where == 'right') {
			this.i++;
		}
		else if (where == 'left') {
			this.i--;
		}
	}

	maintain() {
		// After moving, the variables of each square have to be updated
		this.x = arena.xstart + this.i * this.size;
		this.y = arena.ystart + this.j * this.size;
	}

	draw() {
		fill(0);
		rect(this.x, this.y, this.size, this.size);
	}
}
