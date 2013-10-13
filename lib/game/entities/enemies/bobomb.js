/*
Bob-omb
-------
Simply moves in one direction (for now).
*/

ig.module('game.entities.enemies.bobomb')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBobomb = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bob-omb.png', 25, 26),
        size: {x: 15, y: 16},
        flip: true,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.20, [0,1]);
            this.offset.x = 5;
            this.offset.y = 2;
        },

        update: function() {
            if(!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? + 4 : this.size.x - 4),
                                             this.pos.y + this.size.y + 1)) {
                this.flip = !this.flip;
                this.currentAnim.flip.x = !this.flip;
            }
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.crawl.flip.x = !this.flip;
        }
    }); // End EntityBobomb
}); // End .defines
