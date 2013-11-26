/*
Iggy Koopa
-----------------
*/

ig.module('game.entities.enemies.iggy_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityIggy_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/iggy_koopa_full.png', 32, 32),
        size: {x: 32, y: 32},
        offset: {x: 0, y: -2},
        //flip: true,
        //health: 10,
        stalk_check_dist: {x: 80, y: 35}, // x, y distance enemy will detect player at
        stalk_chase_dist: {x: 150, y: 60}, // x, y distance enemy will chase player at
        inShell: false,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.3, [0,1]);
            this.addAnim('attack', 0.3, [2,3,4,5,6,7,8,9]);
            this.addAnim('shell', 0.3, [10,11,12,13,14,15], true);
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
        },

        // Override basic AI
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                //if(axis == 'y' && other.falling && this.state != 'spiky') {
                if(axis == 'y' && other.falling) {
                    //this.state = 'collapse';
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
    }); // End EntityIggy_koopa

    // Iggy Koopa's Ring Attack Projectile
    EntityRing = ig.Entity.extend({
        // Set up collision
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/attack.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 100, y: 100},
        speed: {x: 0, y: 0},
        gravityFactor: 0,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);

            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed.x * xdir;
            this.vel.y = this.speed.y;
            this.anims.idle.flip.x = this.flip;

            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            this.parent();

            // Clean up: Auto-kill this entity if too far from player to prevent having too many entities on screen
            if(this.distanceTo(my_player) > ig.system.width)
                this.kill();
        },

        // Override entity's collision against walls so it can pass through them.
        handleMovementTrace: function(res) {
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        },

        // Check if collision occurs. If yes, damage player and destroy this entity.
        check: function(other) {
            other.receiveDamage(10, this);
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        }
    }); // End EntityRing
}); // End .defines
