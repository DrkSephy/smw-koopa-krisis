ig.module(
    'game.entities.hammer_suit'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityHammer_suit = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/hammer_suit.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            console.log(player.activeWeapon);
            player.activeWeapon = "EntityHammer";
            this.kill();
        }
    })
})