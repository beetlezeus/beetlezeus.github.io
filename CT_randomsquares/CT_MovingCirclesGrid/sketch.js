//Grid of moving circles

let direction;
let bounce;

function setup() {
    createCanvas(900, 900);
    direction = 1;
    bounce = -3;

}

function draw() {

    background(0, 80);
    myBall(100, 100, 80);
    frickles();
}
//this function creates a grid of balls that move diagonally across the screen
function myBall(ballX, ballY, ballDiameter) {

    for (ballX = 0; ballX < width; ballX += 200) {
        for (ballY = 0; ballY < height; ballY += 200) {
            stroke(255, 100);
            strokeWeight(8);
            fill(200, 0, 200, 100);
            ellipse(ballX + direction, ballY + bounce, ballDiameter); // + direction & + bounce are motion triggers
        }
        direction++; bounce++; //this sets motion.. initial values of bounce & direction are incrementing
    }
}

function frickles() {
    for (i = 0; i < width; i += 10) {
        x = random(0, width);
        y = random(0, height);
        r = random(0, 50);
        g = random(200, 225);
        b = random(200, 220);
        noStroke();
        fill(r, g, b, 200);
        ellipse(x, y, 15);
    }

}