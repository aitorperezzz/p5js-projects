var ball;
var wall;

function setup() {
	createCanvas(500, 400);

	// create a ball and a rectangle
	ball = new Ball();
	wall = new Rectangle();
}

function draw() {
	background(150);

	// draw the rectangle, at the same location always
	fill(135, 206, 250);
	wall.draw();

	// move the ball and then check for collisions
	noStroke();
	fill(0, 0, 255);
	ball.bounceEdge();
	ball.move();
	ball.draw();
	ball.bounceRect(wall);
}

class Ball {
	constructor() {
		this.rad = 15;
		this.x = random(0, width);
		this.y = random(0, height);
		this.xspeed = random(3, 7);
		this.yspeed = random(3, 7);
	}

	draw() {
		ellipse(this.x, this.y, 2*this.rad, 2*this.rad);
	}

	move() {
		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;
	}

	bounceEdge() {
		// check in the right and left edges
		if (this.x > width || this.x < 0) {
			this.changeXspeed();
		}

		// check in the upper and lower edges
		if (this.y > height || this.y < 0) {
			this.changeYspeed();
		}
	}

	changeXspeed() {
		this.xspeed = -this.xspeed;
	}

	changeYspeed() {
		this.yspeed = -this.yspeed;
	}

	bounceRect(r) {
		// first check the sides of the rectangle
		if (this.x < r.right + this.rad && this.x > r.right && this.y > r.upper && this.y < r.lower) {
			this.changeXspeed();
		}

		if (this.x < r.left && this.x > r.left - this.rad && this.y > r.upper && this.y < r.lower) {
			this.changeXspeed();
		}

		if (this.y > r.upper - this.rad && this.y < r.upper && this.x > r.left && this.x < r.right) {
			this.changeYspeed();
		}

		if (this.y > r.lower && this.y < r.lower + this.rad && this.x > r.left && this.x < r.right) {
			this.changeYspeed();
		}

		// now check the edges of the rectangle
		if (this.x < r.left && this.y < this.upper && dist(r.left, r.upper, this.x, this.y) < this.rad) {
			this.bounceCorner(r);
		}

		if (this.x > r.right && this.y < r.upper && dist(r.right, r.upper, this.x, this.y) < this.rad) {
			this.bounceCorner(r);
		}

		if (this.x < r.left && this.y > r.lower && dist(r.left, r.lower, this.x, this.y) < this.rad) {
			this.bounceCorner(r);
		}

		if (this.x > r.right && this.y > r. lower && dist(r.right, r.lower, this.x, this.y) < this.rad) {
			this.bounceCorner(r);
		}
	}

	bounceCorner(r) {

	}

	cornerAngle(x, y, rx, ry) {
		return Math.atan((y - ry)/(x - rx)) % 90;
	}
}

// class for the rectangle
class Rectangle {
	constructor() {
		this.x = random(250, 350);
		this.y = random(100, 250);
		this.rectHeight = 150;
		this.rectWidth = 50;

		this.left = this.x;
		this.right = this.x + this.rectWidth;
		this.upper = this.y;
		this.lower = this.y + this.rectHeight;
	}

	draw() {
		rect(this.x, this.y, this.rectWidth, this.rectHeight);
	}

	frontSlash(x) {
		return this.upper + (this.lower - this.upper)/(this.left - this.right)*(x - this.right);
	}

	backSlash(x) {
		return this.upper + (this.lower - this.upper)/(this.right - this.left)*(x - this.left);
	}
}
