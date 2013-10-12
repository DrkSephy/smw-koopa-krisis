/**************
 * Entity Boo *
 **************
 * AI:
 * - Moves left, right, up, down (floats)
 * - Stalks player if facing away
 * - Goes to idle if player is facing Boo
 *
 * Special Properties:
 * - Unaffected by Player projectiles
 * - Can't be killed
 *
 */

ig.module('game.entities.enemies.boo')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBoo = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/boo.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 10, y: 10},
        flip: true,
        health: 100,
        gravityFactor: 0,
        //kill_score: 9001,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('stalk', 0.25, [1]);
            this.addAnim('idle', 0.25, [0]);
        },

        // Called on every frame
        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();

            // Player facing boo, infront boo -> idle
            if(my_player.flip == this.flip) {
                this.currentAnim = this.anims.idle;
                this.speed = 0;
                this.vel.y = 0;
            }

            // Player facing left, behind boo-> Stalk
            else if(my_player.flip != this.flip) {
                this.currentAnim = this.anims.stalk;
                this.speed = 10;

                // Move up if player is above Boo
                if(this.pos.y < my_player.pos.y)
                    this.vel.y = 10;

                // Move down if player is below Boo
                else if(this.pos.y > my_player.pos.y)
                    this.vel.y = -10;
            }

            // Make Boo change direction to follow player
            if(this.distanceTo(my_player) < 200 && this.distanceTo(my_player) > 0) {
                // Monster to the left of player
                if(this.pos.x - my_player.pos.x  > 5 && !my_player.standing) {
                    this.flip = true;
                    this.anims.stalk.flip.x = false;
                    this.anims.idle.flip.x = false;
                }

                // Monster to the right of player
                else if(this.pos.x - my_player.pos.x  < 5) {
                    this.flip = false;
                    this.anims.stalk.flip.x = true;
                    this.anims.idle.flip.x = true;
                }
            }
        },

        // Overide basic AI
        collideWith: function(other, axis) {
            if(other instanceof EntityPlayer) {
                other.receiveDamage(1, this);

                if(other.pos.x > this.pos.x)
                    other.vel.x = 50;
                else
                    other.vel.x = -50;

                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        }
    }); // End EntityBoo
}); // End .defines
