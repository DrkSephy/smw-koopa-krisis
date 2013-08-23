ig.module('game.entities.deathexplosion')
.requires(
    'impact.entity'
)

.defines(function() {
    // Begin Death animation entity

    EntityDeathExplosion = ig.Entity.extend({

        //Death Explosion properties
        lifetime: 1,
        callBack: null,
        particles: 25,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset:
                    settings.colorOffset ? settings.colorOffset: 0});
                this.idleTimer = new ig.Timer();
        }, // End EntityDeathExplosion init method

        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }, // End EntityDeathExplosion update method

    }); // End EntityDeathExplosion
})