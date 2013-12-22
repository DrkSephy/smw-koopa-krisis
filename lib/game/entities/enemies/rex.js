/*
Rex
---
This enemy currently has the following AI:
    1. Moves from right to left, on collision
       with a wall, it flips and walks in the
       opposite direction.
*/

ig.module('game.entities.enemies.rex')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityRex = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/rex.png', 25, 38),
        size: {x: 25, y: 35},
        //flip: true,
        //health: 10,
        stomp: new ig.Sound('media/sounds/sfx/smw_stomp.*'),

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.22, [0,1]);
            this.offset.x = 0;
            //this.offset.y = 1;
        },

        

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();
        }
    }); // End EntityRex
}); // End .defines
