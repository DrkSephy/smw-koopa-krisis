/*
Fire bros
	- Walks back and forth
	- Shoots a series of fireballs (spread out over time), rest, and then begin
	  to fire again
-------------
*/

ig.module('game.entities.enemies.fire_bros')
.requires('game.entities.ai.basic_ai',
		  'game.entities.miscellaneous.fireball')

.defines(function() {
    EntityFire_bros = EntityBasic_ai.extend({

        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/firebros.png', 16, 24),
        size: {x: 16, y: 24},
        stomp: new ig.Sound('media/sounds/sfx/smw_stomp.*'),



        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', 0.3, [0]);
            this.wtimer = new ig.Timer();
        },

        

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			var xdir = this.flip ? 1 : -1;
			this.vel.x = this.speed * xdir; 
			
			if(this.wtimer.delta()>3)
			{
				//first fireball
				ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y, {  checkAgainst: ig.Entity.TYPE.A,
																			   collides: ig.Entity.COLLIDES.PASSIVE,
																			   flip: !this.flip,
																			   bounciness: 0,
																			   arc_distance: 80,
																			   arc_height: 180});
				//second fireball
				ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y, {  checkAgainst: ig.Entity.TYPE.A,
																			   collides: ig.Entity.COLLIDES.PASSIVE,
																			   flip: !this.flip,
																			   bounciness: 0,
																			   arc_distance: 60,
																			   arc_height: 200});	
				this.wtimer.set(0);
																			   																			   																		   
			}
						
            this.parent();                     
        },
           
    }); // End EntityFire_bros
}); // End .defines
