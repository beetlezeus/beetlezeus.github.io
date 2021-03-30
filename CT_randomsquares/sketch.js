let squareSize;
let borderSize;

let x, y, r, g, b;

function setup() {
	createCanvas(1000, 1000);
	background(0);
}

function draw() {
	squareSize = random(50, 200);
	borderSize = random(15, 50);

	let sq1 = {
		borderSize: random(15, 50),
		squareSize: random(50, 200),
		x: random((squareSize / 3 + 50), (squareSize / 3 + 100)),
		y: random((height / 300 + 50), (height / 300 + 100)),
	}

	background(0, 10);

	//Square1
	stroke(167, 39, 242, 20);
	strokeWeight(sq1.borderSize);
	fill(40, 79, 252, 20);
	rectMode();
	rect(sq1.x, sq1.y, sq1.squareSize, sq1.squareSize);

	//Square 2
	stroke(245, 195, 44, 20);
	strokeWeight(sq1.borderSize);
	fill(63, 48, 230, 20);
	rectMode();
	rect(sq1.x + 300, sq1.y, sq1.squareSize, sq1.squareSize);

	//Square3

	stroke(102, 44, 230, 20);
	strokeWeight(sq1.borderSize);
	fill(230, 120, 90, 20);
	rectMode();
	rect(sq1.x + 600, sq1.y, sq1.squareSize, sq1.squareSize);


	//square 4
	stroke(245, 93, 146, 20);
	strokeWeight(sq1.borderSize);
	fill(75, 171, 255, 20);
	rectMode();
	rect(sq1.x, sq1.y + 300, sq1.squareSize, sq1.squareSize);

	//square5
	stroke(39, 219, 242, 20);
	strokeWeight(sq1.borderSize);
	fill(245, 93, 222, 20);
	rectMode();
	rect(sq1.x + 300, sq1.y + 300, sq1.squareSize, sq1.squareSize);

	//square 6
	stroke(100, 50, 200, 20);
	strokeWeight(sq1.borderSize);
	fill(85, 220, 0, 20);
	rectMode();
	rect(sq1.x + 600, sq1.y + 300, sq1.squareSize, sq1.squareSize);

	//square7

	stroke(100, 50, 200, 20);
	strokeWeight(sq1.borderSize);
	fill(214, 189, 0, 20);
	rectMode();
	rect(sq1.x, sq1.y + 600, sq1.squareSize, sq1.squareSize);

	//square 8
	stroke(163, 144, 0, 20);
	strokeWeight(sq1.borderSize);
	fill(0, 150, 214, 20);
	rectMode();
	rect(sq1.x + 300, sq1.y + 600, sq1.squareSize, sq1.squareSize);


	//square9

	stroke(47, 128, 158, 20);
	strokeWeight(sq1.borderSize);
	fill(112, 158, 79, 20);
	rectMode();
	rect(sq1.x + 600, sq1.y + 600, sq1.squareSize, sq1.squareSize);

	for (i = 0; i < 100; i++) {
		x = random(0, width);
		y = random(0, height);
		r = random(200, 255);
		g = random(160);
		b = random(120, 220);
		noStroke();
		fill(r, g, b, 80);
		ellipse(x, y, 15);

	}

}

function keyPressed() {
	background(0);
}


//FAVE COLOR PALETTE RIGHT HURRRR
//(random(200, 255), random(0, 160), random(120, 220))

//INTERESTING "3D" EFFECT
//// rect(squareSize / 2 + 100, height / 3 - 50, squareSize, squareSize);