let cube;
let myCam;

let step = 5;

function setup() {
	createCanvas(800, 600);

	cube = new Cube(0, 0, 0, 30);
	myCam = new Camera(100, 0, 0, [-1, 0, 0], 30);
}

function draw() {
	background(150);

	cube.draw(myCam);
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		myCam.moveRight();
	}
	if (keyCode === LEFT_ARROW) {
		myCam.moveLeft();
	}
	if (keyCode === UP_ARROW) {
		myCam.moveUp();
	}
	if (keyCode === DOWN_ARROW) {
		myCam.moveDown();
	}
}

/*
function mousePressed() {
	myCam.updateDirection(mouseX, mouseY);
}
*/

class Point2D {
	// A 2D point is a point that belongs in a plane (normally the
	// plane of view of a camera)
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.position = [this.x, this.y];
	}
}

class Point {
	// A point is a class, with three inner variables that represent the position
	// in the cartesian coordinate system
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.position = [this.x, this.y, this.z];
	}
}

class Cube {
	constructor(x, y, z, size) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.size = size;

		// Create all the points in the cube, which will be stored as an array
		// of object points
		this.points = [];
		for (let i = 0; i < 8; i++) {
			let newPoint;
			if (i == 0) {
				newPoint = new Point(this.x, this.y, this.z);
			}
			else if (i == 1) {
				newPoint = new Point(this.x + this.size, this.y, this.z);
			}
			else if (i == 2) {
				newPoint = new Point(this.x, this.y + this.size, this.z);
			}
			else if (i == 3) {
				newPoint = new Point(this.x + this.size, this.y + this.size, this.z);
			}
			else if (i == 4) {
				newPoint = new Point(this.x, this.y, this.z + this.size);
			}
			else if (i == 5) {
				newPoint = new Point(this.x + this.size, this.y, this.z + this.size);
			}
			else if (i == 6) {
				newPoint = new Point(this.x, this.y + this.size, this.z + this.size);
			}
			else if (i == 7) {
				newPoint = new Point(this.x + this.size, this.y + this.size, this.z + this.size);
			}
			this.points.push(newPoint);
		}

		// Lastly, create the floor and roof of the cube, for easily drawing the
		// edges later
		this.floor = [this.points[0], this.points[1], this.points[3], this.points[2]];
		this.roof = [this.points[4], this.points[5], this.points[7], this.points[6]];

	}

	draw(cam) {
		// First call displayPoints to get the projections of each point, as 2D
		// point objects that belong in the current plane of view of the camera
		let projPoints = this.displayPoints(cam);

		// Paint each point in the canvas using canvasPosition
		let canvasPos = [];
		for (let i = 0; i < 2; i++) {
			let newLine = [];
			for (let j = 0; j < 4; j++) {
				let x = cam.canvasPosition(projPoints[i][j])[0];
				let y = cam.canvasPosition(projPoints[i][j])[1];
				newLine.push([x, y]);
			}
			canvasPos.push(newLine);
		}

		// Now we have the canvas positions, we have to draw
		for (let j = 0; j < 4; j++) {
			// Draw the points as ellipses
			for (let i = 0; i < 2; i++) {
				// No need to draw the points now
				/*
				noStroke();
				fill(0);
				ellipse(canvasPos[i][j][0], canvasPos[i][j][1], 5, 5); */

				// Draw the lines on the floor and on the roof
				stroke(0);
				strokeWeight(4);
				line(canvasPos[i][j % 4][0], canvasPos[i][j % 4][1], canvasPos[i][(j + 1) % 4][0], canvasPos[i][(j + 1) % 4][1]);
			}
			// Draw the vertical lines of the cube
			stroke(0);
			strokeWeight(4);
			line(canvasPos[0][j][0], canvasPos[0][j][1], canvasPos[1][j][0], canvasPos[1][j][1]);
		}
	}

	displayPoints(cam) {
		// Get the projection of the floor
		let projFloor = [];
		for (let i = 0; i < this.floor.length; i++) {
			let newProj = cam.giveProjection(this.floor[i]);
			projFloor.push(newProj);
		}
		// Get the projection of the roof
		let projRoof = [];
		for (let i = 0; i < this.roof.length; i++) {
			let newProj = cam.giveProjection(this.roof[i]);
			projRoof.push(newProj);
		}
		return [projFloor, projRoof];
	}
}

class Camera {
	constructor(x, y, z, direction, distance) {
		// receives a location and a direction of view, as well as
		// the parameter d, which is the distance to the viewing plane
		this.x = x;
		this.y = y;
		this.z = z;
		this.position = [this.x, this.y, this.z];
		this.xaxis = [0, 1, 0];
		this.dir = direction;
		this.zaxis = [1, 0, 0];
		this.yaxis = vectorProduct(this.zaxis, this.xaxis);
		this.d = distance;
		this.xlimit = this.d;
		this.ylimit = height * this.d / width;
	}

	updatePosition() {
		this.position = [this.x, this.y, this.z];
	}

	updateDirection(mx, my) {
		let point = this.canvasPositionInverse(mx, my);

		let inPlane = [point.x, point.y, -this.d];
		let Mmatrix = matrixBasis(this.xaxis, this.yaxis, this.zaxis);
		let result = matrixProduct(Mmatrix, vectorCol(inPlane));
		this.dir = vectorNormalize(result);
		this.updateAxes();
	}

	updateAxes() {
		this.zaxis = vectorScalar(-1, this.dir);
		this.giveXaxis();
		this.yaxis = vectorProduct(this.zaxis, this.xaxis);
	}

	giveXaxis() {
		// Given the current direction, give an x axis which is parallel to the ground
		let vector = [];
		vector[0] = this.dir[1];
		vector[1] = -this.dir[0];
		vector[2] = 0;
		return vectorNormalize(vector);
	}

	/*
	computeYAxis() {
		// gives the axes of the camera in the cartesian coordinate system
		this.yaxis = matrixProduct(this.z, this.x);
	} */

	giveProjection(point) {
		// Receives a 3D point and gives the corresponding 2D point,
		// as viewed from the camera
		let vector = vectorSum(point.position, vectorNeg(this.position));
		let Mmatrix = matrixBasis(this.xaxis, this.yaxis, this.zaxis);
		let result = vectorRow(matrixProduct(matrixInverse(Mmatrix), vectorCol(vector)));

		// Now apply projection rules to that vector (result)
		let inPlane = vectorScalar(-this.d / result[2], result);
		inPlane.splice(2, 1);
		let projPoint = new Point2D(inPlane[0], inPlane[1]);
		return projPoint;
	}

	/*
	reverseProjection(point) {
		// Receives a 2D point in the plane of vision and returns the 3D point
		// that belongs inside the plane of vision
		let inPlane = point.position.push(-this.d);
		let vector = vectorSum(this.position, inPlane);
		let Mmatrix = matrixBasis(this.xaxis, this.yaxis, this.zaxis);
		let result = matrixProduct(Mmatrix, vectorCol(vector));
		this.dir = result;
	}

	/*
	canvasLimits() {
		// Updates the canvas limits
		this.xlimit = this.d;
		this.ylimit = height * this.d / width;
	} */

	canvasPosition(point) {
		// Receives a 2D point and gives the coordinates for use in p5js
		let x = map(point.x, -this.xlimit, this.xlimit, 0, width);
		let y = map(point.y, -this.ylimit, this.ylimit, height, 0);
		return [x, y];
	}

	canvasPositionInverse(mx, my) {
		// Receives an x and a y in the canvas and returns x and y coordinates
		// in the plane of view (returns a type Point2D)
		let x = map(mx, 0, width, -this.xlimit, this.xlimit);
		let y = map(my, 0, height, this.ylimit, -this.ylimit);
		let newPoint = new Point2D(x, y);
		return newPoint;
	}

	/*
	fieldOfView(point2D) {
		// Receives a 2D point in the plane of view and decides if it is inside



		// Gives the x and y limits in the field of view of the camera,
		// this takes into account the distance of the camera to the plane
		this.xlimit = 2 * this.d;
		this.ylimit = heigth * 2 * this.d / width;
	} */

	moveRight() {
		this.y = this.y + step;
		this.updatePosition();
	}

	moveLeft() {
		this.y = this.y - step;
		this.updatePosition();
	}

	moveUp() {
		this.z = this.z + step;
		this.updatePosition();
	}

	moveDown() {
		this.z = this.z - step;
		this.updatePosition();
	}
}
