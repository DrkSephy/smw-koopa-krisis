/*
when player not detected:  moves left and right in one position
when detects player AI: moves left and right while following user ,
						occasionally: -jump towards player
									  -shoot fireballs at player
						then return stalking mode
*/

ig.module('game.entities.enemies.boomer')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBoomer = EntityBasic_ai.extend({
        // Add animation and set collision
        animSheet: new ig.AnimationSheet('media/enemies/Boomer.png', 32, 32),
        size: {x: 28, y: 29},
        offset: {x: 3, y: 3},
        flip: true, // Enemy faces left

        // Override Basic AI default properties
        health: 55, // Enemy health when spawned; Default: 55
                    // NOTE: Don't set health too low since it may skip certain AI stages;
                    //       Don't set health too high since it will be VERY hard to kill near the end (don't say I didn't warn you)
                    // NOTE: If you update health, be sure to update the ai_state_health property values below relative to new health
        maxVel: {x: 500, y: 250}, // NOTE: If you update maxVel, be sure to update the jump_height property values and speed values below relative to new maxVel
        speed: 40, // Default horizontal movement speed; Default: 40
                   // NOTE: If you update speed, be sure to update the this.speed values below relative to new speed
        collide_damage: 1, // Default player damage when colliding with enemy; Default: 1
        damage_jump: -125, // Default vertical player jump distance when colliding with enemy vertically; Default: -125
        damage_push: 125, // Default horizontal player push distance when colliding with enemy horizontally; Default: 125
        kill_score: 9001, // Just because it's a "boss-type" enemy :)

        // ----- Begin custom properties -----
        // Game/Level properties
        exit_when_killed: true, // Exit level (and display stats screen) when enemy is killed

        // AI state properties
        grace_time: 2, // Grace (non-agression) time to allow player a chance to escape if enemy is camping player respawn zone on player death


        // Detection properties
        icu_check_dist: {x: 150, y: 65}, // x, y distance enemy will detect player at
        icu_chase_dist: {x: 600, y: 300}, // x, y distance enemy will chase player at (span almost the entire map)

		//Protection state properties
		flat_time: {base: 1, min: 0, max: 1} //seconds flat before returning to normal statw

        // Jump properties
        jump_interval: {min: 2, max: 4}, // minimum and maximum range of seconds between jumping (generated randomly)
        jump_height: {min: -60, max: -90}, // minimum and maximum range of height in which to jump (generated randomly)
        unreachable_patience: 15, // seconds at which enemy will wait until it suspects player is unreachable
        
        // Attack projectile properties
        attack_damage: 2, // damage inflicted from attack projectiles if collide with player by default
        unreachable_damage: 5, // damage inflicted from attack projectiles if collide with player if player is unreachable
        projectile_speed: 100, // Speed of attack projectile
        attack_spread: {base: 40, delta: 15}, // base and variable y-component of projectile spread
        attack_interval: {min: 1, max: 4}, // minimum and maximum range of seconds between attacks (generated randomly)
        attack_charge: 0.7, // seconds between stopping/charging and launching attack projectile (used in conjuntion with animation speed)        
        // ----- End custom properties -----

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animation states
            this.addAnim('idle', 1, [0]); // Initial animation
            this.addAnim('walk', 0.2, [1,0,2,0]);
            this.addAnim('stalk', 0.2, [1,0,2,0,3,0,4]);
            this.addAnims('flat', 0.05, [5]);

            // Correct idle animation flip
            this.anims.idle.flip.x = this.flip;
            this.anims.walk.flip.x = this.flip;

            // Timers
            this.jumpTimer = new ig.Timer();
            this.fireballTimer = new ig.Timer();
            this.flatTimer = new ig.Timer();
            this.graceTimer = new ig.Timer();

            // Flags
            setAtkTime = false;// Is attack interval timer set?
            setJumpTime = false; // Is jump interval timer set?
            isFlat = false; // Is enemy is flat state?

            // Comparason variables
            max_health = this.health; // Maximum health to check enemy's condition
            provoke_health = this.health; // Initial health to check if enemy has been provoked

            // Temporary variables
            this.graceTimer.set(-this.grace_time);
            speed_tmp = 0; // Wait until enemy detects player via detection AI
            flat_time_tmp = this.flat_time; // Used to allow hide time back to be reverted to default
            icu = false; // Has enemy detected player?
        }, // End init method

        update: function() {
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
			
            // Move forward in flip direction            
            var xdir = this.flip ? -1 : 1;
            this.vel.x = speed_tmp * xdir;
			//Player is within range but has not seen player yet
			if (!icu && my_player.pos.x <= this.icu_check_dist.x && disToPlayer_y <= this.icu_check_dist.y)
			{
			}
			else if (icu && my_player.pos.x <= this.icu_check_dist.x && disToPlayer_y <= this.icu_check_dist.y)
			{
			}            

            this.parent();
        }, // End update method

        randomRange: function(min, max){
            return Math.random() * (max - min) + min;
        },

        // Add on to Basic AI's collideWith method
        handleMovementTrace: function(res) {
            this.parent(res);

            // If the enemy collides with an obstacle and is chasing player, climb/jump over obstacle.
            if(res.collision.x)
                if(icu && this.standing)
                    this.vel.y = this.jump_height.max * 1.5;
        }, // End handleMovementTrace method

        // Override Basic AI's collideWith method
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                if(this.grace_time < this.graceTimer.delta()) {
                    // Player falls on enemy
                    if(axis == 'y' && this.pos.y > other.pos.y) {
                        // Enemy is not in shell state --> Do damage to enemy and enter shell state
                        if(!inShell) {
                            this.receiveDamage(1, other);
                            inShell = true;
                            this.shellTimer.set(0);
                        // Enemy just entered shell state --> Push player back but player takes no damage
                        } else if(this.shellTimer.delta() < 0.1) {
                            other.vel.y = axis == 'y' ? this.damage_jump * 1.5 : 0;
                            other.vel.x = (other.pos.x + other.size.x/2) > (this.pos.x + this.size.x/2) ? this.damage_push * 1.5 : -this.damage_push * 1.5;
                        // Enemy is already in shell state --> Push player back and player takes extra damage
                        } else {
                            other.receiveDamage(this.collide_damage * 2, this);
                            other.vel.y = axis == 'y' ? this.damage_jump * 1.25 : 0;
                            other.vel.x = (other.pos.x + other.size.x/2) > (this.pos.x + this.size.x/2) ? this.damage_push * 1.25 : -this.damage_push * 1.25;
                        }
                    // Player collides with enemy horizontally --> Push player back and do damage.
                    } else {
                        other.receiveDamage(this.collide_damage, this);
                        other.vel.x = other.pos.x > this.pos.x ? this.damage_push : -this.damage_push;
                    }

                    // Player is killed --> Exit shell state and stop chasing
                    if(other.health <= 0) {
                        // Stop chasing, enable grace time
                        this.unreachableTimer.set(0);
                        this.graceTimer.set(0);
                        icu = false;
                        
                        // Reset and return to default state
                        this.currentAnim = this.anims.crawl;
                        inShell = false;
                        this.shellTimer.set(0);
                        speed_tmp = this.speed;

                        // Reset attack timer to prevent instant attack afterwards
                        this.shootTimer.set(0);
                        setAtkTime = false;
                    }
                } else {
                    var sign_x = other.vel.x ? other.vel.x < 0 ? -1 : 1 : 0;
                    var sign_y = other.vel.y ? other.vel.y < 0 ? -1 : 1 : 0;
                    other.vel.x = sign_x * this.damage_push / 2;
                    other.vel.y = sign_y * this.damage_jump / 2;
                }
            }
        }, // End collideWith method

        // Add on to Basic AI's kill method
        kill: function() {
            this.parent();

            // End level and display stats screen
            if(this.exit_when_killed)
                ig.game.toggleStats(this);
        }, // End kill method

        // Add on to Basic AI's receiveDamage method
        receiveDamage: function(value, other) {
            // If under grace period, negate incoming damage completely
            if(this.grace_time > this.graceTimer.delta())
                value = 0;
            // If receiving damage due to non-player collision (assume hammer or fireball) --> Nerf damage to 1
            else if(!(other instanceof EntityPlayer))
                value = 1;
            this.parent(value, other);
        } // End receiveDamage method
    }); // End EntityIggy_koopa

