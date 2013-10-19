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
        checkAgainst: ig.Entity.TYPE.A, // If type B collides with type A, call check() function
        collides: ig.Entity.COLLIDES.NEVER, // Don't affect other entities movement on collision

        size: {x: 8, y: 8},
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: '#d2691e',

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Load player object if not in Weltmeister
            if (!ig.global.wm)
                my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
        },

        update: function() {},

        // Handle player transitions to different levels
        check: function( other ) {}
    }); // End EntityPipe
}); // End .defines
