ig.module('game.entities.enemies.boomer')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBoomer = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/Boomer.png', 32, 32),
        size: {x: 32, y: 32},
        flip: true, //enemy face left
        //health: 10, 
        speed: 20,
        collide_damage: 3,
        
        stalk_check_dist: {x: 40, y: 35}, // x, y distance enemy will detect player at
        stalk_chase_dist: {x: 150, y: 60}, // x, y distance enemy will chase player at

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.addAnim('crawl', 0.30, [0,1,2,3,4]);
            this.offset.x = 5;
            
            //Timer
            this.shootTimer = new ig.Timer(); //set interval for shooting
            
            //Flag
            isStalk = false;
            isShoot = false;
            //this.offset.y = 1;
            
            speed_temp = 0;
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            // If the enemy collides with a wall, make them turn around.
            if(res.collision.x) {
                this.flip = this.flip;
                this.currentAnim.flip.x = !this.flip;
            }
        },

        update: function() {
        	my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            var xdir = this.flip ? 1 : -1;
            this.vel.x = speed_temp * xdir;
            this.parent();
			
			//console.log(this.stalk_check_dist.x);
			
            if(my_player != null) {
                var target_x = my_player.pos.x;
                var target_y = my_player.pos.y;
                var disToPlayer_x = Math.abs(target_x - this.pos.x);
                var disToPlayer_y = Math.abs(target_y - this.pos.y);
               
				//console.log(disToPlayer_x);
				//console.log(this.shootTimer.delta());
				
                // Player is within enemy's potential detection range but has not detected player yet
                if(!this.isStalk && disToPlayer_x <= this.stalk_check_dist.x && disToPlayer_y <= this.stalk_check_dist.y) 
                {
                	speed_temp = this.speed;
                	this.currentAnim = this.anims.crawl;
                    // Player in enemy's line-of-sight --> Begin isStalk behavior
                    if((target_x > this.pos.x && this.flip) || (target_x < this.pos.x && !this.flip))
                        this.isStalk = true;
                } 
                // Enemy has detected player --> Begin isStalk behavior; Extend detection/isStalk range
                else if(this.isStalk && disToPlayer_x <= this.stalk_chase_dist.x && disToPlayer_y <= this.stalk_chase_dist.y) 
                {
                    // Player is behind enemy --> Enemy faces player
                    if((target_x < this.pos.x && this.flip) || (target_x > this.pos.x && !this.flip)) {
                        this.flip = !this.flip;
                        this.anims.crawl.flip.x = !this.flip;
                    }
                   
                    //Set shoot bullets intervals
                    if(!isShoot)
                    {
                    	isShoot = true;
                    } 
                    else if (disToPlayer_x > 8 && disToPlayer_x < 20 && this.shootTimer.delta() > 6)
                    {
                    	speed_temp = 0;
                    	this.currentAnim = this.anims.idle;

						// Fire bullet left
						ig.game.spawnEntity(EntityBulletBill, this.pos.x - 14, this.pos.y + 2, {flip: this.flip});
						// Fire bullet right
						ig.game.spawnEntity(EntityBulletBill, this.pos.x + 30, this.pos.y + 2, {flip: !this.flip}); 
						this.shootTimer.set(0);
//						speed_temp = this.speed;
//						this.currentAnim = this.anims.crawl;
//						isShoot = false;						
						
                    }
                }
                // Player stepped outside of detection distance --> Reset behavior (do not stalk)
                else
                {
                	//speed_temp = this.speed;
                	//this.currentAnim = this.anims.crawl;
                	//isShoot = false;
                    this.isStalk = false;
                }
            }
        },
        
        collideWith: function(other, axis) {
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
        },        
    }); // End Boomer
    
    // Bullet Bill
    EntityBulletBill = ig.Entity.extend({
        // Set up collision
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bullet_bill.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 100, y: 0},
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
            other.receiveDamage(10, this);
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.kill();
        }
    }); // End EntityBulletBill
}); // End .defines
