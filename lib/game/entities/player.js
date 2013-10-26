/*
Player.js
---------
This file contains the code for our player entity. An entity is any object
which exists in the level but are not a part of the map. The player class
extends the main entity.js class.
*/

// Create basic structure of an entity
ig.module('game.entities.player')
.requires('impact.entity',
          'impact.sound',
          'game.entities.miscellaneous.fireball',
          'game.entities.miscellaneous.hammer',
          'game.entities.miscellaneous.playerdeathanimation',
          'game.entities.miscellaneous.DeathExplosionParticle',
          'plugins.camera.camera')

.defines(function() {
    EntityPlayer = ig.Entity.extend({
        name: "player",
        // On respawn, the player gets a brief invincibility period
        // Set up invincibility properties
        startPosition: null,
        invincible: true,
        invincibleDelay: 1,
        invincibleTimer: null,

        lifetime: 0,

        /* Add Sound effect files
           The asterisk (*) denotes that the ig.SoundManager
           Module will automatically detect which music format
           is required for the browser. */
        jumpSFX: new ig.Sound('media/sounds/sfx/mario_jump.*'),
        shootSFX: new ig.Sound('media/sounds/sfx/throw_fireball.*'),
        deathSFX: new ig.Sound('media/sounds/sfx/death.*'),
        losePowerSFX: new ig.Sound('media/sounds/sfx/lose_powerup.*'),

        // Load power-up images
        fireball: new ig.Image('media/fire_flower.png'),
        hammer_suit: new ig.Image('media/hammer_suit.png'),
        border: new ig.Image('media/hud/border.png'),

        // Make player not invisble on new level load
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0,0, 0.7)',

        // Type.A collision is for our character (friendly group)
        type: ig.Entity.TYPE.A,

        // checkAgainst: set this to group B to damage an enemy
        //               when run against/jumped on. Important for
        //               Mario-esque games.
        checkAgainst: ig.Entity.TYPE.NONE,

        // If our character bumps into a wall, don't move the player
        collides: ig.Entity.COLLIDES.ACTIVE,

        // Set up an animation sheet
        // Points to input file, sets tiles to 16 x 16 pixels
        animSheet: new ig.AnimationSheet('media/marios.png', 16, 28),
        //Attempt to fix slope collision

        // Set up size object of player
        size: {x: 16, y: 28},

        // Set up offset object of player
        // Offset: Tells the animation engine where to render
        //         the player sprite inside the bounding box
        offset: {x: 1, y: 0 },
        flip: true,

        // Define physics objects of player
        maxVel: {x: 100, y: 150},
        friction: {x: 500, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,

        // Keep track of powerup
        activePower: null,
        health: 10,

        // Create an init() method for the player class
        init: function(x, y, settings) {
        // New Animation setup based on weapon as an offset
        // By taking the weapon Id (is the offset), we multiply
        // it by the total number of player frames with a weapon,
        // add it to each animation.

            // Pass parent init method, passes starting x, y positions
            this.startPosition = {x:x, y:y};
            //this.setupAnimation(this.weapon);
            this.parent(x, y, settings);
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();

            //  Old Animation setup
            this.addAnim('idle', 1, [1]);
            this.addAnim('run', 0.10, [1,0]);
            this.addAnim('jump', 1, [2]);
            this.addAnim('shoot', 0.3, [4,3]);
            this.addAnim('fall', 0.4, [2]);
            this.addAnim('hammer_idle', 1, [8]);
            this.addAnim('hammer_run', 0.10, [8,7]);
            this.addAnim('hammer_jump', 1, [9]);
            this.addAnim('hammer_shoot', 0.3, [11,10]);
            this.addAnim('hammer_fall', 0.4, [9]);
            this.addAnim('fire_idle', 1, [15]);
            this.addAnim('fire_run', 0.10, [15,14]);
            this.addAnim('fire_jump', 1, [16]);
            this.addAnim('fire_shoot', 0.3, [18,17]);
            this.addAnim('fire_fall', 0.4, [16]);
            this.addAnim('climb', 0.4, [5,6]);
        }, // End EntityPlayer init method

        handleMovementTrace: function(res) {
            this.parent(res);

            // ---- Begin player slope collision and movement fix ----
            // Only trigger if player is colliding with slope
            if(res.collision.slope) {
                // Left/right key not pressed (used to override auto-sliding).
                if(!ig.input.state('right') && !ig.input.state('left')) {
                    // Places player in the previous frame's position.
                    this.pos.x = this.last.x;
                    this.pos.y = this.last.y;

                    // Prevents player from looping "run" animation when idle on slopes.
                    this.vel.x = 0;
                    this.vel.y = 0;
                // Left/right key is pressed (player is moving up/down slope).
                } else {
                    // Compute distance and speed player should travel on slopes.
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
                    vel_slope = Math.sqrt(Math.pow(this.maxVel.x, 2) + 2 * this.accelGround * hyp * ig.system.tick);
                    vx = Math.abs(res.collision.slope.x * vel_slope / hyp);
                    vy = Math.abs(res.collision.slope.y * vel_slope / hyp);

                    // Player is moving right on a right inclined slope
                    if(ig.input.state('right') && dy < 0) {
                        this.vel.x = vx;
                        this.vel.y = -vy;
                    // Player is moving right on a right declined slope
                    //} else if(ig.input.state('right') && dy > 0) {
                    //    this.vel.x = vx;
                    //    this.vel.y = vy;
                    // Player is moving left on a left inclined slope
                    } else if(ig.input.state('left') && dy > 0) {
                        this.vel.x = -vx;
                        this.vel.y = -vy;
                    // Player is moving left on a left declined slope
                    //} else if(ig.input.state('left') && dy < 0) {
                    //    this.vel.x = -vx;
                    //    this.vel.y = vy;
                    }

                    this.friction.x = 0; // Prevents player from slightly sliding up slopes when movement buttons are released.
                }
            } else
                this.friction.x = 500; // Reset friction to default
            // ---- End player slope collision and movement fix ----
        }, // End EntityPlayer handleMovementTrace method

        // Create our update function for character
        update: function() {
            // Add left/right movement logic
            var accel = this.standing ? this.accelGround : this.accelAir;
            if(ig.input.state('left')) {
                this.accel.x = -accel;
                this.flip = false;
            } else if(ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = true;
            } else
                this.accel.x = 0;

            // Add variable length jumping
            // CASE 1: Standing on the ground or slope, jump is being pressed,
            // and we're not already moving up.
            trace = ig.game.collisionMap.trace(this.pos.x,
                                               this.pos.y,
                                               this.vel.x * ig.system.tick + (this.flip * 10),
                                               this.vel.y * ig.system.tick + 10,
                                               this.size.x,
                                               this.size.y);

            if((this.standing || trace.collision.slope) && ig.input.state('jump')) {
                if(this.vel.y == 0) {
                    this.vel.y = -this.jump;
                    this.jumpSFX.volume = 0.5;
                    this.jumpSFX.play();
                    this.falling = false;
                }
            }
            // CASE 2: Player not standing, jump has been released and we're not falling
            // we reduce the y velocity by 66% and mark us as falling
            else if(!this.standing && !ig.input.state('jump') && !this.falling) {
                    this.vel.y = Math.floor(this.vel.y/3);
                    this.falling = true;
            }

            // Add shooting logic
            if(this.activePower != null) {
                if(this.lifetime <= 30)
                    this.lifetime +=1;
                else {
                    if(ig.input.pressed('shoot')) {
                        ig.game.spawnEntity(this.activePower, this.pos.x, this.pos.y, {flip:!this.flip});
                        this.shootSFX.volume = 0.2;
                        this.shootSFX.play();
                        this.lifetime = 0;
                    }
                }
            }

            // Add moving logic
            this.currentAnim.flip.x = this.flip;
            // Test for invincibility timer. If the timer is greater
            // then the delay we set, then we force the invincibility
            // flag to be false and alpha to be 1.
            if(this.invincibleTimer.delta() > this.invincibleDelay) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }

            this.parent();

            // Set animations based on current powerup
            if(this.activePower == "EntityHammer") {
                // set the current animation, based on the player's speed
                if(this.vel.y < 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.hammer_jump;
                else if(this.vel.y > 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.hammer_fall;
                else if(this.vel.x != 0)
                    this.currentAnim = this.anims.hammer_run;
                else if(ig.input.state('shoot') && this.activePower != null)
                    this.currentAnim = this.anims.hammer_shoot;
                else
                    this.currentAnim = this.anims.hammer_idle;
            } else if(this.activePower == "EntityFireball") {
                if(this.vel.y < 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.fire_jump;
                else if(this.vel.y > 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.fire_fall;
                else if(this.vel.x != 0)
                    this.currentAnim = this.anims.fire_run;
                else if(ig.input.state('shoot') && this.activePower != null)
                    this.currentAnim = this.anims.fire_shoot;
                else
                    this.currentAnim = this.anims.fire_idle;
            } else {
                if(this.vel.y < 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.jump;
                else if(this.vel.y > 0 && !this.standing && !trace.collision.slope)
                    this.currentAnim = this.anims.fall;
                else if(this.vel.x != 0)
                    this.currentAnim = this.anims.run;
                else if(ig.input.state('shoot') && this.activePower != null)
                    this.currentAnim = this.anims.shoot;
                else
                    this.currentAnim = this.anims.idle;
            }
         }, // End EntityPlayer update method

        // This method is called on player's death
        kill: function() {
            this.deathSFX.play();
            this.parent();
            ig.game.respawnPlayerAtLastCheckpoint(this.pos.x, this.pos.y);
            ig.game.spawnEntity(EntityPlayerdeathanimation, this.pos.x, this.pos.y, {callBack:this.onDeath});
        }, // End EntityPlayer kill method

        // Method for toggling invincibility
        makeInvincible: function() {
            this.invincible = true;
            this.invincibleTimer.reset();
        }, // End EntityPlayer makeInvincible method

        // If invincible flag is true, don't deal damage.
        // Otherwise, receive damage
        receiveDamage: function(amount, from) {
            if(this.invincible)
                return;
            if(this.activePower != null) {
                this.losePowerSFX.volume = 0.5;
                this.losePowerSFX.play();
                this.activePower = null;
            }
            this.parent(amount, from);
        }, // End EntityPlayer recieveDamage method

        // Test for invincibility in the draw method as well.
        // If true, set alpha to represent how much longer invincibility lasts.
        // In Impact, alpha is a value between 0 and 1.
        draw: function() {
            if(this.invincible)
                // Calculate percentage used for player fade in
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay*1;
            this.border.draw(this.border.width + 122, 9)
            if(this.activePower != null) {
                if(this.activePower == "EntityFireball")
                    this.fireball.draw(this.fireball.width + 125, 10)
                else
                    this.hammer_suit.draw(this.hammer_suit.width + 125, 10)
            }

            this.parent();
        }, // End EntityPlayer draw method

        // On a player's death, this method checks # of lives and displays the proper screen
        // If lives > 0, respawn the player, else show game over screen
        onDeath: function() {
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if(ig.game.lives < 0)
                ig.game.gameOver();
        }, // End EntityPlayer onDeath method
    }); // End EntityPlayer
}); // End .defines
