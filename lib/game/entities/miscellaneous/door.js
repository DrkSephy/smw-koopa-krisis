/*
door.js
-------
Used to move between levels
*/
ig.module(
    'game.entities.miscellaneous.door'
)
.requires(
    'impact.entity',
    'game.entities.gameplayer'
)
.defines(function(){
EntityDoor = ig.Entity.extend({
    // Set up collision
    // If group B touches group A, check
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,

    //Make door as small as possible, so it can be resized easily
    //Door entity will be invisible
    size: {x: 8, y: 8},
    _wmScalable: true,
    _wmDrawBox:  true,
    _wmBoxColor: 'rgba(80, 175, 242, 0.5)',

    //Set level to null, should be set in weltmeister
    level: null,

    // Player entity type
    player: 'EntityGameplayer',

    // Initialize Entity
    init: function(x, y, settings) {
        // Load player object if not in weltmeister
        this.parent(x,y,settings);
        if (!ig.global.wm)
            my_player = ig.game.getEntitiesByType(this.player)[0];
    },

    update: function() {},

    check: function( other ) {
        //When Player is on top of door, he must press a button to go to the level
        //assigned to the door in weltmeister
        this.parent(other);
        if(ig.input.pressed('continue')){
            if(other instanceof eval(this.player)){
                if( this.level ) {
                    ig.game.myDirector.loadLevel( this.level );
                } 
                else {
                    ig.game.myDirector.nextLevel();
                };
            }
        }
    }
}); // End EntityDoor
}); // End .defines
