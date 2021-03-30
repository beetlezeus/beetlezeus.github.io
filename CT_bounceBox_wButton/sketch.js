// - Bouncy ball, bounces off edges
// - Rectangle in middle
// - Ball bounces off of rectangle

// - Add a button for switching from Dark to Light theme
// when theme changes, background & ball fills will change

// START CODING BELOW

//Declare Variables

let ball;
let block;

let direction;
let bounce;

let theme;
let buttonText;


function setup() {
	createCanvas(800, 800);

	ball = {
		x: 100,
		y: 60,
		diameter: 60,
	};
	block = {
		x: width / 2,
		y: height / 2,
		w: 100,
		h: 600
	}

	direction = 5;
	bounce = 5;
	theme = false;
	buttonText = 'Switch theme';
}


function draw() {

	//set conditions for theme switching!
	// if theme variable is true, then light theme switches on, otherwise Dark theme is default

	if (theme) {
		background(255, 160);
		//stroke & strokeWeight apply to both ellipse & rectangle
		stroke(0, 255, 255, 180);
		strokeWeight(random(10, 20));
		//Draw ellipse
		fill(220, 0, 200, 180);
		ellipse(ball.x, ball.y, ball.diameter);
		//Draw frame rectangle
		stroke(0, 255, 255, 180);
		strokeWeight(10);
		noFill();
		rect(0, 0, 800, 800);
	} else {
		background(0);
		stroke(map(ball.x, 0, 800, 200, 255), 40, map(ball.y, 0, 800, 100, 255), 160);
		strokeWeight(10);
		fill(100, 255, 75, 180);
		ellipse(ball.x, ball.y, ball.diameter);
	}
	// push state for block in middle, & for button!
	// this will keep their style intact through the theme switching
	push();
	stroke(200, 0, 200, 100);
	fill(100, 50, 200, 150);
	rectMode(CENTER);
	rect(block.x, block.y, block.w, block.h);
	rect(90, 80, 160, 80, 10);
	textSize(20);
	textAlign(CENTER);
	textStyle(BOLD);
	noStroke();
	fill(255, 200);
	text(buttonText, 88, 85);
	pop();

	// setting logic for ball: bounces off canvas edges, & bounces off block in middle. 
	if (ball.x + ball.diameter / 2 > width || ball.x - ball.diameter / 2 < 0 || ball.x + ball.diameter / 2 == block.x - block.w / 2 && ball.y + ball.diameter / 2 > block.y - block.h / 2 && ball.y - ball.diameter / 2 < block.y + block.h / 2 || ball.x - ball.diameter / 2 == block.x + block.w / 2 && ball.y + ball.diameter / 2 > block.y - block.h / 2 && ball.y - ball.diameter / 2 < block.y + block.h / 2 || ball.y - ball.diameter / 2 < 0 || ball.y + ball.diameter / 2 > height) {

		direction = direction * -1;
		bounce = random(-5, 5);
	}

	// constraining the ball.x & ball.y values ensures ball stays within canvas
	ball.x = constrain(ball.x + direction, 0, width);
	ball.y = constrain(ball.y + bounce, ball.diameter / 2, height - ball.diameter / 2);

}
// function for switching themes using the button!
// if the mouse is within the button & mouse is clicked, flip the theme
function mousePressed() {
	if (mouseX > 10 && mouseX < 170 && mouseY > 40 && mouseY < 125) {
		theme = !theme;
	}
}

//For Testing button accuracy
// function mouseClicked() {
// 	console.log(mouseX, mouseY);
// }


