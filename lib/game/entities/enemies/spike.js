/*
Spike
-----
This is the entity file for our first monster.
The behavior of this entity is similar to many
Mario-esque enemies, so this code will be highly
reuseable.

Enemy Behavior:
---------------
    1. Moves side to side on a platform.
    2. Does not fall off platform by detecting
       when close to an edge.
    3. Does not shoot projectiles, it's only 
       means of damaging the player is by 
       physical contact between the two entities.
*/

ig.module('game.entities.enemies.spike')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntitySpike = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/spike.png', 16, 9),
        size: {x: 16, y: 9},
        maxVel: {x: 100, y: 100},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 14,
        //health: 10,
        push_dist: 300,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.08, [0,1,2]);
        },

        update: function() {
            // Check if enemy is near edge. If so, return
            // Check if enemy hits anything in the collision map
            // If true, toggle `this`
            if(!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +4: this.size.x - 4),
                                             this.pos.y + this.size.y + 1))
                this.flip = !this.flip;
                
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        }
    }); // End EntitySpike
}); // End .defines
