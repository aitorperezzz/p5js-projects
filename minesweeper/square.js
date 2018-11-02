class Square {
  // This class receives a position, a size and an index and creates a
  // square to be put inside the arena
	constructor(xpos, ypos, size, i, j) {
		// Variables that store location information
		this.x = xpos;
		this.y = ypos;
		this.size = size;
		this.i = i;
		this.j = j;

		// Number of mines surrounding the square, to be updated
		// after construction
		this.number = 0;

		// Initialize variables that store game information
		this.revealed = false;
		this.mine = false;
		this.flag = false;
	}

	draw() {
		// The background color of a square is darker if it has not been
		// revealed
		stroke(100);
		strokeWeight(2);
		if (this.revealed) {
			fill(190);
		}
		else {
			fill(150);
		}
		rect(this.x, this.y, this.size, this.size);

		// Draw flags if necessary
		if (this.flag) {
			noStroke();
			fill(255, 0, 0);
			ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2);
		}

		// Draw the rest of the things
		if (this.revealed) {
			// Draw the content
			if (this.mine) {
				// Draw an ellipse simulating the mine
				noStroke();
				fill(0);
				ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2);
			}
			else if (this.number != 0) {
				// Draw the number
				noStroke();
				fill(0);
				textAlign(CENTER);
				text(this.number, this.x + this.size / 2, this.y + this.size * (2/3));
			}
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the square has been clicked
		let xClicked = (this.x <= mx && mx < this.x + this.size);
		let yClicked = (this.y <= my && my < this.y + this.size);
		return xClicked && yClicked;
	}

	whenClicked(mouseButton) {
		// The square has been clicked, so do something
		if (this.mine) {
			// End the game
			master.endGame('lose');
		}
		else if (this.number != 0) {
			// Reveal the square
			this.revealed = true;
      arena.revealedNum++;
		}
		else if (this.number == 0) {
			// Call flood recursively
			arena.flood(this);
		}
	}
}
