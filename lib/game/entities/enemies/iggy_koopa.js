/*
Iggy Koopa
----------
A boss featuring the combination of AIs from existing enemies:
  1. Stalker AI from Flying Yellow Koopa.
  2. [Modified] Protection/Spiky state from Bony Beetle (new).
  3. Linear attack projectile from Bullet Shooter.
  4. [Modified] Multiple attack projectiles from Hammer Bros.
  5. Skipping (jumping while moving) AI from Flying Green Koopa.
  5. [Modified] Randomized jumping from Jumping Ninji.

Custom AIs:
  1. Multiple AIs determined by current health.
  2. Waits for player to make the first move or if player comes close enough.
  3. Anti-"I cannot reach player" AI.
  4. Derived from protection/spiky state --> Random protection/spiky state duration.
  5. Derived from protection/spiky state --> Panick state.
  6. Derived from randomized jumping --> Random jump frequency with random jump height.
  7. Derived from linear attack projectiles --> linear attack projectiles with random spread.
*/

ig.module('game.entities.enemies.iggy_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityIggy_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/iggy_koopa_full.png', 32, 32),
        size: {x: 28, y: 29},
        offset: {x: 3, y: 3},
        flip: true, // Enemy faces left

        // Override Basic AI default properties
        health: 55, // NOTE: If you update health, be sure to update the ai_state_health property values below relative to new health
        maxVel: {x: 500, y: 250}, // NOTE: If you update maxVel, be sure to update the jump_height property values and speed values below relative to new maxVel
        speed: 40, // NOTE: If you update speed, be sure to update the this.speed values below relative to new speed
        collide_damage: 1, // Default player damage when colliding with enemy
        damage_jump: -125, // Default vertical player jump distance when colliding with enemy vertically
        damage_push: 125, // Default horizontal player push distance when colliding with enemy horizontally

        // ----- Begin custom properties -----
        // AI state properties
        ai_state_health: {annoyed: 40, angry: 25, rampage: 10, panick: 15}, // Health values at which the enemy's AI will switch

        // Stalker properties
        stalk_check_dist: {x: 150, y: 100}, // x, y distance enemy will detect player at
        stalk_chase_dist: {x: 400, y: 200}, // x, y distance enemy will chase player at

        // Attack projectile properties
        attack_damage: 3, // damage inflicted from attack projectiles if collide with player by default
        unreachable_damage: 5, // damage inflicted from attack projectiles if collide with player if player is unreachable
        projectile_speed: 100, // Speed of attack projectile
        attack_spread: {base: 35, delta: 25}, // base and variable y-component of projectile spread
        attack_interval: {min: 1, max: 4}, // minimum and maximum range of seconds between attacks (generated randomly)
        attack_charge: 0.7, // seconds between stopping/charging and launching attack projectile (used in conjuntion with animation speed)

        // Protection properties
        shell_hide_time: {base: 1, min: 0, max: 1}, // seconds to hide in shell before returning to normal state

        // Jump properties
        jump_interval: {min: 2, max: 4}, // minimum and maximum range of seconds between jumping (generated randomly)
        jump_height: {min: -50, max: -100}, // minimum and maximum range of height in which to jump (generated randomly)
        unreachable_patience: 20, // seconds at which enemy will wait until it suspects player is unreachable
        // ----- End custom properties -----

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animation states
            this.addAnim('idle', 1, [0], true);
            this.addAnim('crawl', 0.2, [0,1]);
            this.addAnim('attack', 0.1, [2,3,4,5,6,7,8,9]);
            this.addAnim('shell', 0.05, [10,11,12,13,14,15]);

            // Correct idle animation flip
            this.anims.idle.flip.x = this.flip;
            this.anims.attack.flip.x = this.flip;

            // Timers
            this.shootTimer = new ig.Timer();
            this.shellTimer = new ig.Timer();
            this.jumpTimer = new ig.Timer();
            this.unreachableTimer = new ig.Timer();

            // Flags
            setAtkTime = false;
            setJumpTime = false;
            panick = false;
            inShell = false;

            // Temporary variables
            init_health = this.health; // Initial health to check if enemy has been provoked
            max_health = this.health; // Maximum health to check enemy's condition
            speed_tmp = 0; // Wait until enemy detects player via stalker AI
            shell_hide_time_tmp = this.shell_hide_time;
        },

        update: function() {
            // Move forward in flip direction
            var xdir = this.flip ? -1 : 1;
            this.vel.x = speed_tmp * xdir;

            // Enter panick state if enemy's health is low
            if(this.health <= this.ai_state_health.panick)
                panick = true;

            // Reset patience timer if player is within reachable height
            if((my_player.pos.y >= this.pos.y + my_player.size.y) || (my_player.pos.y >= this.pos.y - this.size.y))
                this.unreachableTimer.set(0);

            // Enemy not in shell state --> Use default AI
            if(!inShell) {
                // Randomize interval between jumps
                if(!setJumpTime) {
                    jump_dur = Math.random() * this.jump_interval.max + this.jump_interval.min;
                    setJumpTime = true;
                // Enemy is on the ground, is moving (not in attack animation), and jump interval duration has elapsed,
                } else if(this.standing && this.vel.x && this.jumpTimer.delta() > jump_dur) {
                    // Player is not directly on top or below enemy (prevents auto-killing itself if enemy keeps jumping under player)
                    if(this.pos.x > my_player.pos.x + my_player.size.x || my_player.pos.x > this.pos.x + this.size.x) {
                        // Jump at random height
                        if(this.unreachable_patience > this.unreachableTimer.delta())
                            this.vel.y = Math.random() * this.jump_height.max + this.jump_height.min;
                        // Player is too high above enemy for too long (assume player is camping on top of a ledge or across an obstacle)
                        else
                            this.vel.y = Math.random() * this.jump_height.max * 1.5 + this.jump_height.min * 2;
                        this.jumpTimer.set(0);
                    }
                }

                if(my_player != null) {
                    var target_x = 0;
                    var target_y = 0;
                    target_x = my_player.pos.x;
                    target_y = my_player.pos.y;
                    var stalking = false;

                    // Player is within enemy's potential detection range but has not detected player yet **OR** Enemy is provoked from player attacking it from afar
                    if((!this.stalking && Math.abs(target_x - this.pos.x) <= this.stalk_check_dist.x && Math.abs(target_y - this.pos.y) <= this.stalk_check_dist.y) || this.health < init_health) {
                        // Player in enemy's line-of-sight --> Begin stalking behavior
                        if((target_x > this.pos.x && !this.flip) || (target_x < this.pos.x && this.flip)) {
                            // Start moving and play walking animation
                            this.anims.crawl.flip.x = this.flip;
                            this.currentAnim = this.anims.crawl;
                            speed_tmp = this.speed;
                            this.stalking = true;
                            init_health = null;

                            // Reset shoot timer to prevent instant firing attack projectile when start stalking
                            this.shootTimer.set(0);
                            setAtkTime = false;
                        }
                    // Enemy has detected player --> Begin stalking behavior; Extend detection/stalking range
                    } else if(this.stalking && Math.abs(target_x - this.pos.x) <= this.stalk_chase_dist.x && Math.abs(target_y - this.pos.y) <= this.stalk_chase_dist.y) {
                        // Player is behind enemy --> Enemy faces player
                        if((target_x < this.pos.x && !this.flip) || (target_x > this.pos.x && this.flip)) {
                            this.flip = !this.flip;
                            this.anims.crawl.flip.x = this.flip;
                            this.anims.attack.flip.x = this.flip;
                        }

                        // Randomize interval between attacks
                        if(!setAtkTime) {
                            atk_dur = Math.random() * this.attack_interval.max + this.attack_interval.min;
                            setAtkTime = true;
                        // Attack procedure
                        } else if(this.shootTimer.delta() > atk_dur) {
                            // Stop moving and play attack animation
                            speed_tmp = 0;
                            this.currentAnim = this.anims.attack;

                            // Attack interval duration has elapsed
                            if(this.shootTimer.delta() > atk_dur + this.attack_charge) {
                                // Stage 0 AI: Player tries to be smart by camping above/below enemy...
                                // If enemy is in Stage 2 AI, skip this and go directly to firing Stage 2 projectiles
                                if(this.unreachable_patience < this.unreachableTimer.delta()) {
                                    // Fire projectile above enemy! :)
                                    if(my_player.pos.y < this.pos.y + my_player.size.y)
                                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.unreachable_damage, speed: {x: 0, y: -this.projectile_speed}});
                                    // Fire projectile below enemy! :)
                                    else
                                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.unreachable_damage, speed: {x: 0, y: this.projectile_speed}});
                                // Stage 1 AI: Single frontal projectile
                                } else if(this.health > this.ai_state_health.annoyed) {
                                    // Fire projectile in front of enemy
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: 0}});
                                // Stage 2 AI: Triple frontal projectiles with randomized spread
                                } else if(this.health > this.ai_state_health.angry) {
                                    // Update properties for new AI
                                    this.speed = 55;
                                    this.shell_hide_time.base = this.shell_hide_time.base + 0.5;
                                    this.shell_hide_time.min = this.shell_hide_time.min + 0.5;
                                    this.shell_hide_time.max = this.shell_hide_time.max + 1;
                                    this.attack_charge = this.attack_charge * 1.05;

                                    // Fire 3 projectiles in front of enemy
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: Math.random() * -this.attack_spread.base - this.attack_spread.delta}});
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: 0}});
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: Math.random() * this.attack_spread.base + this.attack_spread.delta}});
                                // Stage 3 AI: Circular projectiles
                                } else if(this.health > this.ai_state_health.rampage) {
                                    // Update properties for new AI
                                    this.speed = 70;
                                    this.shell_hide_time.base = this.shell_hide_time.base + 1;
                                    this.shell_hide_time.min = this.shell_hide_time.min + 1;
                                    this.shell_hide_time.max = this.shell_hide_time.max + 2;
                                    this.attack_charge = this.attack_charge * 1.4;

                                    // Fire 8 projectiles around enemy
                                    var ring_count = 8;
                                    var angle_delta = 2 * Math.PI / ring_count;
                                    for(var i = 0; i < ring_count; i++) {
                                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed * Math.cos(i * angle_delta), y: this.projectile_speed * Math.sin(i * angle_delta)}});
                                    }
                                } else {
                                    // Update properties for new AI
                                    this.speed = 90 - this.health; // Speed up as health decreases
                                    this.attack_interval.min = 0.5;
                                    this.attack_interval.max = 1;
                                    this.attack_charge = 0.7;
                                    this.jump_interval.min = 1;
                                    this.jump_interval.max = 2;
                                    this.jump_height.min = -100;
                                    this.jump_height.max = -150;

                                    // Fire projectile in direction of player
                                    var dist_x = this.pos.x - target_x;
                                    var dist_y = this.pos.y - target_y;
                                    var angle_delta = Math.tan(dist_y / dist_x);
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed * Math.cos(angle_delta), y: this.projectile_speed * Math.sin(angle_delta)}});
                                }

                                // Reset timer and animation
                                this.currentAnim = this.anims.crawl;
                                this.shootTimer.set(0);
                                speed_tmp = this.speed;
                                setAtkTime = false;
                            }
                        }
                    // Player stepped outside of detection distance --> Reset behavior (do not stalk)
                    } else
                        this.stalking = false;
                }
            // Enemy is in shell state
            } else {
                // Stop moving and play shell animation
                this.currentAnim = this.anims.shell;
                speed_tmp = 0;
                shell_hide_time_tmp = this.shell_hide_time.base + Math.random() * this.shell_hide_time.max + this.shell_hide_time.min;

                // Not in panick mode: Shell duration exceeded, return to default state
                // In panick mode: Player is out of range, return to default state
                if((!panick && this.shellTimer.delta() > shell_hide_time_tmp) ||
                    (panick && this.distanceTo(my_player) > this.stalk_check_dist.x)) {
                        this.currentAnim = this.anims.crawl;
                        inShell = false;
                        this.shellTimer.set(0);
                        speed_tmp = this.speed;

                        // Reset attack timer to prevent instant attack afterwards
                        this.shootTimer.set(0);
                        setAtkTime = false;
                // In panick mode: Player is in range for too long --> Start shooting projectiles randomly
                } else if(panick && this.distanceTo(my_player) < this.stalk_check_dist.x) {
                    if(this.shootTimer.delta() > this.attack_interval.max * this.health / max_health) {
                        // Spew a single projectile randomly
                        var angle_delta = Math.random() * 2 * Math.PI;
                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed * Math.cos(angle_delta), y: this.projectile_speed * Math.sin(angle_delta)}});
                        this.shootTimer.set(0);
                        setAtkTime = false;
                    }
                }
            }

            this.parent();
        },

        // Override Basic AI's collideWith method
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
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
                        other.vel.x = other.pos.x > this.pos.x ? this.damage_push * 1.5 : -this.damage_push * 1.5;
                    // Enemy is already in shell state --> Push player back and player takes extra damage
                    } else {
                        other.receiveDamage(this.collide_damage * 2, this);
                        other.vel.y = axis == 'y' ? this.damage_jump * 1.25 : 0;
                        other.vel.x = other.pos.x > this.pos.x ? this.damage_push * 1.25 : -this.damage_push * 1.25;
                    }
                // Player collides with enemy horizontally --> Push player back and do damage.
                } else {
                    other.receiveDamage(this.collide_damage, this);
                    other.vel.x = other.pos.x > this.pos.x ? this.damage_push : -this.damage_push;
                }

                // If player is killed, redetect player
                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        },

        // Override Basic AI's collideWith method
        receiveDamage: function(value, other) {
            // If receiving damage due to non-player collision (assume hammer or fireball) --> Nerf damage to 1
            if(!(other instanceof EntityPlayer))
                value = 1;
            this.parent(value, other);
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
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
        damage: 1,

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
            other.receiveDamage(this.damage, this);
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        }
    }); // End EntityRing
}); // End .defines
