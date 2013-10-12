/*
Paragoomba
----------
*/

ig.module('game.entities.enemies.paragoomba')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityParagoomba = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/para-goomba.png', 32, 32),
        size: {x: 25, y: 25},
        //flip: true,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.30, [0,1,2,3] );
            this.offset.x = 3;
            this.offset.y = 2;
        },

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.crawl.flip.x = this.flip;
        }
    }); // End EntityParagoomba
}); // End .defines
