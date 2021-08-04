/*
For my Game Project 7 submission I implemented all 3 extensions:
   * sound effects & background music
   * Enemies using constructor function
   * Platforms using factory pattern
   * (bonus) Lava smoke particle system using constructor function

The bits I found most difficult were:
 * implementing the sounds for Game Over and Level Complete, and not having it loop over itself. this was a great reminder of the "Game State" variables, and how it can be used to trigger actions then set the variable to true to prevent loops. 

 * factory pattern functions. while I was able to implement it for platforms, they don't make as much sense to me as constructor functions but practice has been helpful

 * properly refactoring & debugging my code then figuring out the correct order for calling functions so game mechanics dont break was challenging at first

As a complete beginner in programming I learned alot of new skills through developing this game. I learned how to inspect & debug my code, how to use JS libraries, how to break up the game creation process into stages that build on top of each other, and how creativity is not a linear path but ideas keep evolving as you work on the project. I had a lot of fun working on this and learned a ton.

*/


//character & world coordinates
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

//caharacter movements & appearance
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isDead;

//scenery
var clouds;
var mountains;
var trees_x;
var trees1_x;
var canyons;
var lavaSmoke = [];
var smoke;
var smoke2;
var smoke3;

//turn back sign
var sign;

//game mechanics
var game_score;
var flagpole;
var lives;

// enemies
var enemies=[];

//platforms
var platforms=[];

//gameStates
var game_over;
var level_complete;

//sound effects & Font
var jumpSound;
var bg_meoldy;
var collect_coin_sound;
var splash_sound;
var hurt_sound;
var levelComplete_sound;
var gameOver_sound;
var gameFont;

// preload function to ensure all files are loaded before gae starts
function preload()
{
    soundFormats('mp3','wav');
    
    //loading sound files & font here
    bg_meoldy = loadSound('assets/vg_land.wav', loaded);
    jumpSound = loadSound('assets/jump.wav');
    collect_coin_sound = loadSound('assets/collectCoin.wav');
    splash_sound = loadSound('assets/splash.wav');
    hurt_sound = loadSound('assets/failing.wav');
    levelComplete_sound = loadSound('assets/LevelComplete.mp3');
    gameOver_sound = loadSound('assets/GameOver.wav');
    gameFont = loadFont('assets/PressStart2P-Regular.ttf');

    // setting volume for sound files
    bg_meoldy.setVolume(0.3);
    jumpSound.setVolume(0.2);
    collect_coin_sound.setVolume(0.3); 
    splash_sound.setVolume(0.3);
    hurt_sound.setVolume(0.2);
    levelComplete_sound.setVolume(0.2);
    gameOver_sound.setVolume(0.2);
}
//callback function for background music to play once loaded
function loaded()
{
    bg_meoldy.loop();
}


function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	
    //initailizing with number of lives to start game with
	lives = 3;

    // calling startGame,which includes all initialized variables
	startGame();
 
}

function draw() 
{
    // fill the sky blue
	background(100, 155, 255);
	noStroke();
	fill(0, 155, 0);
// draw some green ground
	rect(
		0,
		floorPos_y,
		width,
		height / 4);

	// we use a push function here so we can shift our scenery without affecting our character
	push();

	// translate will shift the starting position of the scenery if scrollPos changes, creating illusion of motion
	translate(scrollPos, 0);

	// Draw clouds. we traverse the clouds array & call drawCloudsfor each clouds[i]
	for (var i = 0; i < clouds.length; i++) {
		drawClouds(clouds[i]);
	
	}
	// Draw mountains.we traverse the mountains array & call drawMountains for each mountains[i]
	for (var i = 0; i < mountains.length; i++) {
		drawMountains(mountains[i]);
	}
	// Draw trees.
	drawTrees();

	// Draw canyons.we traverse the canyons array & call drawCanyon and checkCanyon for each canyons[i] to render canyons & check if character is plummeting.
	for (var i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
		if (isPlummeting) {
			gameChar_y += 10;
        //if character is plummeting down canyon icrement y by 10
		}
	}

    // draw smoke emitting from each lava pit using constructor method (smoke, smoke2 & smoke3).
    //smoke constructor
	smoke = new Smoke(460, 650);
	lavaSmoke.push(smoke);
	for (var i =0; i < lavaSmoke.length; i++)
    {	
	    lavaSmoke[i].show();
	    lavaSmoke[i].update();

    if (lavaSmoke[i].checkLife())
        {
        lavaSmoke.splice(i,2);
        }
    }
    //smoke constructor
	smoke2 = new Smoke(670, 650);
	lavaSmoke.push(smoke2);
	for (var i =0; i < lavaSmoke.length; i++)
    {	
        lavaSmoke[i].show();
        lavaSmoke[i].update();

    if (lavaSmoke[i].checkLife())
        {
        lavaSmoke.splice(i,2);
        }
    }
    //smoke constructor
	smoke3 = new Smoke(1250, 650);
	lavaSmoke.push(smoke3);
	for (var i =0; i < lavaSmoke.length; i++)
    {	
        lavaSmoke[i].show();
        lavaSmoke[i].update();

    if (lavaSmoke[i].checkLife())
        {
        lavaSmoke.splice(i,2);
        }
    }

	// Draw collectable items. traverse the collectables array, if isFound is false, draw collectable and check if character has found it
	for (var i = 0; i < collectables.length; i++) {
		if (collectables[i].isFound == false) {
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

    // calling function to draw the turn back sign if character goes in wrong direction.
	turnBack_Sign();

    // callng function to draw the flagpole & flag
	renderFlagpole();

// rendering enemies by traversing the enemies array & calling the .show & .move constructor functions for each enemies[i]
	for (var i = 0; i < enemies.length; i++)
	{
		enemies[i].show();
		enemies[i].move(); 

        // logic for collision with enemy, using the enemies[i].checkContact function
		var isContact = 
		enemies[i].checkContact(gameChar_world_x, gameChar_y);

		if(isContact && !flagpole.isReached)
		{
			lives--;
			if (lives > 0) {
                hurt_sound.play();
				startGame();
				break; 
			} 
            else if (lives <= 0) {
				lives = 0;
				isDead = true;
			}
		}


	}
    
    // rendering platforms by traversing the platforms array & calling the .draw function to render each platforms[i]
	for(var i = 0; i < platforms.length; i++){
		platforms[i].draw();

	}

	pop();

	// calling the Draw game character function, renders the game character
	drawGameChar();

	// calling the Game Score display function, displays game score
	gameScoreDisp();

	//calling the Lives Remaining display function, displays lives
	livesDisp();


	//calling the Game Over function means the Game Over screen & music will be played when conditions are met (no lives remaining)
	gameOver();

	//if flagpole is reached,call levelComplete function. Level Complete music & screen will play
	if (flagpole.isReached) {
        bg_meoldy.stop();
        levelComplete();
		return;
	}

	// function contaning Logic to make the game character move & the background scroll.
	char_Control();

	//as long as flagpole hasn't been reached, continue to call the checkFlagpole function.
	if (flagpole.isReached == false) {
		checkFlagpole();
	}


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

    //calling checkPlayerDie to determine if character is falling down canyon
	checkPlayerDie();
}


// ---------------------
// Key control functions. 
// ---------------------

// to control the animation / appearance of the character when keys are pressed.
function keyPressed() {
	//Right arrow (Keycode39) is pressed character turns right. will not work if character dead or flagpole is reached
	if (keyCode == 39 
		&& !isDead
		&& !flagpole.isReached) {
		isRight = true;
	}
	//left arrow (Keycode37) is pressed, character turns left. will not work if character dead or flagpole is reached
	if (keyCode == 37 
		&& !isDead
		&& !flagpole.isReached) {
		isLeft = true;
	}
	//if spacebar (Keycode32) is pressed & the character is on the ground or platform, character will jump. will not work if character is dead or if flagpole has been reached

	if (keyCode == 32 
		&& !isFalling 
		&& !isDead
		&& !flagpole.isReached) {
		if (isPlummeting == false) {
			gameChar_y -=125;
            jumpSound.play(); 
            
		}
	}

	//if game over, press space to continue. This will restart the game if sound is done playing

	if(keyCode == 32 
		&& game_over 
		&& !gameOver_sound.isPlaying())
	{
		lives = 3;
		bg_meoldy.loop();
		startGame();
	}

	//if level complete, press space to continue. This will restart the game if sound is done playing
	if(keyCode == 32 
		&& level_complete 
		&& !levelComplete_sound.isPlaying())
	{
		lives = 3;
		bg_meoldy.loop();
		startGame();
	}

}

// to control the animation / appearance of the character when keys are released.
function keyReleased() {
	//when right arrow is released, isRight is false
	if (keyCode == 39) {
		isRight = false;
	}
	//when left arrow is released, isLeft is false
	if (keyCode == 37) {
		isLeft = false;
	}
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar() {

	if (isLeft && isFalling) {
		//jumping left

		//tail
		noStroke();
		fill(119, 238, 238);
		beginShape();
		vertex(
			gameChar_x + 10,
			gameChar_y - 20);
		vertex(
			gameChar_x + 26,
			gameChar_y - 31);
		vertex(
			gameChar_x + 30,
			gameChar_y - 26);
		vertex(
			gameChar_x + 36,
			gameChar_y - 32);
		vertex(
			gameChar_x + 50,
			gameChar_y - 20);
		vertex(
			gameChar_x + 36,
			gameChar_y - 17);
		vertex(
			gameChar_x + 36,
			gameChar_y - 23);
		vertex(
			gameChar_x + 30,
			gameChar_y - 20);
		vertex(
			gameChar_x + 26,
			gameChar_y - 23);
		vertex(
			gameChar_x + 10,
			gameChar_y - 17);
		endShape(CLOSE);
		//body
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 8,
			gameChar_y - 38,
			15,
			25,
			5);
		//head
		noStroke();
		fill(119, 238, 238);
		arc(gameChar_x,
			gameChar_y - 55,
			45,
			45,
			10,
			PI);
		//eyes
		fill(255);
		ellipse(
			gameChar_x - 8,
			gameChar_y - 70,
			10);
		fill(0);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 70,
			7.5);
		//arms
		stroke(0);
		fill(242, 42, 222);
		quad(
			gameChar_x,
			gameChar_y - 30,
			gameChar_x + 7,
			gameChar_y - 30,
			gameChar_x + 19,
			gameChar_y - 45,
			gameChar_x + 13,
			gameChar_y - 45);
		//feet
		fill(0);
		ellipse(gameChar_x + 5, 
			gameChar_y - 10, 
			10, 
			15);
	}
	else if (isRight && isFalling) {
		// jumping right

		//tail
		noStroke();
		fill(119, 238, 238);
		beginShape();
		vertex(
			gameChar_x - 10,
			gameChar_y - 20);
		vertex(
			gameChar_x - 26,
			gameChar_y - 31);
		vertex(
			gameChar_x - 30,
			gameChar_y - 26);
		vertex(
			gameChar_x - 36,
			gameChar_y - 32);
		vertex(
			gameChar_x - 50,
			gameChar_y - 20);
		vertex(
			gameChar_x - 36,
			gameChar_y - 17);
		vertex(
			gameChar_x - 36,
			gameChar_y - 23);
		vertex(
			gameChar_x - 30,
			gameChar_y - 20);
		vertex(
			gameChar_x - 26,
			gameChar_y - 23);
		vertex(
			gameChar_x - 10,
			gameChar_y - 17);
		endShape(CLOSE);
		//body
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 8,
			gameChar_y - 38,
			15,
			25,
			5);
		//head
		noStroke();
		fill(119, 238, 238);
		arc(
			gameChar_x,
			gameChar_y - 55,
			45,
			45,
			0,
			PI * 1.8);
		//eyes
		fill(255);
		ellipse(
			gameChar_x + 8,
			gameChar_y - 70,
			10);
		fill(0);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 70,
			7.5);
		//arms
		stroke(0);
		fill(242, 42, 222);
		quad(
			gameChar_x,
			gameChar_y - 30,
			gameChar_x - 7,
			gameChar_y - 30,
			gameChar_x - 19,
			gameChar_y - 45,
			gameChar_x - 13,
			gameChar_y - 45);
		//feet
		fill(0);
		ellipse(
			gameChar_x - 5,
			gameChar_y - 10,
			10,
			15);
	}
	else if (isLeft) {
		//walking left

		//tail
		noStroke();
		fill(119, 238, 238);
		beginShape();
		vertex(
			gameChar_x + 10,
			gameChar_y - 10);
		vertex(
			gameChar_x + 26,
			gameChar_y - 21);
		vertex(
			gameChar_x + 30,
			gameChar_y - 15);
		vertex(
			gameChar_x + 36,
			gameChar_y - 21);
		vertex(
			gameChar_x + 50,
			gameChar_y - 10);
		vertex(
			gameChar_x + 36,
			gameChar_y - 7);
		vertex(
			gameChar_x + 36,
			gameChar_y - 13);
		vertex(
			gameChar_x + 30,
			gameChar_y - 10);
		vertex(
			gameChar_x + 26,
			gameChar_y - 13);
		vertex(
			gameChar_x + 10,
			gameChar_y - 7);
		endShape(CLOSE);

		//body
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 8,
			gameChar_y - 24,
			15,
			20,
			5);
		//arms
		fill(242, 42, 222);
		quad(
			gameChar_x,
			gameChar_y - 22,
			gameChar_x + 6,
			gameChar_y - 22,
			gameChar_x + 13,
			gameChar_y - 5,
			gameChar_x + 7,
			gameChar_y - 5);
		//head
		noStroke();
		fill(119, 238, 238);
		arc(
			gameChar_x,
			gameChar_y - 45,
			45,
			45,
			10,
			PI);
		//eyes
		fill(255);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 62,
			10);
		fill(0);
		ellipse(
			gameChar_x - 12,
			gameChar_y - 62,
			7.5);
		//feet
		fill(0);
		ellipse(
			gameChar_x - 5,
			gameChar_y,
			20,
			10);
	}
	else if (isRight) {
		// walking right

		//tail
		noStroke();
		fill(119, 238, 238);
		beginShape();
		vertex(
			gameChar_x - 10,
			gameChar_y - 10);
		vertex(
			gameChar_x - 26,
			gameChar_y - 21);
		vertex(
			gameChar_x - 30,
			gameChar_y - 15);
		vertex(
			gameChar_x - 36,
			gameChar_y - 21);
		vertex(
			gameChar_x - 50,
			gameChar_y - 10);
		vertex(
			gameChar_x - 36,
			gameChar_y - 7);
		vertex(
			gameChar_x - 36,
			gameChar_y - 13);
		vertex(
			gameChar_x - 30,
			gameChar_y - 10);
		vertex(
			gameChar_x - 26,
			gameChar_y - 13);
		vertex(
			gameChar_x - 10,
			gameChar_y - 7);
		endShape(CLOSE);

		//body
		stroke(0);
		fill(242, 42, 222);
		rect(gameChar_x - 8,
			gameChar_y - 24,
			15,
			20,
			5);
		//arms
		quad(
			gameChar_x,
			gameChar_y - 22,
			gameChar_x - 7,
			gameChar_y - 22,
			gameChar_x - 13,
			gameChar_y - 5,
			gameChar_x - 7,
			gameChar_y - 5);
		//head
		noStroke();
		fill(119, 238, 238);
		arc(
			gameChar_x,
			gameChar_y - 45,
			45,
			45,
			0,
			PI * 1.8);
		//eyes
		fill(255);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 62,
			10);
		fill(0);
		ellipse(
			gameChar_x + 12,
			gameChar_y - 62,
			7.5);
		//feet
		fill(0);
		ellipse(
			gameChar_x + 5,
			gameChar_y,
			20,
			10);
	} 
	else if (isFalling || isPlummeting) {
		//jumping facing forwards
        //body
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 10,
			gameChar_y - 38,
			20,
			25,
			5);
		//head
		noStroke();
		fill(119, 238, 238);
		ellipse(
			gameChar_x,
			gameChar_y - 55,
			45,
			35);
		//arms
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 16,
			gameChar_y - 48,
			6,
			18,
			10);
		rect(
			gameChar_x + 10,
			gameChar_y - 48,
			6,
			18,
			10);
		//mouth
		noStroke();
		fill(0);
		ellipse(
			gameChar_x,
			gameChar_y - 55,
			7)
		//eyes
		fill(255);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 70,
			10);
		fill(0);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 70,
			7.5);
		// eyes
		fill(255);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 70,
			10);
		fill(0);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 70,
			7.5);
		//feet
		fill(0);
		ellipse(
			gameChar_x + 5,
			gameChar_y - 7,
			10,
			15);
		ellipse(
			gameChar_x - 5,
			gameChar_y - 7,
			10,
			15);

	}
	else if(isDead)
	{
        //turn to stone. when no lives remaining
		//body
        stroke(0);
        fill(80);
        rect(
            gameChar_x - 10,
            gameChar_y - 25,
            20,
            25,
            5);
        //head
        noStroke();
        fill(140);
        ellipse(
            gameChar_x,
            gameChar_y - 35,
            45,
            35);
        //mouth
       stroke(0);
	   strokeWeight(2);
        fill(0);
		line(
            gameChar_x - 8, 
            gameChar_y - 25, 
            gameChar_x +8, 
            gameChar_y -25)
        //eyes
        fill(0);
        ellipse(
            gameChar_x - 10,
            gameChar_y - 50,
            10);
        fill(0);
        ellipse(
            gameChar_x - 10,
            gameChar_y - 50,
            7.5);
        // eyes
        fill(0);
        ellipse(
            gameChar_x + 10,
            gameChar_y - 50,
            10);
        fill(0);
        ellipse(
            gameChar_x + 10,
            gameChar_y - 500,
            7.5);
        //feet
        fill(0);
        ellipse(
            gameChar_x + 5,
            gameChar_y - 7,
            10,
            15);
        ellipse(
            gameChar_x - 5,
            gameChar_y - 7,
            10,
            15);
    
	}
	//standing front facing. default character design - if none of above condtions are true
	else {
		//body
		stroke(0);
		fill(242, 42, 222);
		rect(
			gameChar_x - 15,
			gameChar_y - 25,
			30,
			20,
			5);
		//arms
		rect(
			gameChar_x - 22,
			gameChar_y - 25,
			6,
			15,
			10);
		rect(
			gameChar_x + 16,
			gameChar_y - 25,
			6,
			15,
			10);
		//head
		noStroke();
		fill(119, 238, 238);
		ellipse(
			gameChar_x,
			gameChar_y - 45,
			45);
		//mouth
		fill(0);
		arc(
			gameChar_x,
			gameChar_y - 45,
			25,
			35,
			0,
			PI);
		//eyes
		fill(255);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 55,
			10);
		fill(0);
		ellipse(
			gameChar_x - 10,
			gameChar_y - 55,
			7.5);
		// eyes
		fill(255);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 55,
			10);
		fill(0);
		ellipse(
			gameChar_x + 10,
			gameChar_y - 55,
			7.5);
		//feet
		fill(0);
		ellipse(
			gameChar_x + 10,
			gameChar_y,
			20,
			10);
		ellipse(
			gameChar_x - 10,
			gameChar_y,
			20,
			10);
	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds(t_Cloud) {
	//Note that each x & y coordinate are multiplied by scale so position on screen will adjust accordingly!
	fill(255);
	ellipse(
		t_Cloud.x_pos * t_Cloud.scale,
		t_Cloud.y_pos * t_Cloud.scale,
		t_Cloud.diameter * t_Cloud.scale,
		(t_Cloud.diameter - 30) * t_Cloud.scale);

	ellipse(
		(t_Cloud.x_pos - 25) * t_Cloud.scale,
		(t_Cloud.y_pos - 10) * t_Cloud.scale,
		(t_Cloud.diameter - 20) * t_Cloud.scale,
		(t_Cloud.diameter - 35) * t_Cloud.scale);

	ellipse(
		(t_Cloud.x_pos - 15) * t_Cloud.scale,
		(t_Cloud.y_pos + 10) * t_Cloud.scale,
		(t_Cloud.diameter - 20) * t_Cloud.scale,
		(t_Cloud.diameter - 15) * t_Cloud.scale);

	ellipse(
		(t_Cloud.x_pos + 15) * t_Cloud.scale,
		t_Cloud.y_pos * t_Cloud.scale,
		(t_Cloud.diameter - 25) * t_Cloud.scale,
		(t_Cloud.diameter - 15) * t_Cloud.scale);

	ellipse(
		(t_Cloud.x_pos + 35) * t_Cloud.scale,
		t_Cloud.y_pos * t_Cloud.scale,
		(t_Cloud.diameter + 5) * t_Cloud.scale,
		(t_Cloud.diameter - 35) * t_Cloud.scale);

		//clouds motion

		t_Cloud.x_pos += random(0.1,0.25);
		if(t_Cloud.x_pos > 2400)
		{
			t_Cloud.x_pos = random(-900,-850);
		}
}

// Function to draw mountains objects.

function drawMountains(t_Mountain) {
	stroke(145);
	//Back Mountain
	fill(145);
	triangle(
		t_Mountain.pos_x,
		t_Mountain.pos_y,
		t_Mountain.pos_x + (t_Mountain.width * 0.55),
		t_Mountain.height,
		t_Mountain.pos_x + t_Mountain.width,
		t_Mountain.pos_y);

	//Front Mountain
	fill(120);
	triangle(
		t_Mountain.pos_x + (0.325 * t_Mountain.width),
		t_Mountain.pos_y,
		t_Mountain.pos_x + (0.9 * t_Mountain.width),
		(t_Mountain.height * 0.8),
		t_Mountain.pos_x + (t_Mountain.width * 1.525),
		t_Mountain.pos_y);

	//Snowcap on mountain. Only if mountain is tall enough
	if (t_Mountain.height == floorPos_y - 170) {
		noStroke();
		fill(255);
		beginShape();
		vertex(
			t_Mountain.pos_x + (t_Mountain.width * 0.9),
			(t_Mountain.height * 0.8));
		vertex(
			t_Mountain.pos_x + (t_Mountain.width * 0.715),
			(t_Mountain.height * 1.07));
		vertex(
			t_Mountain.pos_x + (t_Mountain.width * 0.8),
			t_Mountain.height);
		vertex(
			t_Mountain.pos_x + (t_Mountain.width * 0.95),
			(t_Mountain.height * 1.1));
		vertex(
			t_Mountain.pos_x + (t_Mountain.width * 1.06),
			t_Mountain.height);
		endShape();
	}

}

// Function to draw trees objects.
function drawTrees() {
	//pointy trees
	for (var i = 0; i < trees_x.length; i++) {
		//trunk
		noStroke();
		fill(160, 100, 30);
		rect(
			trees_x[i], 
            floorPos_y - 100,
			50,
			100);
		//canopy
		fill(0, 100, 0)
		triangle(
			trees_x[i] - 50,
			floorPos_y - 100,
			trees_x[i] + 100,
			floorPos_y - 100,
			trees_x[i] + 25,
			floorPos_y - 180);
		fill(0, 100, 0);
		triangle(
			trees_x[i] - 50,
			floorPos_y - 120,
			trees_x[i] + 100,
			floorPos_y - 120,
			trees_x[i] + 25,
			floorPos_y - 240);
	}
	//round trees
	for (var i = 0; i < trees1_x.length; i++) {
		//Trunk
		fill(95, 55, 27);
		rect(
			trees1_x[i],
			floorPos_y - 100,
			50,
			100);
		//Branches / Canopy
		fill(0, 100, 0);
		ellipse(
			trees1_x[i],
			floorPos_y - 110,
			120,
			70);
		ellipse(
			trees1_x[i] + 50,
			floorPos_y - 110,
			120,
			70);
		ellipse(
			trees1_x[i] + 25,
			floorPos_y - 120,
			90,
			80);

		//fruits
		fill(200, 120, 30);
		ellipse(
			trees1_x[i] + 10,
			floorPos_y - 130,
			20,
			15);
		fill(160, 50, 160);
		ellipse(
			trees1_x[i] + 40,
			floorPos_y - 110,
			20,
			15);
		fill(220, 30, 30);
		ellipse(
			trees1_x[i],
			floorPos_y - 100,
			20,
			15);

	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
	//gap
	fill(100, 155, 255);
	rect(
		t_canyon.x_pos,
		t_canyon.y_pos,
		t_canyon.width,
		height - (height - floorPos_y));
	
    //lava surface
	fill(255, 0, 0);
	beginShape();
	curveVertex(
		t_canyon.x_pos,
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos,
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.125),
		(t_canyon.y_pos + 70));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.25),
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.375),
		(t_canyon.y_pos + 70));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.5),
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.625),
		(t_canyon.y_pos + 70));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.75),
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width * 0.875),
		(t_canyon.y_pos + 70));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width),
		(t_canyon.y_pos + 80));
	curveVertex(
		t_canyon.x_pos + (t_canyon.width),
		(t_canyon.y_pos + 80));
	endShape();
	
    //lava-fill
	rect(
		t_canyon.x_pos,
		(t_canyon.y_pos + 80),
		t_canyon.width,
		height - (floorPos_y + 80));
	
    //earth
	fill(0);
	rect(
		t_canyon.x_pos,
		(t_canyon.y_pos + 120),
		t_canyon.width,
		height - (floorPos_y + 120));

}

// Function to check character is over a canyon. if over a canyon & character y is below ground level, plummeting is true.

function checkCanyon(t_canyon) {
	if (gameChar_world_x - 20 > t_canyon.x_pos
        && gameChar_world_x + 20 < (t_canyon.x_pos + t_canyon.width)
		&& gameChar_y >= floorPos_y) 
        {
		isPlummeting = true;
		isLeft = false;
		isRight = false;
	    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
	fill(255, 215, 0);
	beginShape();
	vertex(
		t_collectable.x_pos,
		t_collectable.y_pos);
	vertex(
		t_collectable.x_pos + (0.2 * t_collectable.size),
		t_collectable.y_pos + (0.3 * t_collectable.size));
	vertex(
		t_collectable.x_pos + (0.4 * t_collectable.size),
		t_collectable.y_pos);
	vertex(
		t_collectable.x_pos + (0.7 * t_collectable.size),
		t_collectable.y_pos - (0.2 * t_collectable.size));
	vertex(
		t_collectable.x_pos + (0.4 * t_collectable.size),
		t_collectable.y_pos - (0.36 * t_collectable.size));
	vertex(
		t_collectable.x_pos + (0.2 * t_collectable.size),
		t_collectable.y_pos - (0.7 * t_collectable.size));
	vertex(
		t_collectable.x_pos,
		t_collectable.y_pos - (0.36 * t_collectable.size));
	vertex(
		t_collectable.x_pos - (0.3 * t_collectable.size),
		t_collectable.y_pos - (0.2 * t_collectable.size));
	endShape()

}

// Function to check if character has found a cllectable item.

function checkCollectable(t_collectable) {
	if ((dist(gameChar_world_x,
              gameChar_y, 
              t_collectable.x_pos, 
              t_collectable.y_pos
			  ) 
              < 35)) {
		t_collectable.isFound = true;
        collect_coin_sound.play();
		game_score += 1;

	}
}
//-----------------------------------
// flagpole render and check functions
//-----------------------------------
function renderFlagpole() {
	push();
	//pole color & Shape
	stroke(180);
	strokeWeight(6);
	line(
		flagpole.x_pos,
		floorPos_y,
		flagpole.x_pos,
		floorPos_y - 250);

	//flag Color & Shape
	fill(128, 0, 128);
	noStroke();

	//if level cleared
	if (flagpole.isReached) {
		triangle(
			flagpole.x_pos,
			flagpole.y_pos,
			flagpole.x_pos,
			flagpole.y_pos - 50,
			flagpole.x_pos + 75,
			flagpole.y_pos - 25);

			if (flagpole.y_pos > floorPos_y - 200)
			{
			flagpole.y_pos += flagpole.dir;
            // if level cleared & our flag is is not at mast then flag rises
			}


	}
	//if flagpole is not reached, triangle at ground level
	else {
		triangle(
			flagpole.x_pos,
			flagpole.y_pos,
			flagpole.x_pos,
			flagpole.y_pos - 50,
			flagpole.x_pos + 75,
			flagpole.y_pos - 25);
	}
	pop();
}

//function to check if flagpole has been reached. if true then isReached is set to true, which triggers the level complete sequence.

function checkFlagpole() {
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if (d < 20) {
		flagpole.isReached = true;
	}

}

// Check lives function. This will check if the player has fallen down a canyon. 
//If true, lives decrement by 1 & sound effects are played. if lives remaining, we call startGame, if no lives then lives counter is set to 0 & we stop the sound effects.
function checkPlayerDie() {
	if (gameChar_y >= height) {
		lives--;
        splash_sound.play();
        hurt_sound.play();
		if (lives > 0) {
			startGame();
		} else if (lives <= 0) {
			lives = 0;
            splash_sound.stop();
            hurt_sound.stop();
		}
	}

}

//Start Game after dying

function startGame() {
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement & appearance of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isDead = false;


    //gameStates for Game Over & Level Complete sound effects
    game_over = false;
    level_complete = false;

	
// Initialise arrays of scenery objects.

    // array for pointy trees
	trees_x =
		[
			-600,
			-450,
			50,
			200,
			350
		];
	//array for rounded trees
	trees1_x =
		[
			775,
			900,
			1025,
			1125,
			1450,
			1575,
			1700
		];
	//array for clouds
	clouds =
		[
        //clouds showing within our starting frame
        {
            x_pos: 150,
            y_pos: 150,
            diameter: 100,
            scale: 1
        },

        {
            x_pos: 600,
            y_pos: 140,
            diameter: 100,
            scale: 0.75
        },

        {
            x_pos: 600,
            y_pos: 170,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: 1200,
            y_pos: 350,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: 700,
            y_pos: 110,
            diameter: 100,
            scale: 1.15
        },

        //adding some clouds before frame for scroll effect
        {
            x_pos: -500,
            y_pos: 150,
            diameter: 100,
            scale: 1
        },

        {
            x_pos: -1000,
            y_pos: 140,
            diameter: 100,
            scale: 0.75
        },

        {
            x_pos: -550,
            y_pos: 170,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: -200,
            y_pos: 350,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: -1000,
            y_pos: 110,
            diameter: 100,
            scale: 1.15
        },

        //adding some after frame for scroll effect
        {
            x_pos: 1700,
            y_pos: 150,
            diameter: 100,
            scale: 1
        },

        {
            x_pos: 2600,
            y_pos: 140,
            diameter: 100,
            scale: 0.75
        },

        {
            x_pos: 3000,
            y_pos: 170,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: 3000,
            y_pos: 350,
            diameter: 100,
            scale: 0.5
        },

        {
            x_pos: 1000,
            y_pos: 110,
            diameter: 100,
            scale: 1.15
        }
    ];

	//array for mountains
	mountains =
		[
        {
            pos_x: 100,
            pos_y: floorPos_y,
            height: floorPos_y - 170,
            width: 200
        },

        {
            pos_x: 800,
            pos_y: floorPos_y,
            height: floorPos_y - 170,
            width: 200
        },

        {
            pos_x: -1000,
            pos_y: floorPos_y,
            height: floorPos_y - 170,
            width: 200
        },

        {
            pos_x: -600,
            pos_y: floorPos_y,
            height: floorPos_y - 80,
            width: 120
        },

        {
            pos_x: -300,
            pos_y: floorPos_y,
            height: floorPos_y - 80,
            width: 120
        },

        {
            pos_x: 1600,
            pos_y: floorPos_y,
            height: floorPos_y - 170,
            width: 200
        }


		];

	//array for canyons
	canyons =
		[
        {
            x_pos: 600,
            y_pos: floorPos_y,
            width: 140
        },

        {
            x_pos: 425,
            y_pos: floorPos_y,
            width: 70
        },

        {
            x_pos: 1200,
            y_pos: floorPos_y,
            width: 100
        }
		];

    // array for collectables
	collectables =
		[
        {
            x_pos: 150,
            y_pos: floorPos_y - 15,
            size: 50,
            isFound: false

        },

        {
            x_pos: 580,
            y_pos: (floorPos_y - 15) - 55,
            size: 50,
            isFound: false
        },

        {
            x_pos: 775,
            y_pos: floorPos_y - 15,
            size: 50,
            isFound: false

        },
        {
            x_pos: 1400,
            y_pos: (floorPos_y - 15) - 200,
            size: 60,
            isFound: false

        },
        {
            x_pos: 1650,
            y_pos: (floorPos_y - 15) - 225,
            size: 65,
            isFound: false

        },
        {
            x_pos: 1800,
            y_pos: (floorPos_y - 30),
            size: 80,
            isFound: false

        },

        {
            x_pos: -525,
            y_pos: floorPos_y - 15,
            size: 50,
            isFound: false

        }
		];
	
	
    //initalizing Sign Object to keep character from leaving playable area
	sign = {
		x_pos: -750,
		y_pos:floorPos_y - 100,
		length: 180,
		h: 80
	};

	//initializing game score variable to keep track of found collectables
	game_score = 0;
	
    // initalizing flagpole object for level completion
	flagpole = {
		isReached: false,
		x_pos: 2000,
		y_pos: floorPos_y,
		dir: -1,
	};

	//enemies. we will have 8 enemies in this level. we are using the enemies array & a for loop to create them. each enemies[i] is a newly constructed Enemy
	for(var i = 0; i <8; i++)
		{
	x = 75 + i * 250;
	y = floorPos_y;
	l = random(40,50);
	h = random(40,55);
	range = 110;
	enemies[i] = new Enemy(x,y,l,h,range);
		};
	
    //platforms. for each platform we want, we provide the arguments for coordinates & length and push to the platforms array 
	platforms.push(createPlatform(50,350 ,50));
	platforms.push(createPlatform(250,325 ,100)); 
	platforms.push(createPlatform(500,350,100));
	platforms.push(createPlatform(700,300,200));
	platforms.push(createPlatform(1250,350,50));
	platforms.push(createPlatform(1400,300,50));
	platforms.push(createPlatform(1500,275,50));
	platforms.push(createPlatform(1600,300,50));
	platforms.push(createPlatform(1700,325,50));
	platforms.push(createPlatform(1850,350,50));

}


//--------------------------------------------
// FUNCTIONS FOR MECAHNICS, ENEMIES, PLATFORMS
//--------------------------------------------

//function to draw lives Tokens on screen. We call this from the livesDisp() function
function render_livesTokens(t_x, t_y) {
	//head
	noStroke();
	fill(119, 238, 238);
	ellipse(
		t_x,
		t_y,
		45 * 0.75);
	//mouth
	fill(0);
	arc(
		t_x,
		t_y,
		25 * 0.75,
		35 * 0.75,
		0,
		PI);
	//eyes
	fill(255);
	ellipse(
		t_x - 10 * 0.75,
		t_y - 10 * 0.75,
		10 * 0.75);
	fill(0);
	ellipse(
		t_x - 10 * 0.75,
		t_y - 10 * 0.75,
		7.5 * 0.75);
	// eyes
	fill(255);
	ellipse(
		t_x + 10 * 0.75,
		t_y - 10 * 0.75,
		10 * 0.75);
	fill(0);
	ellipse(
		t_x + 10 * 0.75,
		t_y - 10 * 0.75,
		7.5 * 0.75);
}

// function to display the game score (number of collected collectables), along with token for collectables.
function gameScoreDisp()
{
	fill(255);
	noStroke();
	textSize(15);
    textFont(gameFont);
	text(
		"X",
		65,
		35);
	textSize(30);
	text(
		"" + "" + game_score,
		85,
		44);
	drawCollectable({
		x_pos: 30,
		y_pos: 35,
		size: 40
	})
}
// function to display number of lives (lives tokens), text & tokens
function livesDisp()
{
	fill(255);
	noStroke();
	textSize(20);
    textFont(gameFont);
	text(
		"Lives " + "" /*+ lives */,
		width - 280,
		35);

	//renders Lives Tokens in the display
	for (var i = 0; i < lives; i++) {
		render_livesTokens(width - 157 + i * 45, 23);
	}
}

// what happens when we lose the game (if no lives left).
function gameOver()
{
	if (lives < 1) {
        // if game_over variable is false we stop the bg tune, & play the game over sound then turn game_over to true. this ensure tune is played only once.
        if(!game_over)
        {   bg_meoldy.stop();
            gameOver_sound.play();
            game_over = true;
        }
        // game over screen & text.
		
		push();
		background(200, 40, 0, 100);
		fill(40);
		stroke(220);
		strokeWeight(6);
        textFont(gameFont);
		textSize(70);
		textAlign(CENTER)
		text(
			"Game Over",
			width / 2,
			height / 2);
		fill(220);
		noStroke();
		textSize(35);
		text(
			"press Space to continue",
			width / 2,
			height / 2 + 80);
		pop();
		return;
}
}


function char_Control()
{
    // if isLeft is true & character is not dead. This disables motion when isDead
	if (isLeft && !isDead) {
		if (gameChar_x > width * 0.2) {
			gameChar_x -= 5;
		}
		else {
			scrollPos += 5;
		}
	}
// if isRight is true & character is not dead
	if (isRight && !isDead) {
		if (gameChar_x < width * 0.8) {
			gameChar_x += 5;
		}
		else {
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Gravity Logic to make the game character fall if character is above ground & not standing on a platform.

    if (gameChar_y < floorPos_y)
    {
	for (var i = 0; i < platforms.length; i++) 
    {
		var isContact = false;
        if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            { 
            isContact = true;
            isFalling = false;
            break;
            }
    }
        if(isContact == false)
            {
            isFalling = true;
            gameChar_y +=4;
            } 
            } 
        else {
            isFalling = false;
             }
			}



// what happens when we complete the level (Flag is reached)
function levelComplete()
{
    //if levelComplete variable is false, the level complete tune will play & level complete is true. this prevents the tune from looping
    if(!level_complete)
    {
        levelComplete_sound.play();
        level_complete = true;
    }
	    // places our character back on ground if mid-air	
        gameChar_y = floorPos_y;
		isFalling = false;
		 // Level complete screen & text
        push();
		background(0, 220, 220, 100);
		fill(140, 0, 140);
		stroke(220);
		strokeWeight(6);
		textSize(60);
		textAlign(CENTER);
        textFont(gameFont);
		text(
			"Level Complete!",
			width / 2,
			height / 2);
		fill(220);
		noStroke();
		textSize(35);
		text(
			"press Space to continue",
			width / 2,
			height / 2 + 80);
		pop();
}

// function to draw "turn back" sign if character going wrong way

function turnBack_Sign()
{
//sign pole
strokeWeight(20);
stroke(80);
line(
	sign.x_pos,
	sign.y_pos - sign.h * 0.75,
	sign.x_pos , 
	sign.y_pos + sign.h * 1.5);
// sign body
    fill(133,94,66);
noStroke();
rectMode(CENTER);
rect(
	sign.x_pos,
	sign.y_pos,
	sign.length,
	sign.h,
	7);
// sign text
textSize(15);
noStroke();
fill(255);
textAlign(CENTER,BOTTOM);
text(
	"WRONG WAY", 
	sign.x_pos,
	sign.y_pos - 10);
text(
"Turn back!", 
sign.x_pos,
sign.y_pos + 10);

// right arrow
fill(255);
stroke(255)
strokeWeight(2);
triangle(
	sign.x_pos + sign.length /2 * 0.5, 
	sign.y_pos + sign.h /2* 0.6, 
	sign.x_pos + sign.length /2 * 0.2,
	sign.y_pos + sign.h /2* 0.85 ,
	sign.x_pos + sign.length /2* 0.2,
	sign.y_pos + sign.h /2* 0.35,
	);
strokeWeight(6);
line(
    sign.x_pos + sign.length /2 * 0.2,
	sign.y_pos + sign.h /2* 0.63, 
    sign.x_pos + sign.length /2 * 0.005,
    sign.y_pos + sign.h /2* 0.63)
}

// factory pattern for creating platforms
function createPlatform(x,y,length)
{
	var p = {
		x: x ,
		y: y,
		length: length,
	// draw the platform
		draw: function(){
		fill(133,94,66);
		strokeWeight(2);
		rect(
            this.x, 
            this.y, 
            this.length, 
            30,
            this.length/10);
		fill(133,120,60);
		ellipse(
            this.x - (this.length/2) + this.length /25, 
            this.y,
            this.length /10, 
            30);
		},
    // checks if the character is on top of a platform by checking distance between character & platform
		checkContact: function(gc_x, gc_y)
		{
			if(gc_x + 20 > this.x - this.length/2 
               && gc_x - 20 < this.x + this.length/2){

				var d = this.y -15 - gc_y;
				if(d >=0 && d <5)
				{
					return true;
				}
			}
			return false;
		}
		}

	return p;

}



//constructor class for creating enemies
class Enemy{
	constructor(x,y,l,h,range){
		this.currentX = x;
		this.y = y;
		this.l = l;
		this.h = h;
		this.x = x;
		this.range = range;
		this.incr = random([-1.5, -1, 1, 1.5]);
	}

    // rendering enemies
	show(){

		//body
		fill(40);
		stroke(40);
		strokeCap(ROUND);
		strokeWeight(2);
		beginShape();
		curveVertex(
            this.x, 
            this.y - this.h/4);
		curveVertex(
            this.x + this.l/2, 
            this.y - this.h);
		curveVertex(
            this.x + this.l, 
            this.y - this.h/4);
		curveVertex(
            this.x, 
            this.y- this.h/4);
		curveVertex(
            this.x + this.l/2, 
            this.y - this.h);
		endShape(CLOSE);
	
		//buttons
		fill(255);
		noStroke();
		ellipse(
            this.x + this.l /2, 
            this.y - this.h /3.8, 
            8);
		ellipse(
            this.x + this.l/2, 
            this.y - this.h/1.9,
            8);
		ellipse(
            this.x + this.l/2, 
            this.y - this.h /1.25,
            8);
	
		//head
		ellipse(
            this.x + this.l /2, 
            this.y - this.h * 1.5, 
            this.l * 1.5,
            this.l);
		rectMode(CENTER);
		rect(
            this.x + this.l/2, 
            this.y -this.h, 
            this.l /1.5, 
            this.h /3, 
            20);
	
		//eyes
		fill(0);
		ellipse(
            this.x + this.l/2 - 15, 
            this.y - this.h * 1.5, 
            15,
            20);
		ellipse(
            this.x + this.l/2 + 15, 
            this.y - this.h * 1.5, 
            15,
            20);
	
		//mouth
		stroke(0);
		strokeWeight(4);
		line(
            this.x + this.l / 2 - 8,
            this.y - this.h,
            this.x + this.l/2 + 8, 
            this.y - this.h);
	
		}

        //  enemies movement
	move()
	{
		this.x += this.incr;
        
        // enemies x coordinate increments by our incr variable. if range is reached or enemy reaches starting position then incr is reversed & enemy turns around 

		if(this.x >= this.currentX + this.range 
           || this.x < this.currentX)
		{
			this.incr *= -1;
		}else if(flagpole.isReached)
		{
            // when flagpole is reached, enemies rise to their spaceship
			this.incr = 0;
			this.y -= 1;
		}

	}

    //  checks if our game character is making contact with an enemie
	checkContact(gc_x, gc_y) 
	{
		var d = dist(
                    gc_x, gc_y, 
                    this.x + this.l/2, 
                    this.y);

		if(d < this.l * 0.75)
		{
			return true;
		}

		return false;
    }

}

// contstructor class for creating smoke effect in lava pits. placement is using hard numbers
class Smoke{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.c = color(
                    random(100,180),
                    random(100,180), 
                    random(100,180), 
                    20);
		this.vx = random(-1,1);
		this.vy = random(-5,-1);
		this.alpha = 255;
	}
    //rendering the smoke particles
	show()
	{
		noStroke();
		fill(this.c);
		ellipse(
            this.x, 
            this.y, 
            random(40,80), 
            random(60,90));
	}

    // particles rise in random directions & alpha is decremented by 5
	update()
	{
this.x = this.x +=this.vx;
this.y += this.vy;
this.alpha -=5;
}
// checks life of particle by returning the alpha if less than 0
checkLife()
{
	return this.alpha < 0;
}

}		
