ig.module('game.entities.hammer')
.requires(
    'impact.entity'
)

.defines(function() {
    // Begin Grenade Entity
    EntityHammer = ig.Entity.extend({
        // Set up size and animation sheet for grenade
        size: {x: 16, y: 16},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/transhammers.png', 16, 16 ),

        // Set up collision properties
        // Grenade now damages BOTH player and enemies alike!
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,

        // Set up grenade bounce properties
        maxVel: {x: 200, y: 200},
        bounciness: 0.5,
        bounceCounter: 0,
        arc_distance: 200,
        arc_height: 50,
        

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
            this.vel.x = (settings.flip ? -this.arc_distance : this.arc_distance);
            this.vel.y = -(this.arc_height + (Math.random()*100));
            this.addAnim( 'idle', 0.1, [0,1, 2, 3] );
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
           this.parent();
        }, // End kill

    }); // End EntityGrenade
})
