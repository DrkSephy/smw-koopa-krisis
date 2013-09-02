/*
bullet.js
---------
    This file contains the functionality of the bullet entity,
    which is spawned on keypress while a gun is held.

*/

ig.module('game.entities.bullet')
.requires(
    'impact.entity'  
)

.defines(function(){
    
    EntityBullet = ig.Entity.extend({

        // Set up size and animation sheet for bullets
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
        maxVel: {x: 200, y: 0},

        // Set up collision properties
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
})
