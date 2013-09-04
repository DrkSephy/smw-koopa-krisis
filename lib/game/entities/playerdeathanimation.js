/* 
Playerdeathanimation.js
-----------------------
    This file contains the code for Death animations of both 
    the player and enemies. If an enemy has died, the color
    offset for the death particles will be green, and if the
    player has died then red particles will spawn. The logic
    for the particles spawned on death is contained within
    DeathExplosionParticle.js.
*/

 ig.module('game.entities.playerdeathanimation')
 .requires(
    'impact.entity'
)
 .defines(function() {


 // Death animation for player character
 // Spawns red blood upon death
    EntityPlayerdeathanimation = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
});