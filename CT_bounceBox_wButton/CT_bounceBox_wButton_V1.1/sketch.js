let ball; block; direction; bounce; theme; buttonText;

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
	// which theme to show
	theming();
	// creates block & button
	blockyButt();
	// bounce logic so ball stays within & bounces off block
	rebounding();
	// make the ball move
	theMotion();
}
// Code below makes it all work
//////////////////////////////////////////////


//UI design & conditions for each theme.
// if theme variable is true, then light theme switches on, otherwise Dark theme is default (theme is false by default)
function theming() {
	if (theme) {
		background(255, 160);
		stroke(0, 255, 255, 180);
		//Draw ball for light theme
		strokeWeight(random(10, 20));
		fill(220, 0, 200, 180);
		ellipse(ball.x, ball.y, ball.diameter);
		//Draw frame rectangle for light theme
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
}

//Function for creating our block & button. The goal is to keep the look consistent through the theme changes
function blockyButt() {
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

}

//makes it an interactive game! you can move blocky to catch the ball & move the block to release it

function mouseDragged() {
	if (mouseX > block.x - block.w / 2 && mouseX < block.x + block.w / 2 && mouseY > block.y - block.h / 2 && mouseY < block.y + block.h / 2) {
		block.y = map(mouseY, 0, height, 0 + block.h / 2, height - block.h / 2);
	}

}

// this function sets the ball in motion! constraining the ball.x & ball.y values ensures ball stays within canvas and creates interesting effect where ball glides against edge so you can catch it
function theMotion() {
	// constraining the ball.x & ball.y values ensures ball stays within canvas
	ball.x = constrain(ball.x + direction, 0, width);
	ball.y = constrain(ball.y + bounce, ball.diameter / 2, height - ball.diameter / 2);
}

// setting logic for ball: bounces off canvas edges, & bounces off block in middle. 
//bonus feature, you can catch the ball in the middle of the block since the upper & lower edges of block are not defined
function rebounding() {
	if (ball.x + ball.diameter / 2 > width || ball.x - ball.diameter / 2 < 0 || ball.x + ball.diameter / 2 == block.x - block.w / 2 && ball.y + ball.diameter / 2 > block.y - block.h / 2 && ball.y - ball.diameter / 2 < block.y + block.h / 2 || ball.x - ball.diameter / 2 == block.x + block.w / 2 && ball.y + ball.diameter / 2 > block.y - block.h / 2 && ball.y - ball.diameter / 2 < block.y + block.h / 2 || ball.y - ball.diameter / 2 < 0 || ball.y + ball.diameter / 2 > height) {

		direction *= -1;
		bounce = random(-5, 5);
	}
}


// function for switching themes using the button!
// if the mouse is within the button & mouse is clicked, flip the theme

function mousePressed() {
	if (mouseX > 10 && mouseX < 170 && mouseY > 40 && mouseY < 125) {
		theme = !theme;
	}
}


//For Testing button accuracy if button size changes
// function mouseClicked() {
// 	console.log(mouseX, mouseY);
// }
