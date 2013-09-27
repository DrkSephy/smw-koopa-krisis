ig.module(
    'game.entities.bird'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){

EntityBird = ig.Entity.extend({

    // Set up collision
    // TYPE.B: unfriendly group (monsters)
    type: ig.Entity.TYPE.B,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    // Add animation
    animSheet: new ig.AnimationSheet( 'media/enemies/bird.png', 60, 30),
    size: {x: 60, y: 30},
    maxVel: {x: 500, y: 100},
    //flip: false,
    friction: {x: 1, y: 0},
    speed: 10,
    health: 10,
    gravityFactor: 0,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly', 0.30, [0,1,2,3] );
        //this.offset.x = 6;
        //this.offset.y = 2;
        //this.anims.fly.flip.x = false;
        
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
            this.anims.fly.flip.x = this.flip; 
                            
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

    
    }); // End EntityBird
}); // End .defines







