ig.module('game.entities.miscellaneous.flame')
.requires(
    'impact.entity'
)

.defines(function() {
    // Begin Flame Entity
    EntityFlame = ig.Entity.extend({
        // Set up size and animation sheet for grenade
        size: {x: 32, y: 16},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/enemies/flame.png', 32, 16 ),
        maxVel:{x: 100, y: 0},
        speed: 100,

        // Set up collision properties
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Initialize
        init: function( x, y, settings ) {
        	this.parent( x , y, settings );
            this.addAnim('idle', 1, [0]);
        	var xdir = this.flip ? 1 : -1;            
            this.vel.x = this.speed*xdir;
        }, // End init

        update: function() {
            this.parent();
            // Clean up: Auto-kill this entity if too far from player to prevent having too many entities on screen
            if(this.distanceTo(my_player) > ig.system.width)
                this.kill();
        }, // End update method

		// Override entity's collision against walls so it can pass through them.	
        handleMovementTrace: function( res ) {
        	this.pos.x += this.vel.x*ig.system.tick;
        }, // End handleMovementTrace
        
        check: function( other ) {
            other.receiveDamage( 5, this );
            this.kill();
        }, // End check
    }); // End EntityGrenade
})
