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
	'game.levels.test',
	'game.levels.test2',
	'game.entities.player',
	'game.entities.spike'
)

//Everything in the ``.defines(function()`` block of code is 
//the game logic. 

.defines(function(){

MyGame = ig.Game.extend({

	// Properties for player stats screen
	statText: new ig.Font( 'media/04b03.font.png' ),
	showStats: false,
	statMatte : new ig.Image('media/stat-matte.png'),
	levelTimer : new ig.Timer(),
	levelExit: null,
	stats: {time: 0, kills: 0, deaths: 0},

	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	// Set number of lives
	lives: 3,
	
	gravity: 300,
	init: function() {
		// Initialize your game here; bind keys etc.

		// Add some tunes!
		ig.music.add('media/sounds/theme.*');
		ig.music.volume = 0.5;
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
		this.loadLevel( LevelTest);
	},
	
	update: function() {

		/* This code allows the camera to follow the player 
		   by overriding the update function using the method
		   of the game class called `getEntitiesByType()`. 
		   This API allows us to find instances of entities in 
		   our game. */
		var player = this.getEntitiesByType( EntityPlayer )[0]; 
		if( player ) { 
			this.screen.x = player.pos.x - ig.system.width/2; 
			this.screen.y = player.pos.y - ig.system.height/2;
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
				this.levelExit.nextLevel();
				this.parent();
			}
		}
		
		// Add your own, additional update code here
	},

	// Override loadLevel to start a timer to track the player
	loadLevel: function(data) {
		this.stats = {time: 0, kills: 0, deaths: 0};
		this.parent(data);
		this.levelTimer.reset();
	}, // End loadLevel

	toggleStats: function(levelExit){
		this.showStats = true;
		this.stats.time = Math.round(this.levelTimer.delta());
		this.levelExit = levelExit;
	}, // End toggleStats
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		// Add controls to bottom of game
		// **This will be replaced with a <div></div>
		// in the final product. **
		if(this.font){
		var x = ig.system.width/2,
		y = ig.system.height - 10;
		this.font.draw(
			'Left/Right: Move, X: Jump, C: Attack, TAB: Switch Weapon',
			x, y, ig.Font.ALIGN.CENTER)
		} // End if(this.font);
		// This is where we add our Stat Screen when the level is complete
		if(this.showStats){
			this.statMatte.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 - 20;
			this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
			this.statText.draw('Time: ' + this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
			this.statText.draw('Kills: ' + this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
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




/* The following code passes a reference to the Canvas, which is
a name for our game instance, and passes the frame rate and size
into the ig.main constructor. */

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
// Change "MyGame" to "StartScreen"
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
