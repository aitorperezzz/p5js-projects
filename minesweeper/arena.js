class Arena {
	// This class receives a mode and creates some space for the
	// squares inside the canvas
	constructor(mode) {
		this.size = 30;
		if (mode == 'mode1') {
			this.xnum = 9;
			this.ynum = 9;
			this.numMines = 10;
		}
		else if (mode == 'mode2') {
			this.xnum = 16;
			this.ynum = 16;
			this.numMines = 40;
		}
		else if (mode == 'mode3') {
			this.xnum = 30;
			this.ynum = 16;
			this.numMines = 99;
		}

    // The number of squares that have been revealed
    this.revealedNum = 0;
    this.notMines = this.xnum * this.ynum - this.numMines;

		//this.numSquares = this.xnum * this.ynum;
		this.x = (width - this.xnum * this.size) / 2;
		this.y = 100 + (height - 100 - this.ynum * this.size) / 2;

		// Create a grid with the appropriate number of squares
		this.squares = [];
		for (let i = 0; i < this.xnum; i++) {
			this.squares.push([])
			for (let j = 0; j < this.ynum; j++) {
				let square = new Square(this.x + i * this.size, this.y + j * this.size, this.size, i, j);
				this.squares[i].push(square);
			}
		}

		// Populate some of the squares with the appropriate number of mines
		let minesPlaced = 0;
		while (minesPlaced < this.numMines) {
			let iCandidate = int(random(0, this.xnum));
			let jCandidate = int(random(0, this.ynum));
			if (this.squares[iCandidate][jCandidate].mine == false) {
				// Make this square a mine and update the number of mines placed
				this.squares[iCandidate][jCandidate].mine = true;
				minesPlaced++;
			}
		}

		// Calculate the number of surrounding mines for each square
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.assignNumber(this.squares[i][j]);
			}
		}
	}

	assignNumber(square) {
		// Receives a square and assigns the number of mines
		// surrounding it
		if (square.mine == false) {
			// In this case we have to assign a number
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					let xIndex = square.i + i;
					let yIndex = square.j + j;

					let accesible = xIndex >= 0 && xIndex < this.xnum && yIndex >= 0 && yIndex < this.ynum;
					let notSame = xIndex != square.i || yIndex != square.j;

					if (accesible && notSame) {
						// The square is accesible and different from the one being analysed, so
						// check if it has a mine and update number
						if (this.squares[xIndex][yIndex].mine) {
							square.number++;
						}
					}
				}
			}
		}
	}


	draw() {
		// Call the draw function for each square
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.squares[i][j].draw();
			}
		}
	}

	isClicked(mx, my) {
		// Receives the mouse location and decides if the arena has been clicked
		let xClicked = (this.x < mx && mx < this.x + this.xnum * this.size);
		let yClicked = (this.y < my && my < this.y + this.ynum * this.size);
		return xClicked && yClicked;
	}

	squareClicked(mx, my) {
		// receives mouse location and returns the square that has been clicked
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				if (this.squares[i][j].isClicked(mx, my)) {
					return this.squares[i][j];
				}
			}
		}
	}

	reveal() {
		// Reveal every square
		for (let i = 0; i < this.xnum; i++) {
			for (let j = 0; j < this.ynum; j++) {
				this.squares[i][j].revealed = true;
			}
		}
	}

	flood(square) {
		// Flood the surroundings of the given square, which we know does not
		// have neighbors
		square.revealed = true;
    this.revealedNum++;

		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let xIndex = square.i + i;
				let yIndex = square.j + j;
				let accesible = xIndex >= 0 && xIndex < this.xnum && yIndex >= 0 && yIndex < this.ynum;
				let notSame = xIndex != square.i || yIndex != square.j;

				if (accesible && notSame) {
					// I can access it, so get the square
					let neighbor = this.squares[xIndex][yIndex];
					if (neighbor.number == 0 && !neighbor.revealed) {
            // Call flood recursively
						this.flood(neighbor);
					}
          else if (neighbor.number != 0 && !neighbor.revealed) {
            // Just reveal it and update the number of revealed squares
            neighbor.revealed = true;
            this.revealedNum++;
          }
				}
			}
		}
	}
}
