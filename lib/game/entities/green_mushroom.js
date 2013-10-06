ig.module(
    'game.entities.green_mushroom'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityGreen_mushroom = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/green_mushroom.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            ig.game.lives += 1;
            this.kill();
        }
    })
})