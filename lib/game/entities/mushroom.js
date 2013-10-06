ig.module(
    'game.entities.mushroom'
)
.requires(
    'impact.entity'
)

.defines(function(){
    EntityMushroom = ig.Entity.extend({
        size: {x: 16, y: 16},
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/mushroom_powerup.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        check: function(other){
            other.receiveDamage(-10, this);
            this.kill();
        }
    })


}); // End .defines