/*
Bowser Statue
--------------
1. Stationary character that spawns a flame.
*/

ig.module('game.entities.enemies.bowser_statue')
.requires('game.entities.ai.basic_ai','game.entities.miscellaneous.flame')

.defines(function() {
    EntityBowser_statue = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/bowser_statue.png', 24, 24),
        size: {x: 24, y: 24},
        maxVel: {x: 0, y: 100},
        health: 50,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.shootTimer = new ig.Timer();
        },

        update: function() {
            this.parent();

            // shoots after a certain time the last flame was spawned
            if(this.shootTimer.delta() > 7) {
                // spawn flame
                ig.game.spawnEntity(EntityFlame, this.pos.x-35, this.pos.y+6, {flip: this.flip});
                this.shootTimer.set(0);
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
	});
}); // End EntityBowser_statue