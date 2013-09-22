ig.module('game.entities.stalker')

.defines(function(){
    EntityStalker = ig.Entity.extend({

     update: function() {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        var xdir = this.flip ? -1 : 1;
        var stalking = false;
        var target_x = 0;
        var target_y = 0;
        target_x = player.pos.x;
        target_y = player.pos.y;
        
        // Player is within enemy's potential detection threshold (rectangular field-of-view) and not stalking player
        if(!this.stalking && Math.abs(target_x - this.pos.x) <= 64 && Math.abs(target_y - this.pos.y) <= 32) {
            // Player in enemy's line-of-sight --> Begin stalking behavior
            if((target_x < this.pos.x && this.flip) || (target_x > this.pos.x && !this.flip))
                this.stalking = true;
        // Enemy has detected player --> Begin stalking behavior; Extend detection/stalking threshold
        } else if(this.stalking && Math.abs(target_x - this.pos.x) <= 128 && Math.abs(target_y - this.pos.y) <= 64) {
            // Player is behind enemy --> Enemy faces player
            if((target_x > this.pos.x && this.flip) || (target_x < this.pos.x && !this.flip)) {
                this.flip = !this.flip;
                this.anims.crawl.flip.x = this.flip;
            }
        // Player stepped outside of detection distance --> Reset behavior (do not stalk)
        } else
            this.stalking = false;
        
        this.vel.x = this.speed * xdir;
        this.parent();
    },

  });

});

