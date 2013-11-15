ig.module(
    'game.entities.powerups.fireflower'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityFireflower = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        getPowerup: new ig.Sound('media/sounds/sfx/get_powerup.*'),
        animSheet: new ig.AnimationSheet('media/fireflower_powerup.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            player.activePower = "EntityFireball";
            this.getPowerup.volume = 0.5;
            this.getPowerup.play();
            this.kill();
        }
    })
})