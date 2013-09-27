/*
Thwomp.js
---------
Has the following AI:

  1. Calculates the player's distance relative to itself.
     Plays the animation frame [0] initially.
  2. If player is getting closer, it's animation frame
     will be [1]. 
  3. If player is a few pixels from it (very close to the
     thwomp), it will fall downwards towards the player. 
     The animation frame for the falling animation is [2].
     To detect the ground, just check for a collision on the
     y-axis.
  4. It goes back up to it's starting position after X amount
     of seconds (maybe 1 or 2, choose whatever feels right to you). 
     As it is going back up, play animation frame [0]. 
*/

ig.module(
    'game.entities.thwomp'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){

EntityThwomp = ig.Entity.extend({

    // Set up collision
    // TYPE.B: unfriendly group (monsters)
    type: ig.Entity.TYPE.B,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    // Add animation
    animSheet: new ig.AnimationSheet( 'media/enemies/thwomp.png', 32, 32),
    size: {x: 32, y: 32},
    maxVel: {x: 500, y: 100},
    //flip: false,
    friction: {x: 1, y: 0},
    speed: 10,
    health: 10,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fall', 0.30, [0,1,2] );
        //this.offset.x = 6;
        //this.offset.y = 2;
        //this.anims.fall.flip.x = false;
        
    },

    update: function() {

       
        
        this.parent();
    },

    /*
    Collisions with walls are handled through the following function.
    If a monster runs into a wall, make them turn around.
    */
    handleMovementTrace: function(res) {
       
       this.parent(res); 
        // If the enemy collides with a wall, return
        if(res.collision.x) {
            console.log(this.flip); 
            this.flip = !this.flip;
            this.anims.fall.flip.x = this.flip; 
                            
        }
    },

    collideWith: function(other, axis ) {
    
    // Only do something if colliding with the Player
    if( other instanceof EntityPlayer ) {
    
        if( axis == 'y' ) {
           
            this.kill();
            //ig.game.score += 1;
        }
        else {
            other.receiveDamage( 1, this );
            
            if( other.pos.x > this.pos.x ) {
                // Player on the right -> move back right
                other.vel.x = 50; 
            }
            else {
                // Player on the left -> move back left
                other.vel.x = -50; 
                }
            }
        }
    },


    /*
    Simply setting up collisions isn't enough, we must create a method
    which will check if a collision occurs. This method overrides the 
    .check() function, which gets called when a collision is detected, 
    and applies damage to the entity it collides with.
    */
    check: function( other ) { 
        other.receiveDamage( 1, this );
      

    },

    kill: function(){
        ig.game.stats.kills ++;
        ig.game.increaseScore(100);
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset: 1});
        

    }, // End Kill method

    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
    }, // End receiveDamage

    
    }); // End EntityThwomp
}); // End .defines






