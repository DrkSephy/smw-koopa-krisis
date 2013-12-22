ig.module(
    'game.entities.powerups.healthpotion'
)

.requires('impact.entity')

.defines(function() {

    EntityHealthpotion = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/healthpotion.png', 16, 24),

        init: function(x, y, settings){
            this.parent(x,y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other) {
            other.receiveDamage(-10, this);
            this.kill();
        }
    })
});