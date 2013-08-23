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
    'impact.entity',
    'impact.sound',
    'game.entities.bullet'
)

.defines(function() {
    EntityPlayer = ig.Entity.extend({

        // On respawn, the player gets a brief invincibility period
        // Set up invincibility properties
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer: null,

        /* Add Sound effect files
           The asterisk (*) denotes that the ig.SoundManager
           Module will automatically detect which music format
           is required for the browser. */
        jumpSFX: new ig.Sound('media/sounds/jump.*'),
        shootSFX: new ig.Sound('media/sounds/shoot.*'),
        deathSFX: new ig.Sound('media/sounds/death.*'),

      
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

        // Used to keep track of current and total weapons
        // Weapon properties
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
            this.startPosition = {x:x, y:y};
            this.setupAnimation(this.weapon);
            this.parent( x, y, settings ); 
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
            
        /*  Old Animation setup
            this.addAnim( 'idle', 1, [0] ); 
            this.addAnim( 'run', 0.07, [0,1,2,3,4,5] ); 
            this.addAnim( 'jump', 1, [9] ); 
            
            this.addAnim( 'fall', 0.4, [6,7] ); 
        */

        }, // End EntityPlayer init method

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
                this.jumpSFX.play();
            }

            // Add shooting logic
            if( ig.input.pressed('shoot') ) {
                ig.game.spawnEntity(this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip});
                this.shootSFX.play();
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
            // Test for invincibility timer. If the timer is greater
            // then the delay we set, then we force the invincibility
            // flag to be false and alpha to be 1. 
            if(this.invincibleTimer.delta() > this.invincibleDelay){
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }

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
        }, // End EntityPlayer update method

        // This method is called on player's death
        kill: function(){
            this.deathSFX.play();
            this.parent();
            ig.game.respawnPosition = this.startPosition;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath} );
        }, // End EntityPlayer kill method

        // Method for toggling invincibility
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        }, // End EntityPlayer makeInvincible method

        // If invincible flag is true, don't deal damage. 
        // Otherwise, receive damage
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.parent(amount, from);
        }, // End EntityPlayer recieveDamage method

        // Test for invincibility in the draw method as well.
        // If true, set alpha to represent how much longer invincibility lasts.
        // In Impact, alpha is a value between 0 and 1. 
        draw: function(){
            if(this.invincible)
                // Calculate percentage used for player fade in
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay*1;
            this.parent();
        }, // End EntityPlayer draw method 

        // On a player's death, this method checks # of lives and displays the proper screen
        // If lives > 0, respawn the player, else show game over screen
        onDeath: function(){
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
            }
        }, // End EntityPlayer onDeath method
    
        
});

    /*
    We will add our weapons here as an `inner class`. We don't want weapons
    to appear in the editor, so we control the scope of their appearances
    within this inner class. EntityGrenade/EntityBullet inherits all properties
    and methods of the player and monster entities, such as flip.
    */

    // Begin Bullet Entity
    

    // Begin Grenade Entity
    EntityGrenade = ig.Entity.extend({
        // Set up size and animation sheet for grenade
        size: {x: 4, y: 4},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/slime-grenade.png', 8, 8 ),

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
       
        kill: function(){
            for(var i = 0; i < 20; i++)
                ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
            this.parent();
        }, // End kill

    }); // End EntityGrenade

    // Begin Death animation entity

    EntityDeathExplosion = ig.Entity.extend({

        //Death Explosion properties
        lifetime: 1,
        callBack: null,
        particles: 25,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset:
                    settings.colorOffset ? settings.colorOffset: 0});
                this.idleTimer = new ig.Timer();
        }, // End EntityDeathExplosion init method

        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }, // End EntityDeathExplosion update method

    }); // End EntityDeathExplosion

    // Begin Entity Death Animation
    EntityDeathExplosionParticle = ig.Entity.extend({

        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x: 100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset* (this.totalColors+1));
            this.addAnim('idle', 0.2, [frameID]);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
         },

         update: function(){
            // If timer of particles is greater than the one we set for it, then
            // destroy the particle
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            // The alpha value is dependent on the timer
            // As time++, alpha-- and therefore particles fade 
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
         }
    }); // End EntityDeathExplosionParticle

    EntityGrenadeParticle = ig.Entity.extend({

        // Set up properties
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 1,
        fadetime: 1,
        bounciness: 0.3,
        vel: {x: 40, y: 50},
        friction: {x: 20, y: 20},

        // Set up collision properties
        checkAgainst: ig.Entity.TYPE.B, 
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet('media/explosion.png', 1, 1),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            
            // Randomize the particles
            this.vel.x = (Math.random() * 4 -1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim('idle', 0.2, [frameID]);

        }, // End init

        update: function() {
            if(this.idleTimer.delta() > this.lifeTime){
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
        }
    }); // End EntityGrenadeParticle
    
}); // End .define