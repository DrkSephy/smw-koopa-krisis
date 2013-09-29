ig.module(
    'game.entities.coin'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityCoin = ig.Entity.extend({
        size: {x: 20, y: 20},
        collides: ig.Entity.COLLIDES.LITE,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/coin.png', 16, 16),
        coinSFX: new ig.Sound('media/sounds/get_coin.*'),
        gravityFactor: 0,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0,1,2,3]);
        },

        check: function(other){
            if(other.name == "player"){
                ig.game.addCoin();
                this.coinSFX.volume = 0.7;
                this.coinSFX.play();
                this.kill();
            }
        }
    })
});
