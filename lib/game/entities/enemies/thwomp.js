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
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityThwomp = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/thwomp.png', 32, 32),
        size: {x: 32, y: 32},
        maxVel: {x: 0, y: 150},
        //flip: false,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0]);
            this.addAnim('ready', 0.1, [1]);
            this.addAnim('fall', 0.1, [2]);
            this.wtimer = new ig.Timer();
            this.gravityFactor = -40;
        },

        update: function() {
            var target_x, target_y, prep, distance;
            //var randNum = Math.floor(Math.random()) < 0.5? 4 : 6;
			var my_player = ig.game.getEntitiesByType(EntityPlayer)[0];
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
                this.wtimer.reset(0);
            } else if (this.prep && distance <= 109 && this.wtimer.delta() <= 4) {	
                    //thwomp falls
                    this.vel.y = 150;
                    this.gravityFactor = 40;
                    this.currentAnim = this.anims.fall;
            }

            this.parent();
            this.gravityFactor= -40;
        },

        // Override basic AI
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
        }
    }); // End EntityThwomp
}); // End .defines
