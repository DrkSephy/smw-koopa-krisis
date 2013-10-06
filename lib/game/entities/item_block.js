ig.module(
    'game.entities.item_block'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityItem_block = ig.Entity.extend({
        size: {x: 16, y: 16},
        gravity: 0,
        gravityFactor: 0,

        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B, 
        checkAgainst: ig.Entity.TYPE.A,
        speed: 0,
        maxVel: {x: 0, y:0},
        animSheet: new ig.AnimationSheet('media/questionmark_block.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('rotate', 0.20, [0,1,2,3]);
            this.addAnim('hit', 1, [4]);
        }, // End init

        


    })
}) // End .defines