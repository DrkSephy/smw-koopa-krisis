/*
Bony Beetle (New)
-----------------
1. Enemy has basic left/right movement (Default AI).
2. If player is near enemy, enemy will enter spiky state.
     a. In spiky state, if the player jumps on enemy, player takes damage.
     b. Enemy will revert back to default AI after some time has passed
        regardless if player is near enemy or not.
3. If the player jumps on enemy when enemy is NOT in spiky state, enemy will
   enter collapse state (a pile of bones).
     a. Enemy will uncollapse (regenerate) and revert back to default AI after
        some time has passed regardless if player is near enemy or not.
     b. Enemy cannot be killed from player jumping on top of it. Its
        replacement for death by this means is its collapse state.
*/

ig.module('game.entities.enemies.bony_beetle_new')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBony_beetle_new = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bony_beetle_new.png', 24, 24),
        size: {x: 24, y: 24},
        offset: {x: 0, y: -2},
        //flip: true,
        //health: 10,
        state: 'normal', // state = {normal, collapse, spiky}

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.3, [2,3]);
            this.addAnim('collapse', 1, [4,5], true);
            this.addAnim('uncollapse', 1, [5,4], true);
            this.addAnim('spiky', 1, [1,0], true);
            this.addAnim('unspiky', 1, [0,1], true);
            this.animTimer = new ig.Timer();
            var playerNear = false;
        },

        update: function() {
            this.parent();

            // Normal/default state: Enemy moves left/right.
            if(this.state == 'normal') {
                var xdir = this.flip ? 1 : -1;
                this.vel.x = this.speed * xdir;
                this.currentAnim = this.anims.crawl;

                // Player near enemy --> Enemy enters spiky state
                if(this.distanceTo(my_player) < 60 && !playerNear) {
                    playerNear = true;
                    this.state = 'spiky';
                    this.animTimer.set(0);
                } else if(this.distanceTo(my_player) >= 60)
                    playerNear = false;
            // Spiky state: Enemy stops moving and hides in shell.
            } else if(this.state == 'spiky') {
                this.currentAnim = this.anims.spiky;
                this.vel.x = 0;

                // Waits a certain time before unhiding and returning to normal state.
                if(this.animTimer.delta() > 6) {
                    this.currentAnim = this.anims.unspiky;
                    this.state = 'normal';
                }
            // Collapse state: Enemy collapses when player "kills" it.
            } else if(this.state == 'collapse') {
                this.currentAnim = this.anims.collapse;
                this.vel.x = 0;

                // Waits a certain time before uncollapsing and returning to normal state.
                if(this.animTimer.delta() > 10) {
                    this.currentAnim = this.anims.uncollapse;
                    this.state = 'normal';
                }
            }
        },

        // Override basic AI
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                if(axis == 'y' && other.falling && this.state != 'spiky') {
                    this.state = 'collapse';
                    this.animTimer.set(0);
                    //ig.game.score += 1;
                } else {
                    // If player falls on enemy while enemy is in spiky state,
                    //   damage player and make player bounce up a bit. This is to
                    //   prevent player from being spammed with damage (potentially
                    //   killing player VERY quickly) while standing on enemy.
                    if(axis == 'y')
                        other.vel.y = -100;

                    // Push player back if collides with enemy horizontally.
                    if(other.pos.x > this.pos.x)
                        other.vel.x = this.damage_push;
                    else
                        other.vel.x = -this.damage_push;

                    other.receiveDamage(1, this);
                }

                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        }
    }); // End EntityBony_beetle_new
}); // End .defines
