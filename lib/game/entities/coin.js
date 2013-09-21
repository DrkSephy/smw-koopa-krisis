ig.module(
    'game.entities.coin'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityCoin = ig.Entity.extend({
        size: {x: 20, y: 20},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/coin.png', 20, 20),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            if(other.name == "player"){
                ig.game.addCoin();
                this.kill();
            }
        }
    })
});