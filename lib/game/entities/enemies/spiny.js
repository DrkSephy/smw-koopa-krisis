/*
Spiny
-----
This enemy currently has the following AI:

    1. Moves from right to left, on collision
       with a wall, it flips and walks in the
       opposite direction.
    2. Currently, if jumped on by the player,
       it will die. (bad)

The actual AI for this enemy should be as follows:
   1. Still moves from right to left as before.
   2. If jumped on, the player entity should
      take damage, since this enemy is spiky.

To implement the new changes, we can possibly set up
a new property in ig.Entity.extend({ }) called
spiky: true, and in the onCollision() method, if
the player collides on the x-axis with the Spiny,
deal damage to the player and knock him back.
*/

ig.module('game.entities.enemies.spiny')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntitySpiny = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/spiny.png', 25, 26),
        size: {x: 22, y: 18},
        flip: false,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.22, [0,1]);
            this.offset.x = 2;
            this.offset.y = 1;
        },

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
           this.parent(res);
            if(res.collision.x) {
                this.anims.crawl.flip.x = this.flip;
            }
        }
    }); // End EntitySpiny
}); // End .defines
