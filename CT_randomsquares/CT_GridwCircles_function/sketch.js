function setup() {
	createCanvas(900, 900);
	background(0);
}

function draw() {

	background(0, 80);

	mySquarez(200, 300, random(200, 250), random(10, 20), (random(200), 0, random(255), 15));

	frickles();
}

// Our functions that draw stuff

// This function creates a grid of squares at equal distance from eachother. It needs the following parameters:
function mySquarez(sqX, sqY, sqSize, sqBorder, sqBorderCol) {

	// as long as sqX is less than width, draw squares 150 pixels away from each other
	for (sqX = 0; sqX < width; sqX += 150) {
		// as long as sqY is less than height, draw squares 150 pixels away from each other
		for (sqY = 0; sqY < height; sqY += 150) {
			// square properties
			stroke(sqBorderCol);
			strokeWeight(sqBorder);
			//fill(200, 0, 200, 20);
			fill(random(255), 0, random(255), 20);
			rect(sqX, sqY, sqSize, sqSize);
			noFill();
			rect(0, 0, width, height);
			// also, if the sqX & sqY values fall between the values below, draw circles on top
			if (sqX > 200 && sqX < 700 && sqY > 200 && sqY < 700) {
				//circle attributes
				fill(255, 255, 0, 50);
				ellipse(sqX, sqY, sqSize);
			}

		}
	}
}
// This function adds the random frickles across the screen
function frickles() {
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