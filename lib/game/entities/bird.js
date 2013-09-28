/*
Bird.js
-------
Has the following AI:
  1. Only flies from right to left, high in the air.
  2. As it approaches the player, it will attempt to
     drop a bomb down on the player. (Use the bomb.png
     file as the projectile) Note: bomb.png is 16x16
     pixels.
  3. When the bird gets out of the player's range
     (maybe about 100 pixels on x axis) or attempts to
     go off screen, kill the bird using this.kill()
*/

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
    flip: true,
    friction: {x: 1, y: 0},
    speed: 30,
    health: 100,
    gravityFactor: 0,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly', 0.25, [0,1,2,3] );
        //this.offset.x = 6;
        //this.offset.y = 2;
        //this.anims.fly.flip.x = false;

    },

    update: function() {

        // Flipping x velocity
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
            this.anims.fly.flip.x = !this.flip;

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







