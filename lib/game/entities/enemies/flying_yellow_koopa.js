/*
Flying Yellow Koopa
-------------------
1. If player is near enemy but NOT in enemy's line-of-sight (LoS), enemy
   ignores player and uses default AI.
     a. Enemy's LoS is a rectangular field-of-view directly in front of itself.
2. If player is near enemy AND is in enemy's LoS, enemy begins following player
   and extends its detection range.
     a. If enemy is following player and player moves behind enemy, enemy faces
        player and continues to follow.
3. If enemy is following player and player steps out of enemy's detection
   range, enemy stops following player and resets to default AI.
*/

ig.module('game.entities.enemies.flying_yellow_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityFlying_yellow_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_yellow.png', 32, 32),
        size: {x: 19, y: 29},
        flip: true,
        //health: 10,
        
        stalk_check_dist: {x: 80, y: 35}, // x, y distance enemy will detect player at
        stalk_chase_dist: {x: 150, y: 60}, // x, y distance enemy will chase player at

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.30, [2, 3]);
            this.offset.x = 5;
            //this.offset.y = 1;
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            // If the enemy collides with a wall, make them turn around.
            if(res.collision.x) {
                this.flip = this.flip;
                this.currentAnim.flip.x = !this.flip;
            }
        },

        update: function() {
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.parent();

            if(my_player != null) {
                var target_x = 0;
                var target_y = 0;
                target_x = my_player.pos.x;
                target_y = my_player.pos.y;
                var stalking = false;

                // Player is within enemy's potential detection range but has not detected player yet
                if(!this.stalking && Math.abs(target_x - this.pos.x) <= this.stalk_check_dist.x && Math.abs(target_y - this.pos.y) <= this.stalk_check_dist.y) {
                    // Player in enemy's line-of-sight --> Begin stalking behavior
                    if((target_x > this.pos.x && this.flip) || (target_x < this.pos.x && !this.flip))
                        this.stalking = true;
                // Enemy has detected player --> Begin stalking behavior; Extend detection/stalking range
                } else if(this.stalking && Math.abs(target_x - this.pos.x) <= this.stalk_chase_dist.x && Math.abs(target_y - this.pos.y) <= this.stalk_chase_dist.y) {
                    // Player is behind enemy --> Enemy faces player
                    if((target_x < this.pos.x && this.flip) || (target_x > this.pos.x && !this.flip)) {
                        this.flip = !this.flip;
                        this.anims.crawl.flip.x = !this.flip;
                    }
                // Player stepped outside of detection distance --> Reset behavior (do not stalk)
                } else
                    this.stalking = false;
            }
        }
    }); // End EntityFlying_yellow_koopa
}); // End .defines
