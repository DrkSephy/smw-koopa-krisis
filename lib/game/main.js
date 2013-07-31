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
	'game.levels.test',
	'game.levels.test2',
	'game.entities.player',
	'game.entities.spike'
)

//Everything in the ``.defines(function()`` block of code is 
//the game logic. 

.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
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
		this.parent();
		
		// Add your own, additional update code here
	},
	
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
		} //End if(this.font);

		} // End draw
});


/* The following code passes a reference to the Canvas, which is
a name for our game instance, and passes the frame rate and size
into the ig.main constructor. */

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
