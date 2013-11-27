/*
Iggy Koopa
----------
A boss featuring the combination of AIs from existing enemies:
  1. [Modified] Stalker AI from Flying Yellow Koopa.
  2. [Modified] Protection/Spiky state from Bony Beetle (new).
  3. Linear attack projectile from Bullet Shooter.
  4. [Modified] Multiple attack projectiles from Hammer Bros.
  5. Skipping (jumping while moving) AI from Flying Green Koopa.
  5. [Modified] Randomized jumping from Jumping Ninji.

Custom AIs:
  1. Multiple health-based AI stages.
  2. Anti-"I cannot reach player" AI.
  3. Anti-"hammer/fireball damage abuse" AI.
  4. Derived from stalker --> Waits until provoked by player or if player is near.
  5. Derived from protection/spiky state --> Random protection/spiky state duration.
  6. Derived from protection/spiky state --> Panick state.
  7. Derived from randomized jumping --> Random jump frequency with random jump height.
  8. Derived from linear attack projectiles --> linear attack projectiles with random spread.


----- Initial/Basic AI -----
1. Enemy will initially remain stationary until player comes within detection
   range or enemy is provoked (such as if player attacks from afar).
2. If enemy has lost track of player, enemy defaults to basic left/right
   movement. Enemy will move in the opposite direction if it collides with an
   obstacle.

----- Detection/Chase AI -----
3. If player is near enemy but NOT in enemy's line-of-sight (LoS), enemy
   ignores player and uses default AI. Enemy's LoS is a rectangular
   field-of-view directly in front of itself.
4. If enemy detected player (either by distance or by provoke), enemy begins
   chasing player and extends its detection range.
   a. If enemy is following player and player moves behind enemy, enemy faces
      player and continues to chasing.
   b. If enemy is following player and player steps out of enemy's detection
      range, enemy stops following player and resets to default AI.
5. If enemy detected player and player is above enemy for too long (enemy cannot
   reach player), enemy will increase its average jump height (still random) in
   an attempt to overcome obstacle.
6. Extending from #5: If enemy still cannot reach player, give up and patrol
   (walk left and right) around the immediate area. If enemy redetects or is
   provoked again by player, restart chasing AI.
7. If player is killed, stop detection and chasing to give player time to
   rethink strategy. If enemy redetects or is provoked again by player, restart
   chasing AI.

----- Randomized Jumping while Moving AI -----
8. Enemy will jump while moving.
9. Enemy will jump random heights at random intervals.
   a. Enemy may jump when firing its attack causing attack projectiles to be
      launched at jump height.
   b. See #5.

----- Protection/Shell State AI -----
10. If the player jumps on enemy when enemy is NOT in shell state, enemy will
    take damage and enter shell state (a spinning shell).
    a. In shell state, if the player jumps on enemy, player takes extra damage.
    b. Enemy will unhide (exit shell state) and revert back to default AI after
       some time has passed regardless if player is near enemy or not.
    c. Enemy duration in shell state is determined by its current AI state. The
       higher the AI state (the lower the enemy's health is), the longer the
       duration.
    d. Panick state: If enemy is in panick state and enemy enters shell state,
       enemy remains in shell state indefinately until player moves far enough
       away from enemy. While in panick state, if player is still within range,
       enemy will begin to fire projectiles randomly while in shell state. As the
       enemy's health decreases, the frequency of firing random projectiles
       increases.

----- Multiple Health-based AI -----
11. Enemy has 3 sets of attack AIs: default, annoyed, and angry AI states.
    a. Default state: Enemy is notably faster than the average enemy. Enemy
       fires a single attack projectile in front of itself at random time
       intervals.
    b. Annoyed state: Enemy is slightly faster than default state, and shell time
       increases. Enemy fires three attack projectiles at same time in front of
       itself in a triangular formation. Center projectile is same as default
       state's projectile. Top and bottom projectiles have randomized spread
       angle with a linear trajectory.
    c. Angry state: Enemy is moderately faster than default state, and shell time
       further increases. Enemy fires 8 attack projectiles around itself in a
       circular formation. Each of the projectiles are fired at a difference of
       45-degree angle in a linear trajectory.
    d. Rampage state: Enemy is much faster than default state, and attack
       frequency increases. Enemy shoots a single projectile directed towards
       player's position at firing time. Enemy continues to move faster as its
       health continues to decrease.

----- Anti-camping AI -----
12. Enemy has anti-camping AIs. (camping = tactic where player obtains static
    strategic position of advantage)
    a. If player is on unreachable for long enough, enemy will fire a single attack
       projectile upwards/downwards towards player in hopes of threatening player
       above/below.
    b. Enemy will not jump up if directly below player to prevent auto-taking
       damage and auto-entering shell state (due to #7).
    c. See #5.

----- Obstacle Traversal AI -----
13. See #5.
14. See #6.

----- Abuse protection -----
15. Enemy cannot be abused from non-player damage projectiles as much.
    a. Damage from non-player projectiles that hits enemy is nerfed to 1 damage.
16. See #9b.

----- Game/Level controllers -----
17. Defeating enemy will automatically end level.
    a. This feature can be disabled in the enemy's properties.

*/

ig.module('game.entities.enemies.iggy_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityIggy_koopa = EntityBasic_ai.extend({
        // Add animation and set collision
        animSheet: new ig.AnimationSheet('media/enemies/iggy_koopa_full.png', 32, 32),
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
        kill_score: 1000, // Just because it's a "boss" enemy

        // ----- Begin custom properties -----
        // Game/Level properties
        exit_when_killed: true, // Exit level (and display stats screen) when enemy is killed

        // AI state properties
        grace_time: 2, // Grace (non-agression) time to allow player a chance to escape if enemy is camping player respawn zone on player death
        ai_state: 0, // 0 = default, 1 = annoyed, 2 = angry, 3 = rampage
        ai_state_health: {annoyed: 40, angry: 25, rampage: 10, panick: 15}, // Health values at which the enemy's AI will switch

        // Detection properties
        icu_check_dist: {x: 150, y: 65}, // x, y distance enemy will detect player at
        icu_chase_dist: {x: 600, y: 300}, // x, y distance enemy will chase player at (span almost the entire map)

        // Attack projectile properties
        attack_damage: 3, // damage inflicted from attack projectiles if collide with player by default
        unreachable_damage: 5, // damage inflicted from attack projectiles if collide with player if player is unreachable
        projectile_speed: 100, // Speed of attack projectile
        attack_spread: {base: 40, delta: 15}, // base and variable y-component of projectile spread
        attack_interval: {min: 1, max: 4}, // minimum and maximum range of seconds between attacks (generated randomly)
        attack_charge: 0.7, // seconds between stopping/charging and launching attack projectile (used in conjuntion with animation speed)

        // Protection/Shell state properties
        shell_hide_time: {base: 1, min: 0, max: 1}, // seconds to hide in shell before returning to normal state
        shell_panick_attack_wait_time: 4, // seconds before enemy starts spewing attack projectiles while in panick state and in shell

        // Jump properties
        jump_interval: {min: 2, max: 4}, // minimum and maximum range of seconds between jumping (generated randomly)
        jump_height: {min: -50, max: -100}, // minimum and maximum range of height in which to jump (generated randomly)
        unreachable_patience: 15, // seconds at which enemy will wait until it suspects player is unreachable
        // ----- End custom properties -----

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animation states
            this.addAnim('idle', 1, [0], true); // Initial animation
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
            this.graceTimer = new ig.Timer();

            // Flags
            setAtkTime = false; // Is attack interval timer set?
            setJumpTime = false; // Is jump interval timer set?
            panick = false; // Is enemy in panick state?
            inShell = false; // Is enemy in shell state?

            // Comparason variables
            max_health = this.health; // Maximum health to check enemy's condition
            provoke_health = this.health; // Initial health to check if enemy has been provoked

            // Temporary variables
            this.graceTimer.set(-this.grace_time);
            speed_tmp = 0; // Wait until enemy detects player via detection AI
            shell_hide_time_tmp = this.shell_hide_time; // Used to allow hide time back to be reverted to default
            icu = false; // Has enemy detected player?
        }, // End init method

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

            // Enemy is chasing player but cannot reach player for a long time even after out-of-patience mode --> Give up, reset patience timer and don't chase anymore
            if(icu && this.unreachableTimer.delta() > this.unreachable_patience * 3) {
                provoke_health = this.health;
                this.unreachableTimer.set(0);
                icu = false;
            }

            // Update properties for new AI state if health reaches certain amount
            if(this.ai_state != 3) {
                if(this.health <= this.ai_state_health.annoyed && this.health > this.ai_state_health.angry && this.ai_state == 0) {
                    // Annoyed state
                    this.speed = 55; // Increase movement speed
                    this.shell_hide_time.base += 0.5; // Increase shell state time
                    this.shell_hide_time.min += 0.5; // Increase shell state time
                    this.shell_hide_time.max += 0.5; // Increase shell state time
                    this.attack_interval.min = 1.5; // Decrease frequency of attacks
                    this.attack_charge = 1.05; // 1.5x attack charge time to compensate for increased projectiles
                    this.ai_state = 1;
                } else if(this.health <= this.ai_state_health.angry && this.health <= this.ai_state_health.rampage && this.ai_state == 1) {
                    // Angry state
                    this.speed = 70; // Increase movement speed
                    this.shell_hide_time.base += 1; // Increase shell state time
                    this.shell_hide_time.min += 0.5; // Increase shell state time
                    this.shell_hide_time.max += 1; // Increase shell state time
                    this.attack_interval.min = 2; // Decrease frequency of attacks
                    this.attack_charge = 1.4; // 2x attack charge time to compensate for increased projectiles
                    this.ai_state = 2;
                } else if(this.health <= this.ai_state_health.rampage && this.ai_state == 2) {
                    // Rampage state
                    this.speed = 90 - this.health; // Increase movement speed; speed up further as health decreases
                    this.attack_interval.min = 1.25; // Increase frequency of attacks
                    this.attack_interval.max = 2.5; // Increase frequency of attacks
                    this.attack_charge = 0.7; // Return to default attack charge time due to decreased projectiles
                    this.jump_interval.min = 1.5; // Increase frequency of jumping
                    this.jump_interval.max = 3.5; // Increase frequency of jumping
                    this.jump_height.min *= 1.15; // Increase jump height
                    this.jump_height.max *= 1.15; // Increase jump height
                    this.ai_state = 3;
                }
            }

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

                // Is player alive?
                if(my_player != null && this.grace_time < this.graceTimer.delta()) {
                    // Get player's position
                    var target_x = 0;
                    var target_y = 0;
                    target_x = my_player.pos.x;
                    target_y = my_player.pos.y;
                    var distToPlayer_x = Math.abs(target_x - this.pos.x);
                    var distToPlayer_y = Math.abs(target_y - this.pos.y)

                    // Player is within enemy's potential detection range but has not detected player yet **OR** Enemy is provoked from player attacking it from afar
                    if((!icu && distToPlayer_x <= this.icu_check_dist.x && distToPlayer_y <= this.icu_check_dist.y) || this.health < provoke_health) {
                        // Player in enemy's line-of-sight --> Begin chasing behavior
                        if((target_x > this.pos.x && !this.flip) || (target_x < this.pos.x && this.flip)) {
                            // Start moving and play walking animation
                            this.anims.crawl.flip.x = this.flip;
                            this.anims.attack.flip.x = this.flip;
                            this.currentAnim = this.anims.crawl;
                            speed_tmp = this.speed;
                            icu = true;

                            // Enemy is provoked --> start chasing player; do not need to check if provoked again
                            provoke_health = null;

                            // Reset shoot timer to prevent instant firing attack projectile when start chasing
                            this.shootTimer.set(0);
                            setAtkTime = false;
                        }
                    // Enemy has detected player --> Begin chasing behavior; Extend detection/chasing range
                    } else if(icu && distToPlayer_x <= this.icu_chase_dist.x && distToPlayer_y <= this.icu_chase_dist.y) {
                        // Player is behind enemy --> Enemy faces player
                        if((target_x < this.pos.x && !this.flip) || (target_x > this.pos.x && this.flip)) {
                            this.flip = !this.flip;
                            this.anims.crawl.flip.x = this.flip;
                            this.anims.attack.flip.x = this.flip;
                        }

                        // Set attack interval time
                        if(!setAtkTime) {
                            // Randomize interval between attacks
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
                                    // Fire 3 projectiles in front of enemy
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: Math.random() * -this.attack_spread.delta - this.attack_spread.base}});
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: 0}});
                                    ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed, y: Math.random() * this.attack_spread.delta + this.attack_spread.base}});
                                // Stage 3 AI: Circular projectiles
                                } else if(this.health > this.ai_state_health.rampage) {
                                    // Fire 8 projectiles around enemy
                                    var ring_count = 8;
                                    var angle_delta = 2 * Math.PI / ring_count;
                                    for(var i = 0; i < ring_count; i++) {
                                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed * Math.cos(i * angle_delta), y: this.projectile_speed * Math.sin(i * angle_delta)}});
                                    }
                                } else {
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
                    // Player stepped outside of detection distance --> Reset behavior (do not chase)
                    } else {
                        provoke_health = this.health;
                        this.unreachableTimer.set(0);
                        icu = false;
                    }
                }
            // Enemy is in shell state
            } else {
                // Stop moving and play shell animation
                this.currentAnim = this.anims.shell;
                speed_tmp = 0;
                shell_hide_time_tmp = this.shell_hide_time.base + Math.random() * this.shell_hide_time.max + this.shell_hide_time.min;

                // Not in panick mode and shell duration exceeded **OR** in panick mode and player is out of range
                if((!panick && this.shellTimer.delta() > shell_hide_time_tmp) ||
                    (panick && this.distanceTo(my_player) > this.icu_check_dist.x)) {
                        // Reset and return to default state
                        this.currentAnim = this.anims.crawl;
                        inShell = false;
                        this.shellTimer.set(0);
                        speed_tmp = this.speed;

                        // Reset attack timer to prevent instant attack afterwards
                        this.shootTimer.set(0);
                        setAtkTime = false;
                // In panick mode and player is in range --> Start shooting projectiles randomly
                } else if(panick && this.distanceTo(my_player) < this.icu_check_dist.x) {
                    if(!setAtkTime) {
                        this.shootTimer.set(0);
                        setAtkTime = true;
                    // Frequency of shooting projectiles increases as enemy's health decreases
                    } else if(this.shootTimer.delta() > ((this.health / max_health) + this.shell_panick_attack_wait_time)) {
                        // Shoot a single projectile in a random direction
                        var angle_delta = Math.random() * 2 * Math.PI;
                        ig.game.spawnEntity(EntityRing, this.pos.x, this.pos.y, {flip: !this.flip, damage: this.attack_damage, speed: {x: this.projectile_speed * Math.cos(angle_delta), y: this.projectile_speed * Math.sin(angle_delta)}});
                        this.shootTimer.set(-this.shell_panick_attack_wait_time);
                    }
                }
            }

            this.parent();
        }, // End update method

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

                    // Player is killed --> Redetect player and stop chasing
                    if(other.health <= 0) {
                        my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
                        provoke_health = this.health;
                        this.unreachableTimer.set(0);
                        this.graceTimer.set(0);
                        icu = false;
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
            // If receiving damage due to non-player collision (assume hammer or fireball) --> Nerf damage to 1
            if(!(other instanceof EntityPlayer))
                value = 1;
            this.parent(value, other);
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
        } // End receiveDamage method
    }); // End EntityIggy_koopa

    // Iggy Koopa's Ring Attack Projectile
    EntityRing = ig.Entity.extend({
        // Set up collision
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation and set collision
        animSheet: new ig.AnimationSheet('media/enemies/attack.png', 16, 16),
        size: {x: 16, y: 16},

        // Set speed
        maxVel: {x: 100, y: 100},
        speed: {x: 0, y: 0},
        gravityFactor: 0, // Prevent gravity from altering projectile's trajectory

        damage: 1, // Set default damage for projectile

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set up animation states
            this.addAnim('idle', 1, [0]);

            // Set initial direction and speed
            var xdir = this.flip ? 1 : -1;
            this.vel.x = this.speed.x * xdir;
            this.vel.y = this.speed.y;
            this.anims.idle.flip.x = this.flip;

            // Load player object if not in Weltmeister
            if(!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        }, // End init method

        update: function() {
            this.parent();

            // Clean up: Auto-kill this entity if too far from player to prevent having too many entities on screen
            if(this.distanceTo(my_player) > ig.system.width)
                this.kill();
        }, // End update method

        handleMovementTrace: function(res) {
            // Override entity's collision against walls so it can pass through them.
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        }, // End handleMovementTrace method

        check: function(other) {
            // Damage player and destroy this entity
            other.receiveDamage(this.damage, this);
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        } // End check method
    }); // End EntityRing
}); // End .defines
