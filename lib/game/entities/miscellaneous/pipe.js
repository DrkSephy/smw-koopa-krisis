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

        // Set level and spawn position to null, should be set in Weltmeister
        level: null, // Example --> key: level, value: 2
        spawn: {x: null, y: null}, // Example --> key: spawn.x, value: 100
                                   //             key: spawn.y, value: 250
                                   // NOTE: Must set both spawn.x and spawn.y to work!

        pipeSpeed: 10, // Defines speed at which player descends into pipe

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);

            var onPipe = false; // Is player standing on pipe?
            var usingPipe = false; // Is player using pipe?

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {this.parent();},

        // Handle player transitions to different levels
        check: function(other) {
            // Entity is on pipe but not using it
            if(other.pos.y <= this.pos.y - other.size.y + 4 && !this.usingPipe) {
                other.pos.y = this.pos.y - other.size.y;
                // Entity is player; handles player animations (If entity is not player ignore entity)
                if(other instanceof EntityPlayer) {
                    this.onPipe = true;
                    // Handle player's movements while on pipe
                    if(ig.input.state('left') || ig.input.state('right')) {
                        if(ig.main.activePower == "EntityHammer")
                            other.currentAnim = other.anims.hammer_run;
                        else if(ig.main.activePower == "EntityFireball")
                            other.currentAnim = other.anims.fire_run;
                        else
                            other.currentAnim = other.anims.run;
                    } else if(ig.input.state('jump')) {
                        other.vel.y = -other.jump;
                        if(ig.main.activePower == "EntityHammer")
                            other.currentAnim = other.anims.hammer_jump;
                        else if(ig.main.activePower == "EntityFireball")
                            other.currentAnim = other.anims.fire_jump;
                        else
                            other.currentAnim = other.anims.jump;
                    } else {
                        if(ig.main.activePower == "EntityHammer")
                            other.currentAnim = other.anims.hammer_idle;
                        else if(ig.main.activePower == "EntityFireball")
                            other.currentAnim = other.anims.fire_idle;
                        else
                            other.currentAnim = other.anims.idle;
                    }

                    // Player uses pipe and is standing within acceptable boundaries of pipe
                    if(ig.input.state('continue') && this.onPipe && other.pos.x > this.pos.x && other.pos.x < this.pos.x + other.size.x) {
                        // Reposition player to center of pipe
                        other.pos.x = this.pos.x + this.size.x/2 - other.size.x/2;
                        // Start pipe usage
                        this.usingPipe = true;
                    }
                }
            // Entiy not on pipe
            } else if(!this.usingPipe) {
                // Entity is player; handle player-specific repositioning ("fake collision")
                if(other instanceof EntityPlayer) {
                    this.onPipe = false;
                    if(other.pos.x <= this.pos.x)
                        other.pos.x = this.pos.x - other.size.x;
                    else
                        other.pos.x = this.pos.x + this.size.x;
                // Entity is not player; handle other entity's repositioning
                } else {
                    other.flip = !other.flip;
                    other.currentAnim.flip.x = other.flip;
                }
            // Player is using pipe
            } else {
                // Play some player "using pipe" animation and begin to descend player down pipe
                if(ig.main.activePower == "EntityHammer")
                    other.currentAnim = other.anims.hammer_idle;
                else if(ig.main.activePower == "EntityFireball")
                    other.currentAnim = other.anims.fire_idle;
                else
                    other.currentAnim = other.anims.idle;
                other.vel.y = this.pipeSpeed;
                // If player is using pipe, make sure player STAYS IN THE PIPE!
                other.pos.x = this.pos.x + this.size.x/2 - other.size.x/2;
                // Player is completely inside pipe
                if(other.pos.y > this.pos.y) {
                    // Handle level transitioning
                    // Level property has been set in Weltmeister
                    if(this.level) {
                        // Transition to new level
                        ig.game.myDirector.loadLevel(this.level);
                        // Spawn position has been set in Weltmeister
                        if(this.spawn.x != null && this.spawn.y != null) {
                            // Move player to specified (x, y) position of new level
                            my_player.pos.x = this.spawn.x;
                            my_player.pos.y = this.spawn.y;
                        }
                    // Level property has NOT been set in Weltmeister
                    } else {
                        ig.game.myDirector.nextLevel();
                        // Spawn position has been set in Weltmeister
                        if(this.spawn.x != null && this.spawn.y != null) {
                            // Move player to specified (x, y) position of new level
                            my_player.pos.x = this.spawn.x;
                            my_player.pos.y = this.spawn.y;
                        }
                    }
                }
            }
        }
    }); // End EntityPipe
}); // End .defines
