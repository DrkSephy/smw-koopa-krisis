/*
gate.js
-------
Blocks access to levels
*/
ig.module(
    'game.entities.miscellaneous.gate'
)
.requires(
    'impact.entity',
    'impact.game',
    'game.entities.player',
    'game.entities.overworldplayer'
)
.defines(function(){
EntityGate = ig.Entity.extend({
    // Set up collision    
    type: ig.Entity.TYPE.B, // TYPE.B: unfriendly group (monsters)
    checkAgainst: ig.Entity.TYPE.A, // If group B touches group A, group A is hurt  
    collides: ig.Entity.COLLIDES.FIXED,
    friction: {x: 0, y: 0},
    gravityFactor: 0,

    //Make door as small as possible, so it can be resized easily
    //Door entity will be invisible
    size: {x: 8, y: 8},
    _wmScalable: true,
    _wmDrawBox:  true,
    _wmBoxColor: 'rgba(100, 225, 42, 0.5)',

    //Set level to null, should be set in weltmeister
    level: null,

    // Player entity type
    player: 'EntityOverworldplayer',

    // Initialize Entity
    init: function(x, y, settings) {
        // Load player object if not in weltmeister
        this.parent(x,y,settings);
        if (!ig.global.wm)
            my_player = ig.game.getEntitiesByType(this.player)[0];
    },

    update: function() {
        this.parent();

        if (ig.game.maxStage >= this.level) {
            //console.log(this.level);
            this.collides = ig.Entity.COLLIDES.NEVER;

        }
    },
}); // End EntityGate
}); // End .defines
