/*
Bony_Beetle_New.js
------------------
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

            // Load player object if not in weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {
            this.parent();
            
            // Normal/default state: Enemy moves left/right.
            if(this.state == 'normal') {
                this.currentAnim = this.anims.crawl;
                var xdir = this.flip ? 1 : -1;
                this.vel.x = this.speed * xdir;
                
                // Player near enemy --> Enemy enters spiky state
                if(this.distanceTo(my_player) < 50) {
                    this.state = 'spiky';
                    this.animTimer.set(0);
                }
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
                if(this.animTimer.delta() > 6) {
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
        
        receiveDamage: function(value) {
            this.parent(value);
        }, // End receiveDamage
    }); // End EntityBony_beetle_new
}); // End .defines
