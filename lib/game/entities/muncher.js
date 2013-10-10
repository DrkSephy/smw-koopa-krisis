/*
Muncher
-------
Classic Mario enemy that does not
take damage when jumped on. Damages
the player on collision.
*/

ig.module('game.entities.muncher')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityMuncher = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/muncher.png', 25, 26),
        size: {x: 25, y: 19},
        maxVel: {x: -10, y: 0},
        flip: true,
        friction: {x: 1000, y: 0},
        speed: 0,
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.20, [0,1]);
            this.offset.x = 0;
            this.offset.y = 1;
            //this.anims.crawl.flip.x = false;

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            //var xdir = this.flip ? -1 : 1;
            //this.vel.x = this.speed * xdir;
            this.parent();
        },

        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                // Prevents enemy from being killed from below.
                if(axis == 'y' && this.pos.y >= my_player.pos.y) {
                    other.receiveDamage(1, this);
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
            ig.game.stats.kills ++;
            ig.game.increaseScore(100);
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
            this.parent();
        }, // End Kill method

        receiveDamage: function(value) {
            this.parent(value);
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
        } // End receiveDamage
    }); // End EntitySpiketop
}); // End .defines
