/*
Basic AI
--------
This module contains the barebones AI most enemy entities should have. It will
not contain the main AI via the update() function since those should be handled
by enemy entities themselves. This setup provides a centralized module for quickly
modifying shared AIs across all enemy entities. Enemy entities containing more
advanced AIs may be exempt from this structure (i.e., enemies with "spiky" property
may still use this basic AI module but may need to override some of its behaviors).
*/

ig.module('game.entities.ai.basic_ai')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityBasic_ai = ig.Entity.extend({
        // Set up collision
        /** Keep collision properties since they seem to be widely used and
            repeated for enemies. **/
        type: ig.Entity.TYPE.B, // TYPE.B: unfriendly group (monsters)
        checkAgainst: ig.Entity.TYPE.A, // If group B touches group A, group A is hurt
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        /** Sprites and sprite size should be handled by each enemy. **/

        // Impact built-in properties
        /** Keep maxVel and friction in case we want to globally change maximum
            speed or friction. Add more Impact built-in shared properties here
            as necessary. **/
        maxVel: {x: 500, y: 100}, // Maximum (capped) x, y speed enemy can move up to
        friction: {x: 1, y: 0}, // Enemy's x, y deceleration per second from current velocity
        
        // Custom properties
        /** Define/override the default values in each enemy. Add more custom
            shared properties here as necessary. **/
        speed: 10, // Enemy's current movement speed
        collide_damage: 1, // Default player-enemy collision damage
        kill_score: 100, // Default score gained/ when player kills an enemy
        damage_push: 50, // Default horizontal player pushback distance when colliding with enemy horizontally
        damage_jump: -50, // Default vertical player jump distance when colliding with enemy vertically
        /** Suggested NOT to uncomment next line as different enemies has
            different flips. Consider using it once all enemies' sprites are
            oriented correctly (all facing same direction). **/
        //flip: false,
        maxHealth: 10,

        /** Since enemy's health is defined in Impact's entity module as
            health=10 already, we do not need to redefine it again. If you want
            ALL entities to reflect a new default health, uncomment next line
            and change the value accordingly. Under such a case, only those
            enemies who did not specify a health value will use this one
            instead. **/
        //health: 10,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animations
            /** Animations should be handled by each enemy. **/
            this.healthTimer = new ig.Timer();
            tempHealth = this.health;
            // Load player object if not in Weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        }, // End init method

        /** Enemy's main AI. Should be handled by each enemy. **/
        //update: function() {
        //    this.parent();
        //},

        // Collisions with walls are handled through the following function.
        /** The flip part of the code is provided here. If you wish to use this
            code to handle the flip movement, be sure to also flip the enemy's
            sprite/animation in the enemy's entity. **/
        handleMovementTrace: function(res) {
            this.parent(res);

            // If the enemy collides with a wall, make them turn around.
            if(res.collision.x) {
                this.flip = !this.flip;
                this.currentAnim.flip.x = this.flip;
            }

            /* TODO: Fix issue with enemy auto-jumping when not moving on slopes.
            // ---- Begin enemy slope collision and movement fix ----
            // Only trigger if enemy is colliding with slope
            if(res.collision.slope) {
                var xdir = this.vel.x;

                // Enemy is not moving (used to override auto-sliding).
                if(xdir == 0) {
                    // Places enemy in the previous frame's position.
                    this.pos.x = this.last.x;
                    this.pos.y = this.last.y;

                    // Prevents enemy from looping "run" animation when idle on slopes.
                    //this.vel.x = 0;
                    //this.vel.y = 0;
                // Enemy is moving up/down slope.
                } else {
                    // Compute distance and speed enemy should travel on slopes.
                    //   v = v0 + a * t
                    //   x = x0 + v0 * t + (a * t^2)/2; x0 = 0
                    //     = v0 * ((v - v0)/a) + (a * ((v - v0)/a)^2)/2
                    //     = (v^2 - (v0)^2)/(2*a)
                    //   v = sqrt((v0)^2 + 2*a*x)
                    //   cos(th) = dx/sqrt(dx^2 + dy^2)
                    //   sin(th) = dy/sqrt(dx^2 + dy^2)
                    //   vx = sqrt(dx * (v0)^2 + 2*a*x) / sqrt(dx^2 + dy^2)
                    //   vy = sqrt(dy * (v0)^2 + 2*a*x) / sqrt(dx^2 + dy^2)
                    var dx, dy, hyp, vx, vy;
                    dx = res.collision.slope.x;
                    dy = res.collision.slope.y;
                    hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                    vel_slope = Math.sqrt(Math.pow(this.maxVel.x, 2) + 2 * this.speed * hyp * ig.system.tick);
                    vx = Math.abs(res.collision.slope.x * vel_slope / hyp);
                    vy = Math.abs(res.collision.slope.y * vel_slope / hyp);

                    // Enemy is moving right on a right inclined slope
                    if(xdir < 0 && dy < 0) {
                        this.vel.x = vx;
                        this.vel.y = -vy;
                    // Enemy is moving right on a right declined slope
                    //} else if(xdir < 0 && dy > 0) {
                    //    this.vel.x = vx;
                    //    this.vel.y = vy;
                    // Enemy is moving left on a left inclined slope
                    } else if(xdir > 0 && dy > 0) {
                        this.vel.x = -vx;
                        this.vel.y = -vy;
                    // Enemy is moving left on a left declined slope
                    //} else if(xdir > 0 && dy < 0) {
                    //    this.vel.x = -vx;
                    //    this.vel.y = vy;
                    }
                }
            } // ---- End enemy slope collision and movement fix ----
            */
        }, // End handleMovementTrace method

        // Collisions with player are handled through the following function.
        /** Certain enemies with advanced collisions may wish to override this
            function with their own collision handling code. **/
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                // Prevents enemy from being killed from below.
                if(axis == 'y' && this.pos.y > other.pos.y) {
                    other.vel.y = this.damage_jump;
                    this.kill();
                } else {
                    other.receiveDamage(this.collide_damage, this);
                    // Push player back if collides with enemy horizontally.
                    if(other.pos.x > this.pos.x)
                        other.vel.x = this.damage_push;
                    else
                        other.vel.x = -this.damage_push;
                }
                
                // If player's health <= 0 (player dead), re-detect player
                // entity (respawned player).
                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        }, // End collideWith method

        // Simply setting up collisions isn't enough, we must create a method
        // which will check if a collision occurs. This method overrides the
        // .check() function, which gets called when a collision is detected,
        // and applies damage to the entity it collides with.
        check: function(other, axis) {
            if(other instanceof EntityPlayer)
                if(axis == 'x')
                    other.receiveDamage(this.collide_damage, this);
        }, // End check method

         draw: function(){
             // border/background
            if((this.health < tempHealth) && this.healthTimer.delta() < 1.0){
                ig.system.context.fillStyle = "rgb(0,0,0)";
                ig.system.context.beginPath();
                ig.system.context.rect(
                                (this.pos.x - ig.game.screen.x) * ig.system.scale, 
                                (this.pos.y - ig.game.screen.y - 8) * ig.system.scale, 
                                this.size.x * ig.system.scale, 
                                4 * ig.system.scale
                            );
                ig.system.context.closePath();
                ig.system.context.fill();
                
                // health bar
                ig.system.context.fillStyle = "rgb(255,0,0)";
                ig.system.context.beginPath();
                ig.system.context.rect(
                                (this.pos.x - ig.game.screen.x + 1) * ig.system.scale, 
                                (this.pos.y - ig.game.screen.y - 7) * ig.system.scale, 
                                ((this.size.x - 2) * (this.health / this.maxHealth)) * ig.system.scale, 
                                2 * ig.system.scale
                            );
                ig.system.context.closePath();
                ig.system.context.fill();
            }
            this.parent();
        },

        // Enemy's death (and player's rewards from enemy's death) is handled
        // through the following function.
        kill: function() {
            ig.game.stats.kills++;
            ig.game.increaseScore(this.kill_score);
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
            this.parent();
        }, // End kill method

        // Enemy receiving damage is handled through the following function.
        receiveDamage: function(value) {
            this.parent(value);
            this.healthTimer.set(0);
        } // End receiveDamage
    }); // End EntityBasic_ai
}); // End .defines
