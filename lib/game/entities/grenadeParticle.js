ig.module('game.entities.GrenadeParticle')
.requires(
    'impact.entity'
)

.defines(function() {
    EntityGrenadeParticle = ig.Entity.extend({

        // Set up properties
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 1,
        fadetime: 1,
        bounciness: 0.3,
        vel: {x: 40, y: 50},
        friction: {x: 20, y: 20},

        // Set up collision properties
        checkAgainst: ig.Entity.TYPE.B, 
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet('media/explosion.png', 1, 1),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            
            // Randomize the particles
            this.vel.x = (Math.random() * 4 -1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim('idle', 0.2, [frameID]);

        }, // End init

        update: function() {
            if(this.idleTimer.delta() > this.lifeTime){
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
        }
    }); // End EntityGrenadeParticle
})