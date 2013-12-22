ig.module(
    'game.entities.powerups.mushroom'
)
.requires(
    'impact.entity'
)

.defines(function(){
    EntityMushroom = ig.Entity.extend({
        size: {x: 16, y: 16},
        maxVel: {x: 100, y: 100},
        speed: 50,
        gravity: 10,
        gravityFactor: 1,
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        getPowerup: new ig.Sound('media/sounds/sfx/get_powerup.*'),
        animSheet: new ig.AnimationSheet('media/mushroom_powerup.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        }, // End init


        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x){
                this.flip = !this.flip;
                this.anims.idle.flip.x = this.flip;
            }

        },

        check: function(other){
            other.receiveDamage(-10, this);
            this.getPowerup.volume = 0.5;
            this.getPowerup.play();

            this.kill();
        }, // End check
    })


}); // End .defines