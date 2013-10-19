/*
Pipe
----
Enables player to traverse to different levels.
*/

ig.module('game.entities.miscellaneous.pipe')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityPipe = ig.Entity.extend({
        // Set up collision
        //type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH, // If type B collides with type A, call check() function
        //collides: ig.Entity.COLLIDES.NEVER,

        animSheet: new ig.AnimationSheet('media/pipes.png', 32, 32),
        size: {x: 32, y: 32},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {this.parent();},

        // Handle player transitions to different levels
        check: function(other) {
            if(other.pos.y < this.pos.y) {
                other.pos.y = this.pos.y - other.size.y;
                if(other instanceof EntityPlayer) {
                    if(ig.input.state('continue')) {
                        if(this.level)
                            ig.game.myDirector.loadLevel(this.level);
                        else
                            ig.game.myDirector.nextLevel();
                    }
                }
            } else {
                if(other instanceof EntityPlayer) {
                    if(other.pos.x <= this.pos.x)
                        other.pos.x = this.pos.x - other.size.x;
                    else
                        other.pos.x = this.pos.x + this.size.x;
                } else {
                    other.flip = !other.flip;
                    other.currentAnim.flip.x = other.flip;
                }
            }
        }
    }); // End EntityPipe
}); // End .defines
