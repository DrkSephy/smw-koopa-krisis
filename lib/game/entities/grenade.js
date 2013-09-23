ig.module('game.entities.grenade')
.requires(
    'impact.entity'
)

.defines(function() {
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
        collides: ig.Entity.COLLIDES.NEVER,

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
})
