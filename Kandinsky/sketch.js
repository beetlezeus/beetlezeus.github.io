function setup() {
	//create your canvas here
	createCanvas(900, 900);
	//background(150, 150, 50, 100);
	background(160, 45, 200, 100);
}

function draw() {//do your drawing here

	//big triangles 
	noStroke();
	fill(0, 150, 75, 5);
	triangle(75, -100, 975, 1000, 975, 700);

	noStroke();
	fill(200, 125, 0, 5);
	triangle(975, -100, -75, 1000, -75, 700);

	//SQUARE
	push();
	noStroke();
	fill(150, 55, 35, 5);
	rectMode(CENTER);
	rect(450, 450, 800, 800, 20);
	pop();

	//big circle
	stroke(0);
	strokeWeight(25);
	fill(150, 150, 50, -50);
	ellipse(450, 450, 700, 700);

	//small circles

	stroke(0);
	strokeWeight(1);
	fill(200, 0, 50, 125);
	ellipse(440, 300, 100, 100);

	noStroke();
	fill(25, 60, 200, 150);
	ellipse(420, 400, 200, 200);

	noStroke();
	fill(25, 220, 150, 150);
	ellipse(600, 400, 300, 300);

	noStroke();
	fill(25, 60, 0, 150);
	ellipse(500, 600, 300, 300);

	stroke(0);
	strokeWeight(10);
	fill(200, 10, 35);
	ellipse(225, 425, 50, 50);

	//lines

	stroke(0);
	strokeWeight(2);
	line(170, 500, 700, 600);

	stroke(0);
	strokeWeight(2);
	line(300, 700, 600, 200);

	stroke(100);
	strokeWeight(1);
	line(550, 700, 600, 660);

	stroke(100);
	strokeWeight(1);
	line(550, 710, 600, 670);

	stroke(100);
	strokeWeight(1);
	line(550, 720, 600, 680);

	stroke(100);
	strokeWeight(1);
	line(565, 715, 580, 200);
	stroke(100);
	strokeWeight(1);
	line(575, 725, 590, 195);
	stroke(100);
	strokeWeight(1);
	line(585, 730, 600, 200);

	//circles

	stroke(0);
	strokeWeight(1);
	fill(200, 10, 35);
	ellipse(350, 575, 70, 70);
}

function mouseClicked() {
	console.log(mouseX, mouseY);
}

// DRAW SOME COOL SHAPES USING BEGINSHAPE & VERTEX. APPLY ALPHA TO SHAPES. PLAY AROUND WITH LINES & CLEAR, COLOR MODE..