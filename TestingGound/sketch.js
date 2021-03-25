let shapeX;
let shapeY;
let myText;

function setup() {
    createCanvas(800, 600);
    background(0);
    shapeX = width + 25;
    shapeY = 100;
    myText = 'Draw Something!';
}

function draw() {

    stroke(255);
    strokeWeight(4);
    fill(mouseX, mouseY, 200);
    beginShape();
    vertex(200 / 5, 200 / 5);
    vertex(300 / 5, 300 / 5)
    vertex(600 / 5, 200 / 5);
    vertex(500 / 5, 300 / 5);
    vertex(600 / 5, 400 / 5);
    vertex(300 / 5, 300 / 5);
    vertex(200 / 5, 400 / 5);
    vertex(250 / 5, 300 / 5);
    endShape(CLOSE);

    stroke(255);
    strokeWeight(3);
    textSize(70);
    text(myText, 150, 80);
    push();
    if (mouseIsPressed) {
        fill(random(70, 255), random(0, 100), 200);
        rect(random(0, width), random(height - height / 5, height), 150, 70);
    } else {
        fill(random(70, 255), random(0, 200), random(70, 200));
        ellipse(random(0, width), random(height - height / 5, height), 200, 45);
    }
    pop();

    push();
    stroke(255);
    strokeWeight(2);
    shapeX = shapeX - 12;
    shapeY = shapeY;
    ellipse(shapeX, shapeY, 10, 10);
    pop();
}

function keyPressed() {
    background(200);
}

function keyReleased() {
    background(0);
}

// THE BELOW  FUNCTIONS ARE A COOL, BUT MAKE IT LESS FUNCTIONAL
/*function mouseClicked() {
    ellipse(mouseX, mouseY, 10, 5);
    // prevent default
    // return false;
}
function mouseReleased() {
    ellipse(mouseX, mouseY, 25, 25);
    // prevent default
    // return false;
} */


function mouseDragged() {
    line(mouseX, mouseY, pmouseX, pmouseY);
    // prevent default
    //return false;
}