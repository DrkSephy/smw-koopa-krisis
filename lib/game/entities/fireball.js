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

        maxVel: {x: 300, y: 200},
        bounceCounter: 0,
        bounciness: 0.6,
        arc_distance: 150,
        arc_height: 40,
        gravity: 50,
        

        // Set up collision properties
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,
        

        // Initialize
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = (settings.flip ? -this.arc_distance : this.arc_distance);
            this.vel.y = -(this.arc_height + (Math.random()*50));
            this.addAnim( 'idle', 0.1, [0,1,2,3] );
        }, // End Initialize

        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y || res.collision.slope ){
                this.bounceCounter++;
                if(this.bounceCounter > 3){
                this.kill();
                }
            }
        }, // End handleMovementTrace

        // Function for checking collision and applying damage
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    }); // End Entity Bullet
})
