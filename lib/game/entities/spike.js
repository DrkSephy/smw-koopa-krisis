/*

Spike.js
--------
This is the entity file for our first monster.
The behavior of this entity is similar to many
Mario-esque enemies, so this code will be highly
reuseable.

Enemy Behavior:
--------------
    1. Moves side to side on a platform.
    2. Does not fall off platform by detecting
       when close to an edge.
    3. Does not shoot projectiles, it's only 
       means of damaging the player is by 
       physical contact between the two entities.
*/

ig.module(
    'game.entities.spike'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntitySpike = ig.Entity.extend({

    // Set up collision
    // TYPE.B: unfriendly group (monsters)
    type: ig.Entity.TYPE.B,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    // Add animation
    animSheet: new ig.AnimationSheet( 'media/spike.png', 16, 9),
    size: {x: 16, y: 9},
    maxVel: {x: 100, y: 100},
    flip: false,
    friction: {x: 150, y: 0},
    speed: 14,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('crawl', 0.08, [0,1,2] );
    },

    update: function() {

        // Check if enemy is near edge. If so, return
        // Check if enemy hits anything in the collision map
        // If true, toggle `this`
        if( !ig.game.collisionMap.getTile (
            this.pos.x + (this.flip ? + 4: this.size.x -4),
                this.pos.y + this.size.y+1)
        ){
            this.flip = !this.flip;
        }
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
            this.flip = !this.flip;
        }
    },

    /*
    Simply setting up collisions isn't enough, we must create a method
    which will check if a collision occurs. This method overrides the 
    .check() function, which gets called when a collision is detected, 
    and applies damage to the entity it collides with.
    */
    check: function( other ) { 
        other.receiveDamage( 10, this );
    },

    kill: function(){
        ig.game.stats.kills ++;
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});

    }, // End Kill method

    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
    }, // End receiveDamage

    
    }); // End EntitySpike
}); // End .defines
