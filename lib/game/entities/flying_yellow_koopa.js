/*
Flying_Yellow_Koopa.js
----------------------
*/

ig.module('game.entities.flying_yellow_koopa')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityFlying_yellow_koopa = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_yellow.png', 32, 32),
        size: {x: 19, y: 29},
        maxVel: {x: 500, y: 100},
        //flip: true,
        friction: {x: 1, y: 0},
        speed: 10,
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.30, [2, 3]);
            this.offset.x = 5;
            //this.offset.y = 1;
            //this.anims.crawl.flip.x = false;
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();

            if(player != null) {
                var target_x = 0;
                var target_y = 0;
                target_x = player.pos.x;
                target_y = player.pos.y;
                var stalking = false;

                // Player is within enemy's potential detection range but has not detected player yet
                if(!this.stalking && Math.abs(target_x - this.pos.x) <= 64 && Math.abs(target_y - this.pos.y) <= 32) {
                    // Player in enemy's line-of-sight --> Begin stalking behavior
                    if((target_x < this.pos.x && this.flip) || (target_x > this.pos.x && !this.flip))
                        this.stalking = true;
                // Enemy has detected player --> Begin stalking behavior; Extend detection/stalking range
                } else if(this.stalking && Math.abs(target_x - this.pos.x) <= 128 && Math.abs(target_y - this.pos.y) <= 64) {
                    // Player is behind enemy --> Enemy faces player
                    if((target_x > this.pos.x && this.flip) || (target_x < this.pos.x && !this.flip)) {
                        this.flip = !this.flip;
                        this.anims.crawl.flip.x = this.flip;
                    }
                // Player stepped outside of detection distance --> Reset behavior (do not stalk)
                } else
                    this.stalking = false;
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
        check: function(other) {
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
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
        }, // End receiveDamage
    }); // End EntityFlying_yellow_koopa
}); // End .defines
