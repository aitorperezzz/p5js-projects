let cube;
let myCamera;

function setup() {
	createCanvas(800, 600);

	cube = new Cube(0, 0, 0, 100);
	myCamera = new Camera(50, 0, 0, [-1, 0, 0], 50);
}

function draw() {
	// cube,draw(camera);

}

class Point {
	// A point is a class, with three inner variables that represent the position
	// in the cartesian coordinate system
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
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
	}

	draw(cam) {
		// draw the cube as viewed from the camera
		let projPoints = [];
		for (let i = 0; i < this.points.length; i++) {
			projPoints.push(cam.giveProjection(this.points[i]));
		}

		// Draw the lines between the relevant points
		// line();
		// line();

	}
}

class Camera {
	constructor(x, y, z, direction, distance) {
		// receives a location and a direction of view, as well as
		// the parameter d, which is the distance to the viewing plane
		this.x = x;
		this.y = y;
		this.z = z;
		this.location = [this.x, this.y, this.z];
		this.xaxis = [0, 1, 0];
		this.dir = direction;
		this.zaxis = [1, 0, 0];
		console.log(this.xaxis);
		console.log(this.zaxis);
		this.yaxis = vectorProduct(this.zaxis, this.xaxis);
		console.log(this.yaxis);
		this.d = distance;
		this.xlimit = this.d;
		this.ylimit = height * this.d / width;
	}

	computeYAxis() {
		// gives the axes of the camera in the cartesian coordinate system
		this.yaxis = matrixProduct(this.z, this.x);
	}

	giveProjection(point) {
		// receives a point and gives the coordinates in the camera's
		// coordinate system
		let vector = vectorSum(point.location, vectorNeg(this.location));
		let Mmatrix = matrixBasis(camera.xaxis, camera.yaxis, camera.zaxis);
		let result = matrixProduct(matrixInverse(Mmatrix), vectorCol(vector));

		// Now apply projection rules to that vector (result)
		// Multiply the vector by
		let vectorinplane = vectorScalar(- this.d / this.z, result);
		vectorinplane.splice(2, 1);
		let pos = canvasPosition(vectorinplane);
	}

	canvasPosition(vector) {
		if (this.inFov(vector)) {
			let xCanvas = map(vector[0], -this.xlimit, this.xlimit, 0, width);
			let yCanvas = map(vector[1], -this.ylimit, this.ylimit, 0, height);
			return map()
		}

	}

	fieldOfView() {
		// Gives the x and y limits in the field of view of the camera,
		// this takes into account the distance of the camera to the plane
		this.xlimit = 2 * this.d;
		this.ylimit = heigth * 2 * this.d / width;
	}
}
