/*
Stalker.js
----------
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

ig.module('game.entities.stalker')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityStalker = ig.Entity.extend({
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
    }); // End EntityStalker
}); // End .defines