/*
Muncher
-------
Classic Mario enemy that does not
take damage when jumped on. Damages
the player on collision.
*/

ig.module('game.entities.enemies.muncher')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityMuncher = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/muncher.png', 25, 26),
        size: {x: 25, y: 19},
        maxVel: {x: -10, y: 0},
        flip: true,
        friction: {x: 1000, y: 0},
        speed: 0,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.20, [0,1]);
            this.offset.x = 0;
            this.offset.y = 1;
        },

        update: function() {
            //var xdir = this.flip ? -1 : 1;
            //this.vel.x = this.speed * xdir;
            this.parent();
        },

        // Override basic AI
        collideWith: function(other, axis) {
            // Only do something if colliding with the Player
            if(other instanceof EntityPlayer) {
                // Prevents enemy from being killed from below.
                if(axis == 'y' && this.pos.y >= my_player.pos.y) {
                    other.receiveDamage(1, this);
                    //ig.game.score += 1;
                } else {
                    other.receiveDamage(1, this);
                    // Push player back if collides with enemy.
                    if(other.pos.x > this.pos.x)
                        other.vel.x = 50;
                    else
                        other.vel.x = -50;
                }

                if(other.health <= 0)
                    my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
            }
        }
    }); // End EntitySpiketop
}); // End .defines
