/*
Jumping Ninji
-------------
*/

ig.module('game.entities.enemies.jumping_ninji'
)
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityJumping_ninji = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/ninji.png', 25, 26),
        size: {x: 19, y: 17},
        maxVel: {x: 500, y: 100},
        flip: false,
        friction: {x: 1, y: 0},
        speed: 8,
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('stand', 0.10, [0] );
            this.addAnim('jump', 0.15, [1]);
            this.offset.x = 3;
            this.offset.y = 1;
            //this.offset.y = 5;
            //this.anims.crawl.flip.x = false;
            this.jumptimer = new ig.Timer(); // timer for 3 seconds

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var xdir = this.flip ? -1 : 1;
            var randNum = Math.random() < 0.5? 100 : 139.1;

            if(this.standing && this.jumptimer.delta()) {
                // Jump action
                if(this.pos.y = randNum)
                {
                    this.vel.y = -7000;
                    this.currentAnim = this.anims.jump;
                    this.jumptimer.set(0);
                }
            }
            this.parent();
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
                this.anims.crawl.flip.x = !this.flip;
                this.gravityFactor = 3;
            }
        },

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
    }); // End Flying Yellow Koopa
}); // End .defines
