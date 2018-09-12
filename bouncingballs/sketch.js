var number = 4;
var balls = [number];
var currentNumber = 0;
var rad, x, y, data;
var alfa, theta1, theta2, v1tan, v1perp, v2tan, v2perp, energy;
var sol1, sol2, v1tanfinal, v2tanfinal, alfa1final, alfa2final, As, Bs, Cs, d;

function setup() {
	createCanvas(800, 600);

	// create a certain number of balls
	for (i = 0; i < number; i++) {
		if (i == 0) {
			data = givePossibilities();
			balls[0] = new Ball(data[0], data[1], data[2]);
		} else {
			do {
				data = givePossibilities();
			} while (overlaps(data) == true);
			balls[i] = new Ball(data[0], data[1], data[2]);
		}
		// update the number of created balls
		currentNumber = currentNumber + 1;
	}
}

function givePossibilities() {
	rad = random(40, 60);
	x = random(rad, width - rad);
	y = random(rad, height - rad);
	return [rad, x, y];
}

function overlaps([rad, x, y]) {
	// loop over the already created balls in balls array and check distance
	for (i = 0; i < balls.length; i++) {
		if (Math.sqrt(Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)) < balls[i].rad + rad) {
			return true;
		}
	}
	return false;
}

function draw() {
	// draw the background each time
	background(150);

	// draw some balls and check for the edges
	noStroke();

	for (i = 0; i < number; i++) {
		fill(255, 0, 150);
		balls[i].checkEdge();
		balls[i].move();
		balls[i].draw();
		fill(0);
		text(balls[i].label, balls[i].x, height - balls[i].y + 3);
	}

	// check, for couples that are different, if a collision is needed
	for (i = 0; i < number; i++) {
		for (j = i + 1; j < number; j++) {
			balls[i].checkBall(balls[j]);
		}
	}
}

class Ball {
	constructor(rad, x, y) {
		this.rad = rad;
		this.x = x;
		this.y = y;
		this.label = currentNumber + 1;
		/*
		the positions and velocities correspond to a cartesian coordinate system
		where the (0, 0) is the bottom left: a physics coordinate system
		*/
		this.xspeed = random(-3, 3);
		this.yspeed = random(-3, 3);

		// keep track of the last position the ball was at
		// for now, initialize with the position itself
		this.lastx = this.x;
		this.lasty = this.y;

		/*
		mass is calculated as the radius squared, this is, mass is proportional
		to the surface of the circle
		*/
		this.mass = Math.pow(this.rad, 2);
		this.speed = Math.sqrt(Math.pow(this.xspeed, 2) + Math.pow(this.yspeed, 2));
		this.angle = giveAtan(this.xspeed, this.yspeed);
		this.energy = (1/2) * this.mass * Math.pow(this.speed, 2);

		this.lastWith = 0;
		this.timeEllapsed = 0;
	}

	draw() {
		/*
		draw the circles knowing the choice of axes is different: in p5 the
		(0, 0) is the upper left corner
		*/
		ellipse(this.x, height - this.y, 2*this.rad, 2*this.rad);
	}

	move() {
		// first update the last position the ball was at
		this.lastx = this.x;
		this.lasty = this.y;

		// change values in the cartesian coordinate system
		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;

		this.timeEllapsed = this.timeEllapsed + 1;
	}

	checkEdge() {
		// if it reaches the right and left edges of the canvas
		if (this.x < this.rad) {
			this.xspeed = Math.abs(this.xspeed);
			this.updateAngle();
		}

		if (this.x > width - this.rad) {
			this.xspeed = - Math.abs(this.xspeed);
			this.updateAngle();
		}

		// if it reaches the upper and lower edges of the canvas
		if (this.y < this.rad) {
			this.yspeed = Math.abs(this.yspeed);
			this.updateAngle();
		}

		if (this.y > height - this.rad) {
			this.yspeed = - Math.abs(this.yspeed);
			this.updateAngle();
		}
	}

	checkBall(ball) {
		if (this.touching(ball) && this.lastCollision(ball) == false) {
			this.collision(ball);
		}
	}

	touching(ball) {
		// merely check the distance between the two balls
		return this.giveDist(ball) < this.rad + ball.rad + 1;
	}

	giveDist(ball) {
		return dist(this.x, height - this.y, ball.x, height - ball.y);
	}

	lastCollision(ball) {
		// this function checks if two balls have recently had a collision
		if (this.lastWith != ball.label || ball.lastWith != this.label) {
			return false;
		}	else if ( this.timeEllapsed > 20) {
				return false;
		} else {
			return true;
		}
	}

	collision(ball) {
		// make the balls return to their last positions (so they are separated)
		this.goBack();
		ball.goBack();

		// this function handles the collision
		console.log('entering collision now')
		// first we define the line of colission by getting the angles right
		alfa = giveAtan(ball.x - this.x, ball.y - this.y);
		theta1 = this.angle - alfa;
		theta2 = ball.angle - alfa;

		/*
		get the speeds according to new axes: the line of collision as tangent
		and the perpendicular to that one
		*/
		v1tan = this.speed * Math.cos(theta1);
		v1perp = this.speed * Math.sin(theta1);
		v2tan = ball.speed * Math.cos(theta2);
		v2perp = ball.speed * Math.sin(theta2);

		/*
		perpendicular velocities stay the same because of conservation of
		momentum, the tangent velocity changes by applying conservation
		of momentum in one dimension, and conservation of energy
		*/
		energy = this.energy + ball.energy;

		// solve second degree equation
		As = Math.pow(ball.mass, 2)/this.mass + ball.mass;
		Bs = -2*(ball.mass/this.mass)*(this.mass*v1tan + ball.mass*v2tan);
		Cs = Math.pow(this.mass*v1tan + ball.mass*v2tan, 2)/this.mass +
			this.mass*Math.pow(v1perp, 2) + ball.mass*Math.pow(v2perp, 2) -2*energy;

		// these are the two solutions of the equation
		sol1 = (-Bs + Math.sqrt(Bs*Bs - 4*As*Cs))/(2*As);
		sol2 = (-Bs - Math.sqrt(Bs*Bs - 4*As*Cs))/(2*As);

		/*
		now choose the right solution for the tangent velocity of the second ball,
		the one that is opposite to the initial one
		*/
		if (sol1*v2tan < 0) {
			v2tanfinal = sol1;
		}
		else {
			v2tanfinal = sol2;
		}

		// now update the final tangent velocity for the first ball
		v1tanfinal = (this.mass*v1tan + ball.mass*v2tan - ball.mass*v2tanfinal)/this.mass;

		// update the final speeds for the two balls
		this.speed = Math.sqrt(Math.pow(v1tanfinal, 2) + Math.pow(v1perp, 2));
		ball.speed = Math.sqrt(Math.pow(v2tanfinal, 2) + Math.pow(v2perp, 2));

		// update the new angle in the cartesian system of coordinates
		alfa1final = giveAtan(v1tanfinal, v1perp) + alfa;
		alfa2final = giveAtan(v2tanfinal, v2perp) + alfa;

		// update the other parameters that have changed, for each of the balls
		this.xspeed = this.speed * Math.cos(alfa1final);
		ball.xspeed = ball.speed * Math.cos(alfa2final);
		this.yspeed = this.speed * Math.sin(alfa1final);
		ball.yspeed = ball.speed * Math.sin(alfa2final);
		this.angle = giveAtan(this.xspeed, this.yspeed);
		ball.angle = giveAtan(ball.xspeed, ball.yspeed);
		this.energy = (1/2) * this.mass * Math.pow(this.speed, 2);
		ball.energy = (1/2) * ball.mass * Math.pow(ball.speed, 2);

		this.lastWith = ball.label;
		ball.lastWith = this.label;

		this.timeEllapsed = 0;
		ball.timeEllapsed = 0;
	}

	goBack() {
		this.x = this.lastx;
		this.y = this.lasty;
	}

	updateAngle() {
		this.angle = giveAtan(this.xspeed, this.yspeed);
	}
}

/*
auxiliary function that returns the right arctan angle according to
the sign of the parts
*/
function giveAtan(dx, dy) {
	if (dx < 0) {
		return Math.atan(dy/dx) + PI;
	} else {
		return Math.atan(dy/dx);
	}
}
