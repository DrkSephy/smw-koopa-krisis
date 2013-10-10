ig.module(
    'game.entities.powerups.hammer_suit'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityHammer_suit = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        getPowerup: new ig.Sound('media/sounds/get_powerup.*'),
        animSheet: new ig.AnimationSheet('media/hammer_suit.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.getPowerup.volume = 0.5;
            this.getPowerup.play();
            player.activePower = "EntityHammer";
            this.kill();
        }
    })
})