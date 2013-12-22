/*
Boomer
-------------
    1) stalk / shoot
    2) squish state


*/

ig.module('game.entities.enemies.boomer')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBoomer = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/Boomer.png', 32, 32),
        size: {x: 32, y: 32},
        flip: true, //enemy face left
        health: 10, //1, 
        speed: 80,
        //collide_damage: 3,
        
        exit_when_killed: true, // Exit level (and display stats screen) when enemy is killed
        
        stalk_check_dist: {x: 290, y: 50}, // x, y distance enemy will detect player at
        stalk_chase_dist: {x: 300, y: 80}, // x, y distance enemy will chase player at
        
        collapsed_interval: {min: 1, max: 3}, // minimum and maximum for collapse
        shoot_interval : {min:1, max:3}, //minimum and maximum range between shoot

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.addAnim('crawl', 0.30, [0,1,2,3,4]);
            this.addAnim('collapse', 1, [5]);
            this.offset.x = 5;
            
            //Timer
            this.shootTimer = new ig.Timer(); //set interval for shooting
            this.collapseTimer = new ig.Timer(); //set interval for collapse
            
            //Flag
            isStalk = false;
            isShoot = false;
            extraball = false;
            face = false;
            isCollapsed = false;
            isFired = false; //keeps track whether bullet has shot 
                             //if it has then unidlized enemy and sets to false
            playeronground = true;
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

            if(my_player != null) {
         
                var target_x = my_player.pos.x;
                var target_y = my_player.pos.y;
                var disToPlayer_x = Math.abs(target_x - this.pos.x);
                var disToPlayer_y = Math.abs(target_y - this.pos.y);
                
               
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

                    speed_temp = this.speed;    
                    this.currentAnim = this.anims.crawl;
                                            
                    // Player is behind enemy --> Enemy faces player
                    if((target_x < this.pos.x && this.flip) || (target_x > this.pos.x && !this.flip) ) 
                    {

                            speed_temp = this.speed;
                            if (!this.face)
                            {                       
                                this.shootTimer.set(0);
                                this.face = true;
                            }
                            this.flip = !this.flip;
                    }
                    

                    if (this.face)
                    {
                        this.shootTimer.set(0);
                        this.face = false;              
                    }     

                    //Player jump ontop of enemy
                    if (isCollapsed)
                    {

                        speed_temp = 0;
                        this.currentAnim = this.anims.collapse;
                        this.vel.x = 0;
                                                
                            if (this.collapseTimer.delta()>coll_dur)
                            {
                                speed_temp = this.speed;
                                this.currentAnim = this.anims.crawl;
                                isCollapsed = false;
                                this.collapseTimer.set(0);
                                this.shootTimer.set(0);
                            }
                            
                            if (extraball)
                            {
                                ig.game.spawnEntity(EntityBalls, this.pos.x - 11, this.pos.y+16, {flip: this.flip});
                                ig.game.spawnEntity(EntityBalls, this.pos.x + 27, this.pos.y+16, {flip: !this.flip}); 
                                extraball = false;
                            }  
                    }                    
                    
                    if(isFired)
                    {
                        speed_temp = 0;
                        this.vel.x = 0;
                        this.currentAnim = this.anims.idle;
                        isFired = false;
                    }
               
                    //Set shoot bullets intervals
                    if(!isShoot && !isCollapsed)
                    {
                        isShoot = true; 
                        shoot_dur =  this.randomRange(this.shoot_interval.min, this.shoot_interval.max);                    
                    } 
                    else if (!isCollapsed   && !this.face && this.shootTimer.delta() > shoot_dur)
                    {         
                        // Fire bullet left
                        ig.game.spawnEntity(EntityBalls, this.pos.x - 11, this.pos.y+14, {flip: this.flip});
                        ig.game.spawnEntity(EntityBalls, this.pos.x - 20, this.pos.y+12, {flip: this.flip});
                        // Fire bullet right
                        ig.game.spawnEntity(EntityBalls, this.pos.x + 27, this.pos.y+13, {flip: !this.flip}); 
                        ig.game.spawnEntity(EntityBalls, this.pos.x + 36, this.pos.y+12, {flip: !this.flip}); 
                        
                        this.shootTimer.set(0);
                        isShoot = false;    
                        isFired = true;                     
                    }
                }
                // Player stepped outside of detection distance --> Reset behavior (do not stalk)
                else
                {
                    this.isStalk = false;
                    
                }
            }
        },

        randomRange: function(min, max){
            return Math.random() * (max - min) + min;
        },
        
                
        collideWith: function(other, axis) {
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            
            if(other instanceof EntityPlayer) {
                // Make entity immovable
                this.vel.x = 0;
                this.pos.x = this.last.x;
                this.pos.y = this.last.y;

                if(axis == 'y' && this.pos.y > my_player.pos.y) {
                    if(!isCollapsed)
                    {
                        this.receiveDamage(1, other);
                        coll_dur = this.randomRange(this.collapsed_interval.min, this.collapsed_interval.max);
                        isCollapsed = true;
                        this.collapseTimer.set(0);
                        my_player.vel.y = -100;
                        my_player.vel.x = 280;
                        extraball = true;
                    }
                    // Fix for player sliding on top of item block
                    else if(other.vel.x == 0) {
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
  
        kill: function() {
            this.parent();

            // End level and transit to another level
            if(this.exit_when_killed)
                //ig.game.spawnEntity(EntityLevelexit, this.pos.x, this.pos.y);
                ig.game.toggleStats(this);
        }, // End kill method            
    }); // End Boomer
    
    // fireball
     EntityBalls = ig.Entity.extend({
        // Set up size and animation sheet for grenade
        size: {x: 8, y: 8},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/transfireballs.png', 8, 8 ),
        maxVel:{x: 100, y: 0},
        speed: 120,

        // Set up collision properties
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Initialize
        init: function( x, y, settings ) {
            this.parent( x , y, settings );
            this.addAnim('idle', 1, [0,1,2,3]);
            var xdir = this.flip ? 1 : -1;            
            this.vel.x = this.speed*xdir;
        }, // End init

        update: function() {
            this.parent();
            // Clean up: Auto-kill this entity if too far from player to prevent having too many entities on screen
            if(this.distanceTo(my_player) > ig.system.width)
                this.kill();
        }, // End update method

        // Override entity's collision against walls so it can pass through them.   
        handleMovementTrace: function( res ) {
            this.pos.x += this.vel.x*ig.system.tick;
        }, // End handleMovementTrace
        
        check: function( other ) {
            other.receiveDamage( 2, this );
            this.kill();
        }, // End check
    }); // End Entity
    
}); // End .defines
