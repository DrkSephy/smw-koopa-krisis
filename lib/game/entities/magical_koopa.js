/*
Magical Koopa
-------------
Has the following AI: 

  1. Teleports a reasonable amount of pixels away from the
     player (in front of him). During this, play his 
     animation frame [0] (idle). The teleportation will need
     some method of determining whether or not the magic koopa
     is landing on a valid tile. Not sure how to check that.
  2. Calculates an angle to the player, and fires a projectile
     at the player (the projectile can pass through all objects).
     (Use the flame.png for the projectile, it's 32x16 pixels.)
     Play frames [0,1,2] for shooting animation.
  3. Repeat this cycle.

*/


ig.module(
    'game.entities.magical_koopa'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){

EntityMagical_koopa = ig.Entity.extend({

    // Set up collision
    // TYPE.B: unfriendly group (monsters)
    type: ig.Entity.TYPE.B,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    // Add animation
    animSheet: new ig.AnimationSheet( 'media/enemies/magical_koopa.png', 32, 32),
    size: {x: 32, y: 32},
    maxVel: {x: 500, y: 100},
    //flip: false,
    friction: {x: 1, y: 0},
    speed: 10,
    health: 10,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('shoot', 0.20, [0,1,2,3] );
        this.offset.x = 0;
        this.offset.y = 0;
        this.anims.shoot.flip.x = false;
        
    },

    update: function() {

       
        var xdir = this.flip ? -1 : 1;
        this.vel.x = this.speed * xdir;
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
            this.anims.shoot.flip.x = this.flip; 
                            
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

    
    }); // End EntityMagical_koopa
}); // End .defines






