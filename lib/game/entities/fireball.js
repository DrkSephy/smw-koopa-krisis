/*
bullet.js
---------
    This file contains the functionality of the bullet entity,
    which is spawned on keypress while a gun is held.

*/

ig.module('game.entities.fireball')
.requires(
    'impact.entity'  
)

.defines(function(){
    
    EntityFireball = ig.Entity.extend({

        // Set up size and animation sheet for bullets
        animSheet: new ig.AnimationSheet( 'media/transfireballs.png', 8, 8 ),
        size: {x: 8, y: 8},

        maxVel: {x: 200, y: 0},

        // Set up collision properties
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,

        // Initialize
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            // The line below checks what direction the fireballs is shot
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.1, [0,1,2,3] );
        }, // End Initialize

        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y || res.collision.slope ){
                this.kill();
            }
        }, // End handleMovementTrace

        // Function for checking collision and applying damage
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    }); // End Entity Bullet
})
