/*

Blue Koopa
----------
AI: Moves left and right, detects ledges.


*/
ig.module(
    'game.entities.boo'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){

EntityBoo = ig.Entity.extend({

    // Set up collision
    // TYPE.B: unfriendly group (monsters)
    type: ig.Entity.TYPE.NONE,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    // Add animation
    animSheet: new ig.AnimationSheet( 'media/enemies/boo.png', 16, 16),
    size: {x: 16, y: 16},
    maxVel: {x: 10, y: 10},
    flip: true,
    friction: {x: 1, y: 0},
    speed: 10,
    health: 100,
    gravityFactor: 0,

    // Set up animations
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('stalk', 0.25, [1] );
        this.addAnim('idle', 0.25, [0] );

        // Load player object if not in weltmeister
        if (!ig.global.wm)
            myPlayer = ig.game.getEntitiesByType('EntityPlayer')[0];

    },

    update: function() {

        var xdir = this.flip ? -1 : 1;
        this.vel.x = this.speed * xdir;
        this.parent();

        // Player facing boo, infront boo -> idle
        if (myPlayer.flip == this.flip) {
            this.currentAnim = this.anims.idle;
            this.speed = 0;
            this.vel.y = 0;
        }

        // Player facing left, behind boo-> Stalk
        else if (myPlayer.flip != this.flip) {
            this.currentAnim = this.anims.stalk;
            this.speed = 10;

            // Move up if player is above Boo
            if (this.pos.y < myPlayer.pos.y)
                this.vel.y = 10;

            // Move down if player is below Boo
            else if (this.pos.y > myPlayer.pos.y)
                this.vel.y = -10;
        }

        // Make Boo change direction to follow player
        if(this.distanceTo(myPlayer) < 200 && this.distanceTo(myPlayer) > 0) {

            // Monster to the left of player
            if ( this.pos.x - myPlayer.pos.x  > 5 && !myPlayer.standing) {
                this.flip = true;
                this.anims.stalk.flip.x = false;
                this.anims.idle.flip.x = false;
            }

            // Monster to the right of player
            else if ( this.pos.x - myPlayer.pos.x  < 5 ) {
                this.flip = false;
                this.anims.stalk.flip.x = true;
                this.anims.idle.flip.x = true;
            }
        }

    },

    /*
    Collisions with walls are handled through the following function.
    If a monster runs into a wall, make them turn around.
    */
    handleMovementTrace: function(res) {
       this.parent(res);

    },

    collideWith: function(other, axis ) {

    // Only do something if colliding with the Player
    if( other instanceof EntityPlayer ) {

        other.receiveDamage( 1, this );
        if ( other.health <= 0) {
            myPlayer = ig.game.getEntitiesByType('EntityPlayer')[0];
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
        ig.game.increaseScore(9001);
        this.parent();
    }, // End Kill method

    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
    }, // End receiveDamage


    }); // End EntityBlueKoopa
}); // End .defines





