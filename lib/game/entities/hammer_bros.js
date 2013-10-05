/*
Hammer_Bros.js
--------------
1. Enemy has basic left/right movement.
2. Enemy will periodically shoot hammers in front of itself.
*/

ig.module('game.entities.hammer_bros')
.requires('impact.entity',
          'game.entities.player',
          'game.entities.hammer')

.defines(function() {
    EntityHammer_bros = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/hammer_bros.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 500, y: 100},
        //flip: true,
        friction: {x: 1, y: 0},
        speed: 10,
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.3, [0]);
            this.throwTimer = new ig.Timer();

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();

            // At least some time has passed since last hammer thrown.
            if(this.throwTimer.delta() > 4) {
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

        /*
        Collisions with walls are handled through the following function.
        If a monster runs into a wall, make them turn around.
        */
        handleMovementTrace: function(res) {

           this.parent(res);
            // If the enemy collides with a wall, return
            if(res.collision.x) {
                console.log(this.flip);
                this.flip = !this.flip;
                this.anims.crawl.flip.x = this.flip;
            }
        },

        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                if(axis == 'y' && other.falling) {
                    this.kill();
                    //ig.game.score += 1;
                } else
                    other.receiveDamage(1, this);

                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        },

        /*
        Simply setting up collisions isn't enough, we must create a method
        which will check if a collision occurs. This method overrides the
        .check() function, which gets called when a collision is detected,
        and applies damage to the entity it collides with.
        */
        check: function(other, axis) {
        if(other instanceof EntityPlayer)
            if(axis == 'x')
                other.receiveDamage(1, this);
        },

        kill: function() {
            ig.game.stats.kills++;
            ig.game.increaseScore(100);
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset: 1});
            this.parent();
        }, // End Kill method

        receiveDamage: function(value) {
            this.parent(value);
        }, // End receiveDamage
    }); // End EntityHammer_bros
}); // End .defines
