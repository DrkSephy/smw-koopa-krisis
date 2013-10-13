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
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,

        size: {x: 8, y: 8},
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: '#d2691e',
        
        speed_vert: 35, // Defines vertical speed when climbing/descending ladders.

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {},

        // Handle player climbing/decending ladders
        check: function( other ) {
            // When player overlaps ladder, user must press a button to
            // navigate up/down the ladder
            if(other instanceof EntityPlayer) {
                if(ig.input.state('up'))
                    other.vel.y = -this.speed_vert;
                else if(ig.input.state('down'))
                    other.vel.y = this.speed_vert;
            }
        }
    }); // End EntityLadder
}); // End .defines
