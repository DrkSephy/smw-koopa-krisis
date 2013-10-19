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
        checkAgainst: ig.Entity.TYPE.BOTH, // If type A or B collides with type A, call check() function
        //collides: ig.Entity.COLLIDES.NEVER,

        animSheet: new ig.AnimationSheet('media/pipes.png', 32, 32),
        size: {x: 32, y: 32},
        
        pipeSpeed: 10,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);

            var onPipe = false;
            var usingPipe = false;

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {this.parent();},

        // Handle player transitions to different levels
        check: function(other) {
            if(other.pos.y <= this.pos.y - other.size.y + 4 && !this.usingPipe) {
                other.pos.y = this.pos.y - other.size.y;
                other.vel.y = 0;
                if(other instanceof EntityPlayer) {
                    this.onPipe = true;
                    if(ig.input.state('left') || ig.input.state('right'))
                        other.currentAnim = other.anims.run;
                    else if(ig.input.state('jump')) {
                        other.vel.y = -other.jump;
                        other.currentAnim = other.anims.jump;
                    } else
                        other.currentAnim = other.anims.idle;
                    
                    if(ig.input.state('continue') && this.onPipe && other.pos.x > this.pos.x && other.pos.x < this.pos.x + other.size.x) {
                        other.pos.x = this.pos.x + this.size.x/2 - other.size.x/2;
                        this.usingPipe = true;
                    }
                }
            } else if(!this.usingPipe) {
                if(other instanceof EntityPlayer) {
                    this.onPipe = false;
                    if(other.pos.x <= this.pos.x)
                        other.pos.x = this.pos.x - other.size.x;
                    else
                        other.pos.x = this.pos.x + this.size.x;
                } else {
                    other.flip = !other.flip;
                    other.currentAnim.flip.x = other.flip;
                }
            } else {
                other.currentAnim = other.anims.idle;
                other.vel.y = this.pipeSpeed;
                if(other.pos.y > this.pos.y) {
                    if(this.level)
                        ig.game.myDirector.loadLevel(this.level);
                    else
                        ig.game.myDirector.nextLevel();
                }
            }
        }
    }); // End EntityPipe
}); // End .defines
