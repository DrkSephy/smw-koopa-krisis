/*
Buzzy Beetle
------------
Simply moves in one direction (for now).
*/

ig.module('game.entities.enemies.buzzy_beetle')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBuzzy_beetle = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/buzzy_beetle.png', 25, 26),
        size: {x: 22, y: 19},
        flip: true,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.20, [0,1]);
            this.offset.x = 1;
            this.offset.y = 1;
        },

        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x) {
                this.anims.crawl.flip.x = !this.flip;
            }
        },
    }); // End EntityBuzzy_beetle
}); // End .defines
