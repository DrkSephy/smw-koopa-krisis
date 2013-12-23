/*
Bullet Shooter
--------------
1. Bullet Shooter is stationary. If player bumps it, it will not slide (much).
2. Shooter will only shoot Bullet Bills based on player's distance to itself
   and after a certain time.
    a. If the player is NOT near enemy, enemy will periodically shoot bullets
       horizontally from itself (default AI).
    b. If player IS near enemy, enemy will do nothing. So player does not get a
       surprise bullet in their face at point-blank range.
    c. If player is near enemy and player moves far enough away from enemy,
       enemy will reset to default AI.
    d. Enemy also has to wait a certain time before firing again. So enemy won't
       spew an endless line of bullets.
3. If player gets hit by bullet(s), player will take damage.
*/

ig.module('game.entities.enemies.bullet_shooter')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBullet_shooter = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bullet_shooter2.png', 20, 20),
        size: {x: 20, y: 20},
        maxVel: {x: 0, y: 100},
        health: 100,
        maxHealth: 100,
        
        shoot_range: 80, // range in pixels of how far player has to be for bullets to fire
        shoot_delay: 4, // seconds before firing bullet again
        shoot_random: false,
        bullet_speed: 100,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.shootTimer = new ig.Timer();
            
            if(this.shoot_random)
                this.shoot_delay = Math.random() * (this.shoot_delay*2 - this.shoot_delay*1.5) + this.shoot_delay*1.5;
        },

        update: function() {
            this.parent();
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];

            // Player is NOT nearby enemy and at least some time has passed since last bullet fired.
            if(this.distanceTo(my_player) > this.shoot_range && this.shootTimer.delta() > this.shoot_delay) {
                // Fire bullet left
                ig.game.spawnEntity(EntityBulletBill, this.pos.x - 14, this.pos.y + 2, {flip: this.flip, speed: this.bullet_speed});

                // Fire bullet right
                ig.game.spawnEntity(EntityBulletBill, this.pos.x + 30, this.pos.y + 2, {flip: !this.flip, speed: this.bullet_speed});

                this.shootTimer.set(0);
            // Reset timer to give player chance to escape if leaving detection range
            } else if(this.distanceTo(my_player) <= this.shoot_range) {
                this.shootTimer.set(0);
            }
        },

        collideWith: function(other, axis) {
        	my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            //this.parent(other, axis);
            if(other instanceof EntityPlayer) {
                // Make entity immovable
                this.vel.x = 0;
                this.pos.x = this.last.x;
                this.pos.y = this.last.y;

                if(axis == 'y' && this.pos.y > my_player.pos.y) {
                    // Fix for player sliding on top of item block
                    if(other.vel.x == 0) {
                        // Play appropriate powerup animation based on current powerup
                        if(ig.main.activePower == "EntityHammer")
                            other.currentAnim = other.anims.hammer_idle;
                        else if(ig.main.activePower == "EntityFireball")
                            other.currentAnim = other.anims.fire_idle;
                        else
                            other.currentAnim = other.anims.idle;
                    } else {
                        // Play appropriate powerup animation based on current powerup
                        if(ig.main.activePower == "EntityHammer")
                            other.currentAnim = other.anims.hammer_run;
                        else if(ig.main.activePower == "EntityFireball")
                            other.currentAnim = other.anims.fire_run;
                        else
                            other.currentAnim = other.anims.run;
                    }
                }
			}
        }
    }); // End EntityBullet_shooter

    // Bullet Bill
    EntityBulletBill = ig.Entity.extend({
        // Set up collision
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bullet_bill.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 150, y: 0},
        speed: 100,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed * xdir;
            this.anims.idle.flip.x = this.flip;
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
            other.receiveDamage(5, this);
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        }
    }); // End EntityBulletBill
}); // End .defines
