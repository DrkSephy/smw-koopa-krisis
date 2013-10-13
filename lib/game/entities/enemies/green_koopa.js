/*
Green Koopa
-----------
*/

ig.module('game.entities.enemies.green_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityGreen_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_green.png', 32, 32),
        size: {x: 18, y: 29},
        //flip: false,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.30, [0,1]);
            this.offset.x = 6;
            this.offset.y = 2;
        },

        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.crawl.flip.x = this.flip;
        }
    }); // End Greenkoopa
}); // End .defines
