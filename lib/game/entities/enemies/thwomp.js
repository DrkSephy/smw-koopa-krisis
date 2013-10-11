/*
Thwomp
------
Has the following AI:
  1. Calculates the player's distance relative to itself.
     Plays the animation frame [0] initially.
  2. If player is getting closer, it's animation frame
     will be [1].
  3. If player is a few pixels from it (very close to the
     thwomp), it will fall downwards towards the player.
     The animation frame for the falling animation is [2].
     To detect the ground, just check for a collision on the
     y-axis.
  4. It goes back up to it's starting position after X amount
     of seconds (maybe 1 or 2, choose whatever feels right to you).
     As it is going back up, play animation frame [0].
*/

ig.module('game.entities.enemies.thwomp')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityThwomp = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/thwomp.png', 32, 32),
        size: {x: 32, y: 32},
        maxVel: {x: 500, y: 100},
        //flip: false,
        friction: {x: 1, y: 0},
        speed: 10,
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0]);
            this.addAnim('ready', 0.1, [1]);
            this.addAnim('fall', 0.1, [2] );
            this.timer = new ig.Timer();
            this.gravityFactor = -40;

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            var target_x, target_y;
            var prep;
            var distance;
            //var randNum = Math.floor(Math.random()) < 0.5? 4 : 6;

            target_x = my_player.pos.x;
            target_y = my_player.pos.y;

            //distance between the player and thwomp
            distance = Math.abs(target_x - this.pos.x);

            if (this.prep && distance > 185) {
                this.gravityFactor = -40;
                this.currentAnim = this.anims.idle;
                this.prep = false;
            } else if(!this.prep && distance <= 185 && distance >= 110) {	
                //getting ready to fall
                this.gravityFactor = -40;
                this.currentAnim = this.anims.ready;
                this.prep = true;
                this.timer.reset(0);
            } else if (this.prep && distance <= 109 && this.timer.delta() <= 4) {	
                    //thwomp falls
                    this.vel.y = 1000;
                    this.gravityFactor = 40;
                    this.currentAnim = this.anims.fall;
            }

            this.parent();
            this.gravityFactor= -40;
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
            }
        },

        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                this.vel.x = 0;
                other.receiveDamage(1, this);
                // Push player back if collides with enemy.
                if(other.pos.x > this.pos.x)
                    other.vel.x = 50;
                else
                    other.vel.x = -50;

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
    }); // End EntityThwomp
}); // End .defines
