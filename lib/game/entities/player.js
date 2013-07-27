/*

Player.js
---------
This file contains the code for our player entity. An
entity is any object which exists in the level but are
not a part of the map. The player class extends the 
main entity.js class. 

*/

// Create basic structure of an entity
ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)

.defines(function() {
    EntityPlayer = ig.Entity.extend({
        // Type.A collision is for our character (friendly group)
        type: ig.Entity.TYPE.A,
        // checkAgainst: set this to group B to damage an enemy
        // when run against/jumped on. Important for Mario-esque games.
        checkAgainst: ig.Entity.TYPE.NONE,
        // If our character bumps into a wall, don't move the player
        collides: ig.Entity.COLLIDES.PASSIVE,
    // Set up an animation sheet
    // Points to input file, sets tiles to 16 x 16 pixels
        animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16),
    // Set up size object of player
        size: {x: 8, y: 18},
    // Set up offset object of player
    // Offset tells the animation engine where to render
    // the player sprite inside the bounding box
        offset: {x: 4, y: 2},
        flip: false, 
    // Define physics objects of player
        maxVel: {x: 100, y: 200},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
        health: 10,

    // Create an init() method for the player class
        init: function( x, y, settings ) { 
        // Pass parent init method, passes starting x, y positions
            this.parent( x, y, settings ); 
            this.addAnim( 'idle', 1, [0] ); 
            this.addAnim( 'run', 0.07, [0,1,2,3,4,5] ); 
            this.addAnim( 'jump', 1, [9] ); 
            
            this.addAnim( 'fall', 0.4, [6,7] ); 

    },

        update: function() {
            // move left or right
            var accel = this.standing ? this.accelGround : this.accelAir; 
            if( ig.input.state('left') ) {
                this.accel.x = -accel;
                this.flip = true;
            }else if( ig.input.state('right') ) {
                this.accel.x = accel;
                this.flip = false; 
            }else{
                this.accel.x = 0; 
            }
            // jump
            if( this.standing && ig.input.pressed('jump') ) {
                this.vel.y = -this.jump; 
            }
            // move!
            this.currentAnim.flip.x = this.flip;
            this.parent(); 
            // Set the current animation, based on the player's speed
            if( this.vel.y < 0) {
                 this.currentAnim = this.anims.jump;
            }
            else if( this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            }
            else if( this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            }
            else {
             this.currentAnim = this.anims.idle;
            }
        },
        
    });
});