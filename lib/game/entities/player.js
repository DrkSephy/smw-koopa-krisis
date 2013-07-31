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

      
        // Make player not invisble on new level load
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0,0, 0.7)',
        // Type.A collision is for our character (friendly group)
        type: ig.Entity.TYPE.A,

        // checkAgainst: set this to group B to damage an enemy
        //               when run against/jumped on. Important for 
        //               Mario-esque games.
        checkAgainst: ig.Entity.TYPE.NONE,

        // If our character bumps into a wall, don't move the player
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Set up an animation sheet
        // Points to input file, sets tiles to 16 x 16 pixels
        animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16),

        // Set up size object of player
        size: {x: 8, y: 14},
    
        // Set up offset object of player
        // Offset: Tells the animation engine where to render
        //         the player sprite inside the bounding box
        offset: {x: 4, y: 2},
        flip: false, 

        // Define physics objects of player
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
        // Keep track of weapons
        weapon: 0,
        totalWeapons: 2,
        activeWeapon: "EntityBullet",
        health: 10,

        // Create an init() method for the player class
        init: function( x, y, settings ) { 
        // New Animation setup based on weapon as an offset
        // By taking the weapon Id (is the offset), we multiply
        // it by the total number of player frames with a weapon,
        // add it to each animation. 

        

        // Pass parent init method, passes starting x, y positions
            this.setupAnimation(this.weapon);
            this.parent( x, y, settings ); 
            
        /*  Old Animation setup
            this.addAnim( 'idle', 1, [0] ); 
            this.addAnim( 'run', 0.07, [0,1,2,3,4,5] ); 
            this.addAnim( 'jump', 1, [9] ); 
            
            this.addAnim( 'fall', 0.4, [6,7] ); 
        */

        },

        setupAnimation: function(offset) {
         offset = offset * 10; 
         this.addAnim('idle', 1, [0+offset]);
         this.addAnim('run', .07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
         this.addAnim('jump', 1, [9+offset]);
         this.addAnim('fall', 0.4, [6+offset,7+offset]);
        },

        // Create our update function for character
        update: function() {
            
            // Add left/right movement logic
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

            // Add jumping logic
            if( this.standing && ig.input.pressed('jump') ) {
                this.vel.y = -this.jump; 
            }

            // Add shooting logic
            if( ig.input.pressed('shoot') ) {
                ig.game.spawnEntity(this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip});
            }

            if( ig.input.pressed('switch') ) {
             this.weapon ++;
             if(this.weapon >= this.totalWeapons)
             this.weapon = 0;
                switch(this.weapon){
                 case(0):
                 this.activeWeapon = "EntityBullet";
                 break;
                 case(1):
                 this.activeWeapon = "EntityGrenade";
                 break;
                }
                this.setupAnimation(this.weapon);
            }

           
            // Add moving logic
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

    /*
    We will add our weapons here as an `inner class`. We don't want weapons
    to appear in the editor, so we control the scope of their appearances
    within this inner class. EntityGrenade/EntityBullet inherits all properties
    and methods of the player and monster entities, such as flip.
    */

    // Begin Bullet Entity
    EntityBullet = ig.Entity.extend({

        // Set up size and animation sheet for bullets
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
        maxVel: {x: 200, y: 0},

        // Set up collisio properties
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Initialize
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            // The line below checks what direction the bullet is shot
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.2, [0] );
        }, // End Initialize

        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        }, // End handleMovementTrace

        // Function for checking collision and applying damage
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    }); // End Entity Bullet

    // Begin Grenade Entity
    EntityGrenade = ig.Entity.extend({
        // Set up size and animation sheet for grenade
        size: {x: 4, y: 4},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),

        // Set up collision properties
        // Grenade now damages BOTH player and enemies alike!
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Set up grenade bounce properties
        maxVel: {x: 200, y: 200},
        bounciness: 0.5,
        bounceCounter: 0,

        // Initialize
        init: function( x, y, settings ) {
             /*
            Algorithm:
            ----------
            1.  Determine the beginning x-velocity based on the flip parameter
                which is passed through the settings parameter. 
            2.  When a grenade is fired, set the player's own flip value
                into a property of the settings object to we can know 
                what direction to fire the grenade.
            3.  Offset the y-velocity to help it arc when it gets fired.
            */
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0,1] );
        }, // End init

        // Create a method to trace number of collisions of grenade
        // Destroy the grenade after X bounces
        // Grenades will also damage player

        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ) {
                // only bounce 3 times
                this.bounceCounter++;
                if( this.bounceCounter > 3 ) {
                    this.kill();
                }
            }
        }, // End handleMovementTrace
        check: function( other ) {
            other.receiveDamage( 10, this );
            this.kill();
        }, // End check
       
    }); // End EntityGrenad
    
}); // End .define