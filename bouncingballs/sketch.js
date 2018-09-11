var number = 3;
var balls = [number];
var currentNumber = 0;
var alfa, theta1, theta2, v1tan, v1perp, v2tan, v2perp, energy;
var sol1, sol2, v1tanfinal, v2tanfinal, alfa1final, alfa2final, As, Bs, Cs, d;
var inside;

function setup() {
	createCanvas(800, 600);

	// Todo: I have to create them so that they don't interfere with
	// each other! They all should start separated

	// create a certain number of balls
	for (i = 0; i < number; i++) {
		balls[i] = new Ball();
		currentNumber = currentNumber + 1;
	}
}

function draw() {
	// draw the background each time
	background(150);

	// draw some balls
	noStroke();

	// check, for couples that are different, if a collision is needed
	for (i = 0; i < number; i++) {
		for (j = i + 1; j < number; j++) {
			balls[i].checkBall(balls[j]);
			console.log(balls[i].hasLeft);
		}
	}
	for (i = 0; i < number; i++) {
		fill(255, 0, 150);
		balls[i].checkEdge();
		balls[i].move();
		balls[i].draw();
		fill(0);
		text(balls[i].label, balls[i].x, height - balls[i].y);
		text(balls[i].lastWith, balls[i].x, height - balls[i].y + 20);
	}
}

class Ball {
	constructor() {
		this.rad = random(40, 80);
		/*
		the positions and velocities correspond to a cartesian coordinate system
		where the (0, 0) is the bottom left: a physics coordinate system
		*/
		this.x = random(this.rad, width - this.rad);
		this.y = random(this.rad, height - this.rad);
		this.xspeed = random(-3, 3);
		this.yspeed = random(-3, 3);

		/*
		mass is calculated as the radius squared, this is, mass is proportional
		to the surface of the circle
		*/
		this.mass = Math.pow(this.rad, 2);
		this.speed = Math.sqrt(Math.pow(this.xspeed, 2) + Math.pow(this.yspeed, 2));
		this.angle = giveAtan(this.xspeed, this.yspeed);
		this.energy = (1/2) * this.mass * Math.pow(this.speed, 2);

		// label is one plus the number of balls that have been already created
		this.label = currentNumber + 1;

		/*
		keep track of the last ball with which this one collided, and also
		the time ellapsed since then. Initialize for now
		*/
		this.lastWith = 0;
		this.hasLeft = true;
	}

	draw() {
		/*
		draw the circles knowing the choice of axes is different: in p5 the
		(0, 0) is the upper left corner
		*/
		ellipse(this.x, height - this.y, 2*this.rad, 2*this.rad);
	}

	move() {
		// change values in the cartesian coordinate system
		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;
		/*
		// update the time since the last collision
		if (this.lastCollision[1] > 0) {
			this.lastCollision[1] = this.lastCollision[1] - this.speed;
		}*/

		// REMOVE
		// console.log(this.label, this.lastCollision[1]);
	}

	checkEdge() {
		// if it reaches the right and left edges of the canvas
		if (this.x < this.rad || this.x > width - this.rad) {
			this.changeXspeed();
		}

		// if it reaches the upper and lower edges of the canvas
		if (this.y < this.rad || this.y > height - this.rad) {
			this.changeYspeed();
		}
	}

	checkBall(ball) {
		/*
		if (this.touching(ball)) {
			this.collision(ball);
		} */
		// satisfy these two conditions to have a collision
		if (this.sameLabel(ball) && this.bothInside(ball)) {
			if (!this.touching(ball)) {
				this.hasLeft = true;
				ball.hasLeft = true;
			}
		} else {
			if (this.touching(ball)) {
				this.collision(ball);
			}
		}
	}

	sameLabel(ball) {
		return this.lastWith == ball.label && ball.lastWith == this.label;
	}

	bothInside(ball) {
		return this.hasLeft == false && ball.hasLeft == false;
	}

	giveDist(ball) {
		return dist(this.x, height - this.y, ball.x, height - ball.y);
	}
	touching(ball) {
		// merely check the distance between the two balls
		return this.giveDist(ball) < this.rad + ball.rad;
	}

	hasToCollide(ball) {
		/* two balls will not have to collide if the last collision has been between
		them and also the time ellapsed is too short. In any other case, collision
		should happen. Note that another condition has to be verified; that they
		are touching each other
		*/

		if (this.lastWith != ball.label || ball.lastWith != this.label) {
			return true;
		}
		// to this point, the balls are sure to have the same label for last collision
		// so, check if the distance traveled is enough for them to be apart now
		else if (this.hasLeft == true && ball.hasLeft == true) {
			return true;
		}
		// to this point, the balls have the same label and time ellapsed is too short
		// so they do not have to collide
		else {
			return false;
		}
	}

	collision(ball) {
		// first separate the two balls
		this.separate(ball);

		// calculate the straight line that is the trajectory of both balls
		this.trajectory();
		ball.trajectory();



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

		// update the information of the last collision that just happened
		this.lastWith = ball.label;
		ball.lastWith = this.label;
		this.hasLeft = false;
		ball.hasLeft = false;
	}

	separate(ball) {

	}

	trajectory() {

	}

	changeXspeed() {
		/*
		when changing the speed, the angle of the velocity with the axes
		might have changed, so update the angle also
		*/
		this.xspeed = -this.xspeed;
		this.angle = giveAtan(this.xspeed, this.yspeed);
	}

	changeYspeed() {
		this.yspeed = -this.yspeed;
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
