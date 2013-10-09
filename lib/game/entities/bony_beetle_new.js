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

ig.module('game.entities.bony_beetle_new')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityBony_beetle_new = ig.Entity.extend({
        // Set up collision
        // TYPE.B: unfriendly group (monsters)
        type: ig.Entity.TYPE.B,

        // If group B touches group A, group A is hurt
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bony_beetle_new.png', 30, 30),
        size: {x: 30, y: 30},
        maxVel: {x: 500, y: 100},
        offset: {x: 0, y: -2},
        //flip: true,
        friction: {x: 1, y: 0},
        speed: 10,
        health: 10,
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

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
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

        /*
        Collisions with walls are handled through the following function.
        If a monster runs into a wall, make them turn around.
        */
        handleMovementTrace: function(res) {
            this.parent(res);
            // If the enemy collides with a wall, return
            if(res.collision.x) {
                console.log(this.flip);
                this.flip = !this.flip;
                this.anims.crawl.flip.x = this.flip;
            }
        },

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
                    other.receiveDamage(1, this);
                    other.vel.y = -100;
                }
                
                if(other.health <= 0)
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
        
        receiveDamage: function(value) {
            this.parent(value);
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
        } // End receiveDamage
    }); // End EntityBony_beetle_new
}); // End .defines
