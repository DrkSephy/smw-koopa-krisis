ig.module('game.entities.entitydeathexplosion')
.requires(
    'impact.entity'
)

.defines(function() {
    // Begin Entity Death Animation
    EntityDeathExplosionParticle = ig.Entity.extend({

        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x: 100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset* (this.totalColors+1));
            this.addAnim('idle', 0.2, [frameID]);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
         },

         update: function(){
            // If timer of particles is greater than the one we set for it, then
            // destroy the particle
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            // The alpha value is dependent on the timer
            // As time++, alpha-- and therefore particles fade 
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
         }
    }); // End EntityDeathExplosionParticle
})