/*
Walking skeleton
	- Walks back and forth
	- If player jumps on it, it will collapse into bones, and after a few seconds
	  it regenerates to it's normal form.
-------------
*/

ig.module('game.entities.enemies.skeleton')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntitySkeleton = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/skeleton.png', 33, 26),
        size: {x: 26, y: 26},
        flip: false,
        speed: 8,
        state: 'normal',
        stomp: new ig.Sound('media/sounds/sfx/smw_stomp_bones.*'),

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', 0.10, [0,1]);
            this.addAnim('collapse', 2, [2,3],true);
            this.wtimer = new ig.Timer();
        },

        

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            
            //console.log(this.state);
			
			//if skeleton is in walking state.
			if (this.state == 'normal')
			{
				var xdir = this.flip ? 1 : -1;
				this.currentAnim = this.anims.walk;
				this.vel.x = this.speed * xdir; 
				//this.wtimer.set(0);  
			}
			//if skeleton is in the state of collapse
			else if (this.state == 'collapse')
			{
				
				this.currentAnim = this.anims.collapse;
				this.vel.x = 0;
					
					if (this.wtimer.delta() >4)
					{
						this.currentAnim = this.anims.walk;
						this.state = 'normal';
						this.wtimer.set(0);
					}

			}
            this.parent();                     
        },
        
        //override basid_ai collideWith
        collideWith: function(other, axis) {
        	my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        	
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                // Prevents enemy from being killed from below.
                if(axis == 'y' && this.pos.y > my_player.pos.y) {
                    if(this.state != 'collapse') {
                		// set skeleton state to collapse, player bounce forward
                    	this.state = 'collapse';
                    	this.wtimer.set(0);
                    	my_player.vel.y = -100;
                    	my_player.vel.x = 200;
                    } else {
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
            }
        }, // End collideWith method     

        receiveDamage: function(value, other) {
            // If receiving damage due to non-player collision (assume hammer or fireball) --> Negate damage
            if(!(other instanceof EntityPlayer))
                value = 0;
            this.parent(value, other);
        } // End receiveDamage method
    }); // End EntitySkeleton
}); // End .defines
