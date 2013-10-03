/*
Bullet_Shooter.js
-----------------
1. Enemy does not move. It will only shoots bullets based on player's distance
   to itself.
2. If the player is NOT near enemy, enemy will periodically shoot bullets
   horizontally from itself (default AI).
     a. Player hit by bullet(s) will take damage.
3. If the player is near enemy, enemy will NOT shoot any bullets.
4. If player is near enemy and player moves far enough away from enemy, enemy
   will reset to default AI.
*/

ig.module('game.entities.bullet_shooter')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityBullet_shooter = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bullet_shooter.png', 32, 32),
        size: {x: 30, y: 31},
        maxVel: {x: 0, y: 100},
        health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.jumpTimer = new ig.Timer();

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            this.parent();

            /*
            Player is NOT nearby enemy and at least some time has passed since
            last bullet fired (so enemy won't spew an endless line of bullets).
            */
            if(this.distanceTo(my_player) > 40 && this.jumpTimer.delta() > 5) {
                ig.game.spawnEntity(EntityBulletBill, this.pos.x - 12, this.pos.y + 8);
                this.jumpTimer.set(0);
            }
        },

        /*
        Collisions with walls are handled through the following function.
        If a monster runs into a wall, make them turn around.
        */
        handleMovementTrace: function(res) {
            this.parent(res);
            // If the enemy collides with a wall, return
            if(res.collision.x) {
                this.flip = !this.flip;
                this.anims.fly.flip.x = !this.flip;
            }
        },

        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                if(axis == 'y' && other.falling) {
                    this.kill();
                    //ig.game.score += 1;
                } else
                    other.receiveDamage(1, this);

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
            ig.game.stats.kills++;
            ig.game.increaseScore(100);
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset: 1});
            this.parent();
        }, // End Kill method

        receiveDamage: function(value) {
            this.parent(value);
        }, // End receiveDamage
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
        maxVel: {x: -100, y: 0},

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
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
        },
    }); // End EntityBulletBill
}); // End .defines
