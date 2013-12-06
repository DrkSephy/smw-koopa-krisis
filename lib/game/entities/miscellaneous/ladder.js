/*
Ladder
------
Enables player to navigate vertically up/down ladders or similar objects.
*/

ig.module('game.entities.miscellaneous.ladder')
.requires('impact.entity',
          'game.entities.player')

.defines(function() {
    EntityLadder = ig.Entity.extend({
        // Set up collision
        checkAgainst: ig.Entity.TYPE.A, // If type B collides with type A, call check() function
        collides: ig.Entity.COLLIDES.NEVER, // Don't affect other entities' movement on collision

        size: {x: 8, y: 8},
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: '#d2691e',

        speed_vert: 35, // Defines vertical speed when climbing/descending ladders

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Checks if player is actually climbing ladder instead of jumping/falling across it
            var isClimbing = false;

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {},

        // Handle player climbing/decending ladders
        check: function(other) {
            // When player overlaps ladder, user must press a button to
            // navigate up/down the ladder
            if(other instanceof EntityPlayer) {
                // Move up ladder
                if(ig.input.state('up')) {
                    this.isClimbing = true;
                    other.vel.y = -this.speed_vert;
                    if(ig.main.activePower == "EntityHammer")
                        other.currentAnim = other.anims.hammer_climb;
                    else if(ig.main.activePower == "EntityFireball")
                        other.currentAnim = other.anims.fire_climb;
                    else
                        other.currentAnim = other.anims.climb;
                // Move down ladder
                } else if(ig.input.state('down')) {
                    this.isClimbing = true;
                    other.vel.y = this.speed_vert;
                    if(ig.main.activePower == "EntityHammer")
                        other.currentAnim = other.anims.hammer_climb;
                    else if(ig.main.activePower == "EntityFireball")
                        other.currentAnim = other.anims.fire_climb;
                    else
                        other.currentAnim = other.anims.climb;
                // Player is climbing ladder (not jumping/falling across it)
                } else if(this.isClimbing && !ig.input.state('jump')) {
                    // Prevents player from auto-falling down ladder
                    other.pos.y = other.last.y;
                    // Prevents player from become stuck in jump/fall animation
                    if(ig.main.activePower == "EntityHammer")
                        other.currentAnim = other.anims.hammer_climb_idle;
                    else if(ig.main.activePower == "EntityFireball")
                        other.currentAnim = other.anims.fire_climb_idle;
                    else
                        other.currentAnim = other.anims.climb_idle;
                // Player is not climbing ladder; Ignore player's current interactions
                } else {
                    this.isClimbing = false;
                }
            }
        }
    }); // End EntityLadder
}); // End .defines
