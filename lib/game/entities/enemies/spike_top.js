/*
Spike Top
---------
*/

ig.module('game.entities.enemies.spike_top')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntitySpike_top = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/spike_top.png', 25, 26),
        size: {x: 18, y: 18},
        flip: true,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.22, [0,1]);
            this.offset.x = 3;
            this.offset.y = 1;
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
    }); // End EntitySpiketop
}); // End .defines



