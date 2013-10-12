/*
Hammer_Bros.js
--------------
1. Enemy has basic left/right movement.
2. Enemy will periodically shoot hammers in front of itself.
*/

ig.module('game.entities.enemies.hammer_bros')
.requires('game.entities.ai.basic_ai',
          'game.entities.miscellaneous.hammer')

.defines(function() {
    EntityHammer_bros = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/hammer_bros.png', 16, 16),
        size: {x: 16, y: 16},
        //flip: true,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.3, [0]);
            this.throwTimer = new ig.Timer();
        },

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();

            // At least some time has passed since last hammer thrown.
            if(this.throwTimer.delta() > 6) {
                // Throw first hammer
                ig.game.spawnEntity(EntityHammer, this.pos.x, this.pos.y, {checkAgainst: ig.Entity.TYPE.A,
                                                                           collides: ig.Entity.COLLIDES.PASSIVE,
                                                                           flip: !this.flip,
                                                                           bounciness: 0,
                                                                           arc_distance: 80,
                                                                           arc_height: 180});
                // Throw second hammer
                ig.game.spawnEntity(EntityHammer, this.pos.x, this.pos.y, {checkAgainst: ig.Entity.TYPE.A,
                                                                           collides: ig.Entity.COLLIDES.PASSIVE,
                                                                           flip: !this.flip,
                                                                           bounciness: 0,
                                                                           arc_distance: 60,
                                                                           arc_height: 200});
                this.throwTimer.set(0);
            }
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.crawl.flip.x = this.flip;
        }
    }); // End EntityHammer_bros
}); // End .defines
