/*
Pink Muncher
--------------

	1. Detects the player.
	2. If player is not close to it (you can determine what is "too close"), it plays frames [0], [1].
	3. If the player is getting close, it starts to jump up a few pixels (playing frame [2],[3]) and
	 repeatedly jumps back up everytime it lands.
	Note: The purpose of this enemy is to jump up and try to hit the player from below as they try to
		jump over it. It's up to the programmer to decide how high is enough, but note that the point
		of this enemy is to make the player be cautious of how high they jump (otherwise they'll get
		hit). 
	4. If the player is not "close", revert back to it's first two frames. 

*/

ig.module('game.entities.enemies.pink_muncher')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityPink_muncher = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/pink_muncher.png', 16, 16),
        size: {x: 16, y: 16},
        maxVel: {x: 0, y: 100},
        health: 50,


        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0,1]);
            this.addAnim('jump', .15, [2,3]);
            this.wTimer = new ig.Timer();
        },

        update: function() {
            var target_x, distance;
            target_x = my_player.pos.x;

            //distance between the player pink muncher
            distance = Math.abs(target_x - this.pos.x);

            if (this.standing && distance <=40 && this.wTimer.delta()) {
            	this.vel.y = -100;
            	this.currentAnim = this.anims.jump;
            }
            
            this.parent();
        },

        collideWith: function(other, axis) {
            if(other instanceof EntityPlayer)
                {
                	this.vel.x = 0;
					if(axis == 'y' && this.pos.y >= my_player.pos.y)
					{
						other.receiveDamage(1, this);
					}
                }
            },
	});
}); // End EntityPink_muncher