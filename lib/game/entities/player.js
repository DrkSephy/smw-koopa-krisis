ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.A

        
    });
});