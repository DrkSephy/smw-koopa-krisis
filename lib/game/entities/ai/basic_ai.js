/*
Basic AI
--------
This module contains the barebones AI most enemy entities should have. It will
not contain the main AI via the update() function since those should be handled
by other individual AI modules. This allows quick swapping of main AIs for each
enemy entity while maintaining a centralized module for quickly modifying
shared AIs across all enemy entities. Enemy entities containing more advanced
AIs may be exempt from this structure (i.e., enemies with "spiky" property may
still use this basic AI module but may need to override some of its behaviors).
*/

ig.module('game.entities.ai.basic_ai')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityBasic_ai = ig.Entity.extend({
        // Set up collision
        // ** Keep collision properties since they seem to be widely used and
        //    repeated for enemies.
        type: ig.Entity.TYPE.B, // TYPE.B: unfriendly group (monsters)
        checkAgainst: ig.Entity.TYPE.A, // If group B touches group A, group A is hurt
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        // ** Sprites and sprite size should be handled by each enemy.

        // ** Keep maxVel and friction in case we want to globally change max speed,
        //    current speed, or friction. Add more shared properties here as necessary.
        maxVel: {x: 500, y: 100},
        friction: {x: 1, y: 0},
        speed: 10,

        // ** Suggested not to use flip in basic AI as each enemy has a unique flip.
        //    Consider using flip once all enemies' sprites are oriented correctly.
        //flip: false,

        // ** Since health is defined in Impact's entity module as health=10 already,
        //    we do not need to redefine it again. If you want ALL entities to reflect
        //    a new default health, uncomment next line and change the value.
        //health: 10,
        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animations
            // ** Animations should be handled by each enemy.
            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        }, // End init method

        // ** Contains main AI for enemies. Should be handled by each enemy.
        //update: function() { this.parent(); },

        // Collisions with walls are handled through the following function.
        handleMovementTrace: function(res) {
            this.parent(res);
            // If the enemy collides with a wall, make them turn around.
            if(res.collision.x)
                this.flip = !this.flip;
        }, // End handleMovementTrace method

        // Collisions with player are handled through the following function.
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                // Prevents enemy from being killed from below.
                if(axis == 'y' && this.pos.y >= my_player.pos.y) {
                    this.kill();
                    //ig.game.score += 1;
                } else {
                    other.receiveDamage(1, this);
                    // Push player back if collides with enemy.
                    if(other.pos.x > this.pos.x)
                        other.vel.x = 50;
                    else
                        other.vel.x = -50;
                }

                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        }, // End collideWith method

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
        }, // End check method

        kill: function() {
            ig.game.stats.kills ++;
            ig.game.increaseScore(100);
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
            this.parent();
        }, // End kill method

        receiveDamage: function(value) {
            this.parent(value);
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
        } // End receiveDamage
    }); // End EntityBasic_ai
}); // End .defines
