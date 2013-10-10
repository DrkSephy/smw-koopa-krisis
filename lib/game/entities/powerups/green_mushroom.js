ig.module(
    'game.entities.powerups.green_mushroom'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){
    EntityGreen_mushroom = ig.Entity.extend({
        size: {x: 16, y: 16},
        maxVel: {x: 100, y: 100},
        speed: 50,
        gravity: 10,
        gravityFactor: 1,
        collides: ig.Entity.COLLIDES.NONE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        getLife: new ig.Sound('media/sounds/get_life.*'),
        animSheet: new ig.AnimationSheet('media/green_mushroom.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },

        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res){
            this.parent(res);
            if(res.collision.x){
                this.flip = !this.flip;
                this.anims.idle.flip.x = this.flip;
            }

        },


        check: function(other){
            this.getLife.volume = 0.5;
            this.getLife.play();
            ig.game.lives += 1;
            this.kill();
        }
    })
})