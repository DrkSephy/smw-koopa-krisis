/*

Main.js
-------
This file contains the core logic for our game, which include 
binding keyboard events, as well as the logic for the camera 
which follows the player. This file also both defines and loads
any required files or global functions for our game.

*/

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.timer',
	'impact.debug.debug',
	'game.levels.test',
	'game.levels.test2',
	'game.levels.Mushroomy',
    'game.levels.Foresty',
    'game.entities.player',
  	'game.entities.spike',
	'game.entities.crate',
  	'game.entities.healthcrate',
 	'game.entities.healthpotion',
  	'plugins.hud.hud',
  	'plugins.camera.camera',
	'plugins.director.director'
)

//Everything in the ``.defines(function()`` block of code is 
//the game logic. 

.defines(function(){
  GameInfo = new function() {
    this.score = 0;
    this.coins = 0;
},

MyGame = ig.Game.extend({

	// Add HUD property for displaying lives
	lifeSprite: new ig.Image('media/life-sprite.png'),

	// Properties for player stats screen
	statText: new ig.Font( 'media/04b03.font.png' ),
	showStats: false,
	statMatte : new ig.Image('media/stat-matte.png'),
	levelTimer : new ig.Timer(),
	levelExit: null,
	stats: {time: 0, kills: 0, deaths: 0},
   

	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	// Create a new hud instance from plugins(dot)hud(dot)hud.js
	hud: new ig.hud(),

	// Set number of lives
	lives: 3,
	
	
	gravity: 300,
	init: function() {
		// Initialize your game here; bind keys etc.

		this.camera = new Camera( ig.system.width/3, ig.system.height/3, 5 );
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

		// Add some tunes!
		ig.music.add('media/sounds/Final.*');
		ig.music.volume = 0.8;
		ig.music.play();


		//Create key bindings
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.TAB, 'switch');
		ig.input.bind( ig.KEY.X, 'jump');
		ig.input.bind( ig.KEY.C, 'shoot');
		ig.input.bind( ig.KEY.SPACE, 'continue');
		

		// Load our level. Syntax: Level(Level name)
		// Level name must be capitalized, otherwise it won't load!
		//this.loadLevel( LevelForesty);
		this.myDirector = new ig.Director(this, [
			LevelTest,
			LevelTest2
		]);
		this.myDirector.firstLevel();

		var player = ig.game.getEntitiesByType('EntityPlayer')[0];
		this.hud.setMaxHealth(player.health);
	},
	
	update: function() {

		/* This code allows the camera to follow the player 
		   by overriding the update function using the method
		   of the game class called `getEntitiesByType()`. 
		   This API allows us to find instances of entities in 
		   our game. */
		var player = this.getEntitiesByType( EntityPlayer )[0]; 
		if( player ) { 
			this.camera.follow(this.player);
			//this.screen.x = player.pos.x - ig.system.width/2; 
			//this.screen.y = player.pos.y - ig.system.height/2;
			// If the player moves, erase the instructions
			if(player.accel.x > 0 && this.font)
				this.font = null; 
		}
		// Update all entities and backgroundMaps
		/* We need to change this code to pull up the stat screen.
		   We test if it is time to show the stats screen. If it
		   is not being displayed, we call "this.parent()" and the
		   game continues normally. Otherwise, we listen for an input
		   state 'continue' */
		if(!this.showStats){
			this.parent();
		}else{
			if(ig.input.state('continue')){

				this.showStats = false;

				//pre-director plugin level switching
				//this.levelExit.nextLevel();
				
				this.myDirector.nextLevel();				

				this.parent();
			}
		}
		
		// Add your own, additional update code here
	},

	addCoin: function(){
		GameInfo.coins += 1;
	},

  	increaseScore: function(points){
    	//increase score by certain number of points
    	GameInfo.score += points;
  	},

	// Override loadLevel to start a timer to track the player
	loadLevel: function(data) {
		this.stats = {time: 0, kills: 0, deaths: 0};
		this.parent(data);
		this.player = this.getEntitiesByType( EntityPlayer )[0];
    	this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
    	this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
    	this.camera.set( this.player );  
		this.levelTimer.reset();
	}, // End loadLevel

	toggleStats: function(levelExit){
		this.showStats = true;
		this.stats.time = Math.round(this.levelTimer.delta());
		this.levelExit = levelExit;
	}, // End toggleStats

	gameOver: function(){
		ig.finalStats = ig.game.stats;
		ig.system.setGame(GameOverScreen);
	}, 
	
	draw: function() {

		// Draw all entities and backgroundMaps
		this.parent();

		// Draw life counter (HUD)
		this.statText.draw("Lives", 250, 8);
		for(var i = 0; i <= this.lives; i++)
			this.lifeSprite.draw(((this.lifeSprite.width + 2) * i) + 240, 20);

		// Add controls to bottom of game
		// **This will be replaced with a <div></div>
		// in the final product. **
		if(this.font){
			var x = ig.system.width/2;
			var y = ig.system.height - 10;
			this.font.draw('Left/Right: Move, X: Jump, C: Attack, TAB: Switch Weapon',
			x, y, ig.Font.ALIGN.CENTER)
		} // End if(this.font);

		// This is where we add our Stat Screen when the level is complete
		if(this.showStats){
			this.statMatte.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 - 20;
			var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
			this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
			this.statText.draw('Time: ' + this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
			this.statText.draw('Kills: ' + this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
			this.statText.draw('Score: ' +score, x, y+60, ig.Font.ALIGN.CENTER);
			this.statText.draw('Deaths: ' + this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
			this.statText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
		}
	} // End draw
});

// Game screens are added here.
// To add a game screen, we override the `ig.Game` class.
// The ig.Game class represents the active view of the game.
// To change to a new screen, we call ig.system.setGame and
// pass the reference of the game class we want to display.

	StartScreen = ig.Game.extend({
		font: new ig.Font( 'media/04b03.font.png' ),
		background: new ig.Image('media/screen-bg.png'),
		
		init: function(){
			ig.input.bind(ig.KEY.SPACE, 'start');
		},

		update: function(){
			if(ig.input.pressed('start')){
				ig.system.setGame(MyGame)
			}
			this.parent();
		}, // End update

		draw: function(){
			this.parent();
			this.background.draw(0,0);
			var x = ig.system.width/2,
			y = ig.system.height/2;
			this.font.draw('Press the Spacebar to Start', x , y, ig.Font.ALIGN.CENTER);
		} // End draw
	  

	}); // End StartScreen

	// Start Game Over Screen
	// Game over screen will show the player several stats as well

	GameOverScreen = ig.Game.extend({
    
    	instructText: new ig.Font( 'media/04b03.font.png' ),
    	background: new ig.Image('media/screen-bg.png'),
    	gameOver: new ig.Image('media/gameover.png'),
    	stats: {},
    
    	init: function() {
        	ig.input.bind( ig.KEY.SPACE, 'start');
        	this.stats = ig.finalStats;
    	},

    	update: function() {
        	if(ig.input.pressed('start')){
            	ig.system.setGame(StartScreen)
        	}
        	this.parent();
    	},

    	// Draw the stats on Game Over Screen
    	draw: function() {
        	this.parent();
        	this.background.draw(0,0);
        	var x = ig.system.width/2;
        	var y = ig.system.height/2 - 20;
        	this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
        	var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
        	this.instructText.draw('Total Kills: ' +this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
        	this.instructText.draw('Total Deaths: ' +this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
        	this.instructText.draw('Score: ' +score, x, y+50, ig.Font.ALIGN.CENTER);
        	this.instructText.draw('Press Spacebar To Continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
    	}
	});


/* The following code passes a reference to the Canvas, which is
a name for our game instance, and passes the frame rate and size
into the ig.main constructor. */

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
// Change "MyGame" to "StartScreen"
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
