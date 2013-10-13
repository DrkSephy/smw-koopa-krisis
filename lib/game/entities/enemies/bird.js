/*
Bird
----
Has the following AI:
  1. Only flies from right to left, high in the air.
  2. As it approaches the player, it will attempt to
     drop a bomb down on the player. (Use the bomb.png
     file as the projectile) Note: bomb.png is 16x16
     pixels.
  3. When the bird gets out of the player's range
     (maybe about 100 pixels on x axis) or attempts to
     go off screen, kill the bird using this.kill()
*/

/*******************
 * Global Counters *
 *******************/
birdBombCounters = 1;

ig.module('game.entities.enemies.bird')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBird = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bird.png', 60, 30),
        size: {x: 60, y: 30},
        maxVel: {x: 100, y: 0},
        flip: true,
        speed: 35,
        health: 30,
        gravityFactor: 0,

        // Initialize Entity
        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animations
            this.addAnim('fly', 0.25, [0,1,2,3]);
            //this.offset.x = 6;
            //this.offset.y = 2;
        },

        update: function() {
            // Flipping x velocity
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();

            // Player is to the left of Bird
            if(this.distanceTo(my_player) < 130 && this.distanceTo(my_player) > 0) {

                if(birdBombCounters > 0) {
                    ig.game.spawnEntity(EntityBirdBomb, this.pos.x+20, this.pos.y+20);
                    birdBombCounters--;
                }

                // Monster to the left of player
                if(this.pos.x - my_player.pos.x  > 5 && my_player.vel.x > 0) {
                    this.flip = true;
                    this.anims.fly.flip.x = false;
                }

                // Monster to the right of player
                else if(this.pos.x - my_player.pos.x  < 5) {
                    this.flip = false;
                    this.anims.fly.flip.x = true;
                }
            }

            // Player is to the right of Bird
            else if(this.distanceTo(my_player) > -130 && this.distanceTo(my_player) < 0) {
                if(birdBombCounters > 0) {
                    ig.game.spawnEntity(EntityBirdBomb, this.pos.x+20, this.pos.y+20);
                    birdBombCounters--;
                }

                // Monster to the right of player
                if(this.pos.x - my_player.pos.x  < 5) {
                    this.flip = false;
                    this.anims.fly.flip.x = true;
                }

                // Monster to the right of player
                else if(this.pos.x - my_player.pos.x  < 5) {
                    this.flip = false;
                    this.anims.fly.flip.x = true;
                }
            }
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.fly.flip.x = !this.flip;
        }
    }); // End EntityBird

    // Bird Bomb
    EntityBirdBomb = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: 0, y: -1},
        animSheet: new ig.AnimationSheet('media/enemies/bomb.png', 16, 16),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 0, y: 100},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.vel.x = 0;
            this.vel.y = -50;
            this.accel.y = 20;
            this.addAnim('idle', 1, [0]);
            // Add Sound here
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.y) {
                birdBombCounters++;
                this.kill();
            }
        },

        check: function(other) {
            other.receiveDamage(10, this);
            birdBombCounters++;
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        }
    }); // End EntityBirdBomb
}); // End .defines
